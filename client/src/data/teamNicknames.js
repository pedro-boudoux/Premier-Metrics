export const TEAM_NICKNAMES = {
  "Arsenal": "Gunners",
  "Aston Villa": "Villans",
  "Bournemouth": "Cherries",
  "Brentford": "Bees",
  "Brighton": "Seagulls",
  "Chelsea": "Blues",
  "Crystal Palace": "Eagles",
  "Everton": "Toffees",
  "Fulham": "Cottagers",
  "Ipswich Town": "Tractor Boys",
  "Leicester City": "Foxes",
  "Liverpool": "Reds",
  "Manchester City": "Citizens",
  "Manchester United": "Red Devils",
  "Manchester Utd": "Red Devils",
  "Newcastle United": "Magpies",
  "Newcastle Utd": "Magpies",
  "Nottingham Forest": "Forest",
  "Southampton": "Saints",
  "Tottenham": "Spurs",
  "West Ham": "Hammers",
  "Wolverhampton Wanderers": "Wolves",
  "Wolves": "Wolves"
};

export const getTeamDisplayName = (teamName) => {
  return TEAM_NICKNAMES[teamName] || teamName;
};
