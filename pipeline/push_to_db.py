"""
Push Formatted Data to Supabase Database
Reads CSV files from pipeline/data/formatted/ and pushes them to Supabase
"""
import os
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Paths
SCRIPT_DIR = Path(__file__).resolve().parent
FORMATTED_DIR = SCRIPT_DIR / 'data' / 'formatted'

# Get database_url from environment
database_url = os.getenv('DATABASE_URL').strip().strip('"').strip("'")

if not database_url:
    raise ValueError("database_url not found in environment variables. Please set it in .env file")



def get_engine():
    """Create SQLAlchemy engine from database_url"""
    logger.info("Connecting to Supabase database...")
    engine = create_engine(database_url)
    return engine


def get_existing_columns(engine, table_name):
    """Get list of existing columns in a table"""
    with engine.connect() as conn:
        result = conn.execute(text(f"""
            SELECT column_name FROM information_schema.columns
            WHERE table_name = :table_name
            ORDER BY ordinal_position
        """), {'table_name': table_name})
        return [row[0] for row in result.fetchall()]


def get_primary_key(engine, table_name):
    """Get primary key column(s) for a table"""
    with engine.connect() as conn:
        result = conn.execute(text(f"""
            SELECT a.attname
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            JOIN pg_class c ON c.oid = i.indrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE i.indisprimary
            AND c.relname = :table_name
            AND n.nspname = 'public'
        """), {'table_name': table_name})
        rows = result.fetchall()
        return [row[0] for row in rows]


def add_missing_columns(engine, table_name, missing_cols, df):
    """Add missing columns to existing table"""
    with engine.connect() as conn:
        for col in missing_cols:
            # Determine column type
            if col in ['matches', 'minutes', 'goals', 'shots', 'saves', 'goals_conceded', 
                      'tackles_won', 'interceptions', 'duels_won', 'punches', 'high_claims',
                      'recoveries', 'touches', 'passes_accurate', 'long_balls_accurate',
                      'clean_sheet']:
                col_type = 'BIGINT'
            elif col in ['xg', 'np_xg', 'goals_prevented', 'xgot_faced']:
                col_type = 'FLOAT'
            else:
                col_type = 'TEXT'
            
            logger.info(f"  Adding column '{col}' as {col_type}")
            conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS {col} {col_type}"))
        conn.commit()


def push_table(engine, table_name, csv_path):
    """
    Push a CSV file to a database table with upsert logic
    
    Parameters:
    -----------
    engine : SQLAlchemy engine
    table_name : str
        Name of the database table
    csv_path : Path
        Path to the CSV file
    """
    logger.info(f"\n{'='*60}")
    logger.info(f"PUSHING TABLE: {table_name}")
    logger.info(f"{'='*60}")
    
    # Read CSV
    df = pd.read_csv(csv_path)
    logger.info(f"Loaded {len(df)} rows from {csv_path.name}")
    
    # Define our desired columns
    all_columns = {
        'players': ['first_name', 'last_name', 'team', 'positions', 'matches', 'minutes', 'yellow_cards', 'red_cards'],
        'defensive': ['name', 'tackles_won', 'interceptions', 'duels_won'],
        'offensive': ['name', 'goals', 'shots', 'xg', 'np_goals', 'np_xg'],
        'keepers': ['name', 'saves', 'goals_conceded', 'punches', 'high_claims', 'recoveries', 
                   'touches', 'passes_accurate', 'long_balls_accurate', 'goals_prevented', 
                   'xgot_faced', 'clean_sheet']
    }
    
    columns = all_columns[table_name]
    
    # Check if table exists
    with engine.connect() as conn:
        check_query = text(f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)")
        result = conn.execute(check_query, {'table_name': table_name}).scalar()
    
    if result:
        # Table exists - get existing columns and add missing ones
        existing_cols = get_existing_columns(engine, table_name)
        logger.info(f"Table '{table_name}' already exists with columns: {existing_cols}")
        
        # Check if there are missing columns we need to add
        missing_cols = [col for col in columns if col not in existing_cols]
        if missing_cols:
            logger.info(f"Adding missing columns: {missing_cols}")
            add_missing_columns(engine, table_name, missing_cols, df)
        
        # Get primary key for upsert
        pk_cols = get_primary_key(engine, table_name)
        logger.info(f"Primary key: {pk_cols}")
        
        if table_name == 'players':
            # Players table: use full_name as unique key (it's a generated column)
            # But we need to insert first_name, last_name and let DB generate full_name
            # For upsert, we use (first_name, last_name, team) to match
            unique_key = ('first_name', 'last_name', 'team')
            
            # For players, we'll use a different approach - just do UPDATE or INSERT
            # First try UPDATE, then INSERT new rows
            logger.info("Using (first_name, last_name, team) as unique key for players")
        else:
            # Other tables: use name as primary key
            unique_key = tuple(pk_cols) if pk_cols else ('name',)
    else:
        # Create table
        logger.info(f"Creating table '{table_name}'...")
        with engine.connect() as conn:
            cols_sql = []
            for col in columns:
                if col in ['matches', 'minutes', 'goals', 'shots', 'saves', 'goals_conceded', 
                          'tackles_won', 'interceptions', 'duels_won', 'punches', 'high_claims',
                          'recoveries', 'touches', 'passes_accurate', 'long_balls_accurate',
                          'clean_sheet']:
                    col_type = 'BIGINT'
                elif col in ['xg', 'np_xg', 'goals_prevented', 'xgot_faced']:
                    col_type = 'FLOAT'
                else:
                    col_type = 'TEXT'
                cols_sql.append(f"{col} {col_type}")
            
            create_sql = f"CREATE TABLE {table_name} ({', '.join(cols_sql)})"
            conn.execute(text(create_sql))
            conn.commit()
            logger.info(f"Table '{table_name}' created")
        
        if table_name == 'players':
            unique_key = ('first_name', 'last_name', 'team')
        else:
            unique_key = ('name',)
    
    # Filter out rows that don't have matching players (for tables with FK constraints)
    if table_name != 'players':
        with engine.connect() as conn:
            result = conn.execute(text("SELECT full_name FROM players"))
            valid_names = set([row[0] for row in result.fetchall()])
        
        original_count = len(df)
        df = df[df['name'].isin(valid_names)]
        logger.info(f"Filtered to {len(df)}/{original_count} rows with matching players")
    
    # Upsert data
    logger.info(f"Upserting {len(df)} rows...")
    
    # Build INSERT ON CONFLICT statement
    columns_str = ', '.join(columns)
    update_cols = [col for col in columns if col not in unique_key]
    update_str = ', '.join([f"{col} = EXCLUDED.{col}" for col in update_cols])
    
    conflict_keys = ', '.join(unique_key)
    insert_sql = text(f"""
        INSERT INTO {table_name} ({columns_str})
        VALUES ({', '.join([':' + col for col in columns])})
        ON CONFLICT ({conflict_keys})
        DO UPDATE SET {update_str}
    """)
    
    # Insert data in batches
    batch_size = 100
    for i in range(0, len(df), batch_size):
        batch = df.iloc[i:i+batch_size]
        records = batch.to_dict('records')
        
        with engine.connect() as conn:
            conn.execute(text("BEGIN"))
            for record in records:
                clean_record = {}
                for key, value in record.items():
                    if pd.isna(value):
                        clean_record[key] = None
                    elif isinstance(value, (pd.Timestamp, pd.Timedelta)):
                        clean_record[key] = str(value)
                    else:
                        clean_record[key] = value
                conn.execute(insert_sql, clean_record)
            conn.execute(text("COMMIT"))
        
        logger.info(f"  Inserted rows {i+1} to {min(i+batch_size, len(df))}")
    
    logger.info(f"✓ Successfully pushed {len(df)} rows to '{table_name}' table")
    
    # Show sample data
    with engine.connect() as conn:
        result = conn.execute(text(f"SELECT * FROM {table_name} LIMIT 5"))
        rows = result.fetchall()
        logger.info(f"\nSample data from {table_name}:")
        for row in rows:
            logger.info(f"  {row}")


def push_all_tables():
    """
    Push all formatted CSV files to the database
    """
    logger.info("\n" + "="*80)
    logger.info("PUSHING ALL FORMATTED DATA TO SUPABASE")
    logger.info("="*80)
    
    # Extract database host from URL for logging
    if database_url and '@' in database_url:
        db_host = database_url.split('@')[1]
    else:
        db_host = 'Unknown'
    logger.info(f"Database: {db_host}")
    
    # Get database connection
    engine = get_engine()
    
    # Test connection
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            logger.info("✓ Database connection successful")
    except Exception as e:
        logger.error(f"✗ Database connection failed: {e}")
        raise
    
    # Truncate all tables before inserting fresh data
    logger.info("\nTruncating existing data from all tables...")
    with engine.connect() as conn:
        conn.execute(text("TRUNCATE TABLE players, defensive, offensive, keepers RESTART IDENTITY CASCADE"))
        conn.commit()
        logger.info("✓ All tables truncated")
    
    # Push each table
    table_mappings = {
        'players': FORMATTED_DIR / 'players.csv',
        'defensive': FORMATTED_DIR / 'defensive.csv',
        'offensive': FORMATTED_DIR / 'offensive.csv',
        'keepers': FORMATTED_DIR / 'keepers.csv'
    }
    
    for table_name, csv_path in table_mappings.items():
        if csv_path.exists():
            push_table(engine, table_name, csv_path)
        else:
            logger.warning(f"✗ File not found: {csv_path}")
    
    # Final summary
    logger.info("\n" + "="*80)
    logger.info("PUSH COMPLETE!")
    logger.info("="*80)
    
    # Show table counts
    with engine.connect() as conn:
        logger.info("\nTable row counts:")
        for table_name in table_mappings.keys():
            result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            count = result.scalar()
            logger.info(f"  {table_name}: {count} rows")
    
    # Clean up CSV files
    logger.info("\n" + "="*80)
    logger.info("CLEANING UP CSV FILES")
    logger.info("="*80)
    
    import shutil
    
    # Delete contents of raw directory
    raw_dir = SCRIPT_DIR / 'data' / 'raw'
    if raw_dir.exists():
        for file in raw_dir.glob('*'):
            if file.is_file():
                file.unlink()
                logger.info(f"  Deleted: {file.name}")
            elif file.is_dir():
                shutil.rmtree(file)
                logger.info(f"  Deleted directory: {file.name}")
    
    # Delete contents of formatted directory
    if FORMATTED_DIR.exists():
        for file in FORMATTED_DIR.glob('*'):
            if file.is_file():
                file.unlink()
                logger.info(f"  Deleted: {file.name}")
    
    logger.info("✓ All CSV files cleaned up")


def show_table_schema(table_name):
    """
    Show the schema of a table in the database
    """
    engine = get_engine()
    
    with engine.connect() as conn:
        result = conn.execute(text(f"""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = :table_name
            ORDER BY ordinal_position
        """), {'table_name': table_name})
        rows = result.fetchall()
        
        print(f"\nSchema for '{table_name}' table:")
        print("-" * 50)
        for row in rows:
            print(f"  {row[0]:25s} {row[1]:15s} {'NULL' if row[2] else 'NOT NULL'}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--schema':
        # Show schema for specific table
        if len(sys.argv) > 2:
            show_table_schema(sys.argv[2])
        else:
            # Show all table schemas
            for table in ['players', 'defensive', 'offensive', 'keepers']:
                show_table_schema(table)
    else:
        # Push all tables
        push_all_tables()
