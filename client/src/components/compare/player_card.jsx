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

    // Update local state when prop changes
    React.useEffect(() => {
        setSelectedPlayer(initialPlayer);
    }, [initialPlayer]);

    return (
        <div className="player-card">
            {!selectedPlayer ? (
                <div className="search-container">
                    {!isSearching ? (
                        <button 
                            className="search-button"
                            onClick={() => setIsSearching(true)}
                        >
                            Select Player
                        </button>
                    ) : (
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
            ) : (
                <div className="player-info">
                    <h3>{selectedPlayer.full_name}</h3>
                    <button 
                        className="change-player"
                        onClick={() => {
                            setSelectedPlayer(null);
                            onSelect(null);
                            setIsSearching(true);
                        }}
                    >
                        Change Player
                    </button>
                </div>
            )}
        </div>
    );
};