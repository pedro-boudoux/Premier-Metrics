import React, { useState } from "react";
import { SearchSuggestions } from "../shared/SearchSuggestions";
import { getTeamDisplayName } from "../../data/teamNicknames";

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
        <div className="rounded-3xl px-8 py-8 min-h-64 shadow-premier transition-all duration-300 relative box-border flex flex-col" style={cardStyle}>
            <button className="absolute top-6 right-6 bg-white bg-opacity-20 border-0 text-premier-dark w-10 h-10 rounded-full cursor-pointer transition-all hover:bg-opacity-30 hover:scale-105 flex items-center justify-center p-0 z-20" onClick={handleSearchClick} aria-label="Search for player">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
            </button>
            
            {!selectedPlayer ? (
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex flex-col items-start text-white flex-grow mb-4">
                        <span className="text-5xl font-light leading-tight">Select</span>
                        <span className="text-7xl font-bold leading-none -tracking-1">Player</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex flex-col items-start text-white flex-grow mb-4">
                        {selectedPlayer.full_name.includes(" ") ? (
                            <>
                                <span className="text-5xl font-light leading-tight">{selectedPlayer.full_name.split(" ")[0]}</span>
                                <span className="text-5xl md:text-7xl font-bold leading-none -tracking-1">{selectedPlayer.full_name.split(" ").slice(1).join(" ")}</span>
                            </>
                        ) : (
                            <span className="text-7xl font-bold leading-none -tracking-1">{selectedPlayer.full_name}</span>
                        )}
                    </div>
                    <div className="flex justify-between items-center text-white text-base w-full mt-auto">
                        <span className="flex items-center gap-2 font-medium">
                            <img src={"images/compare/badges/" + selectedPlayer.team.name + "1.png"} alt={selectedPlayer.team.name} className="w-8 h-8 object-contain" />
                            {getTeamDisplayName(selectedPlayer.team.name)}
                        </span>
                        <span className="font-medium uppercase tracking-wider">{selectedPlayer.positions || "FWD"} {selectedPlayer.nationality}</span>
                    </div>
                </div>
            )}
            
            {isSearching && (
                <div className="absolute inset-0 rounded-3xl p-3 md:p-4 flex flex-col gap-2" style={{background: `linear-gradient(180deg, #37003c 0%, #241d2d 100%)`, zIndex: 9999}}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search..."
                            className="flex-1 min-w-0 px-3 md:px-4 py-2 border border-gray-300 rounded-3xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-premier-blue"
                            autoFocus
                        />
                        <button 
                            className="bg-white bg-opacity-20 border-0 text-premier-dark w-12 h-12 flex items-center justify-center rounded-full hover:bg-opacity-30 transition-all hover:scale-105 cursor-pointer p-0"
                            onClick={() => {
                                setIsSearching(false);
                                setSearchInput("");
                            }}
                            aria-label="Close search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </div>
                    <div className="relative">
                        {searchInput && (
                            <SearchSuggestions 
                                input={searchInput}
                                endpoint="player-search"
                                mode="select"
                                onSelect={handlePlayerSelect}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};