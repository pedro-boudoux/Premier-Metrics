import React, { useEffect, useRef } from "react";

/**
 * PlayerProfileCard - Displays the player's profile header with team colors
 * 
 * Props:
 * - playerData: Player object with full_name, first_name, last_name, positions, team, nation
 * - team: Team array with team_color and team_color_darker
 */
export const PlayerProfileCard = ({ playerData, team }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      // Use team colors if available, otherwise use Premier League purple fallback
      const teamData = Array.isArray(team) && team.length > 0 ? team[0] : null;
      const primaryColor = teamData?.team_color || '#37003c';
      const darkerColor = teamData?.team_color_darker || '#241d2d';
      cardRef.current.style.backgroundImage = `linear-gradient(to bottom, ${primaryColor}, ${darkerColor})`;
      cardRef.current.style.color = 'white';
    }
  }, [team]);

  return (
    <div 
      ref={cardRef}
      className="profile-card flex flex-col md:flex-row justify-between p-5 md:px-10 w-full h-auto md:min-h-[320px] items-center rounded-3xl shadow-premier gap-6 md:gap-0 mb-8 md:mb-12"
    >
      <div className="flex flex-col md:flex-col w-full md:w-auto">
        <h2 className="text-4xl md:text-6xl text-white m-0">{playerData.first_name}</h2>
        <h1 className="text-5xl md:text-7xl text-white mb-0 mt-0">{playerData.last_name}</h1>
      </div>

      <div className="flex flex-row md:!flex-col gap-4 md:gap-2 items-center md:items-end w-full md:w-auto justify-between md:justify-start">
        <p className="text-base md:text-lg text-white m-0 leading-tight">
          {playerData.positions}
        </p>

        <div className="flex flex-row md:!flex-col gap-2 items-center md:items-end">
          <p className="text-base md:text-lg text-white hidden md:block m-0">
            {playerData.team}
          </p>
          <img
            src={"/images/compare/badges/" + playerData.team + "1.png"}
            alt={playerData.team}
            className="h-[1.125rem] md:h-[1.25rem] w-auto object-contain"
          />
        </div>

      </div>
    </div>
  );
};
