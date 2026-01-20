export const STAT_SECTIONS = {
    offensive: {
        title: "Offensive Stats",
        key: "offensive",
        fields: [
            { label: "Goals", key: "goals" },
            { label: "Shots", key: "shots" },
            { label: "xG", key: "xg" },
            { label: "Non-Penalty Goals", key: "np_goals" },
            { label: "npxG", key: "np_xg" },
        ],
    },
    defensive: {
        title: "Defensive Stats",
        key: "defensive",
        fields: [
            { label: "Tackles Won", key: "tackles_won" },
            { label: "Interceptions", key: "interceptions" },
            { label: "Duels Won", key: "duels_won" },
        ],
    },
    keepers: {
        title: "Goalkeeping Stats",
        key: "keepers",
        fields: [
            { label: "Saves", key: "saves" },
            { label: "Goals Conceded", key: "goals_conceded" },
            { label: "Punches", key: "punches" },
            { label: "High Claims", key: "high_claims" },
            { label: "Recoveries", key: "recoveries" },
            { label: "Touches", key: "touches" },
            { label: "Accurate Passes", key: "passes_accurate" },
            { label: "Accurate Long Balls", key: "long_balls_accurate" },
            { label: "Goals Prevented", key: "goals_prevented" },
            { label: "xGOT Faced", key: "xgot_faced" },
            { label: "Clean Sheets", key: "clean_sheet" },
        ],
    },
};
