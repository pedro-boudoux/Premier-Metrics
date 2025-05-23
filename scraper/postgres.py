def import_csv_to_postgres(csv_path, table_name, conn):
    import pandas as pd
    from io import StringIO
    import uuid
    # Read CSV with more lenient null value handling
    df = pd.read_csv(csv_path, na_values=["na", "NA", "NaN", "", "None", "#N/A"], keep_default_na=True)

    # Replace empty strings and other potential null markers with NaN
    df = df.replace(["", "null", "NULL", "#N/A"], pd.NA)

    # Convert numeric columns to appropriate types, preserving NaN
    numeric_cols = df.select_dtypes(include=['float64', 'int64', 'Int64']).columns
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        # Replace NaN with 0 for numeric columns
        df[col] = df[col].fillna(0)

    # For non-numeric columns, keep as None/NULL
    for col in df.columns:
        if col not in numeric_cols:
            df[col] = df[col].where(df[col].notna(), None)

    # Handle special columns
    if table_name == "players":
        # Convert sequential IDs to UUIDs
        if "id" in df.columns:
            df["id"] = df.apply(lambda _: str(uuid.uuid4()), axis=1)
        # Handle age column
        if "age" in df.columns:
            df["age"] = pd.to_numeric(df["age"], errors="coerce").astype('Int64')
            df["age"] = df["age"].fillna(0)

    buffer = StringIO()
    df.to_csv(buffer, index=False, header=False)
    buffer.seek(0)
    cur = conn.cursor()
    # Truncate table before import (optional, comment out if not desired)
    cur.execute(f'TRUNCATE TABLE "{table_name}" RESTART IDENTITY CASCADE;')
    columns = ','.join([f'"{col}"' for col in df.columns])
    cur.copy_expert(f'COPY "{table_name}" ({columns}) FROM STDIN WITH CSV', buffer)
    conn.commit()
    cur.close()