import React, { useState } from "react";
import axios from "axios";
import "./player_card.css";

const PlayerSuggestions = ({ input, onPlayerSelect }) => {
    const [suggestions, setSuggestions] = useState([]);

    React.useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axios.post("http://localhost:8855/player-search", {
                    search: input
                });
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching player suggestions:", error);
            }
        };

        if (input) {
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [input]);

    return (
        <div className="player-suggestions">
            {suggestions.map((player, index) => (
                <div 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => onPlayerSelect(player)}
                >
                    {player.full_name}
                </div>
            ))}
            {input && suggestions.length === 0 && (
                <div className="no-suggestions">No players found</div>
            )}
        </div>
    );
};

export const PlayerCard = ({ onSelect, selectedPlayer: initialPlayer }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState(initialPlayer);

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
        setIsSearching(false);
        setSearchInput("");
        onSelect(player);
    };

    React.useEffect(() => {
        setSelectedPlayer(initialPlayer);
    }, [initialPlayer]);

    const cardStyle = selectedPlayer?.team?.colors ? {
        background: `linear-gradient(180deg, ${selectedPlayer.team.colors.primary} 0%, ${selectedPlayer.team.colors.darker} 100%)`
    } : {
        background: `linear-gradient(180deg, #37003c 0%, #241d2d 100%)`
    };

    const handleSearchClick = () => {
        setSelectedPlayer(null);
        onSelect(null);
        setIsSearching(true);
    };

    return (
        <div className="player-card" style={cardStyle}>
            <button className="search-icon" onClick={handleSearchClick} aria-label="Search for player">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
            </button>
            
            {!selectedPlayer ? (
                <div className="player-info empty-state">
                    <div className="player-name">
                        <span className="first-name">Select</span>
                        <span className="last-name">Player</span>
                    </div>
                </div>
            ) : (
                <div className="player-info">
                    <div className="player-name">
                        {selectedPlayer.full_name.includes(" ") ? (
                            <>
                                <span className="first-name">{selectedPlayer.full_name.split(" ")[0]}</span>
                                <span className="last-name">{selectedPlayer.full_name.split(" ").slice(1).join(" ")}</span>
                            </>
                        ) : (
                            <span className="single-name">{selectedPlayer.full_name}</span>
                        )}
                    </div>
                    <div className="player-details">
                        <span className="team-name">
                            <img src={"images/compare/badges/" + selectedPlayer.team.name + "1.png"} alt={selectedPlayer.team.name} className="team-logo" />
                            {selectedPlayer.team.name}
                        </span>
                        <span className="position">{selectedPlayer.positions || "FWD"} {selectedPlayer.nationality}</span>
                    </div>
                </div>
            )}
            
            {isSearching && (
                <div className="search-input-container">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for a player..."
                        className="search-input"
                        autoFocus
                    />
                    <button 
                        className="close-search"
                        onClick={() => {
                            setIsSearching(false);
                            setSearchInput("");
                        }}
                    >
                        ×
                    </button>
                    {searchInput && (
                        <PlayerSuggestions 
                            input={searchInput}
                            onPlayerSelect={handlePlayerSelect}
                        />
                    )}
                </div>
            )}
        </div>
    );
};