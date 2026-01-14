import React from "react";
import { LeagueTable } from "../components/home/league_table";

export const Home = () => {
  return (
    <>
      <div className="flex flex-col w-full">
        {/* Hero Section */}
        <div className="flex flex-col gap-8 md:gap-12 items-center w-full px-4 md:px-8 py-8 md:py-12">
          <div className="max-w-6xl w-full">
            <h1 className="text-4xl md:text-6xl text-premier-dark font-bold mb-4">Welcome to Premier Metrics!</h1>

            <p className="text-base md:text-lg text-gray-500 mb-6">
              Take a deep look at the stats of every Premier League Player for
              the 2024/2025 season. From expected goals to pressing stats, here
              you can look at and compare every single statistic there is.
              Whether you are just a casual fan who's interested in the stats,
              a FPL manager, or a dedicated hate-watcher, we have your back!
            </p>

            <a href="#about" className="inline-flex justify-center items-center bg-premier-gradient hover:opacity-90 text-white font-semibold py-3 px-8 rounded-full shadow-premier transition-all duration-200 text-sm md:text-base max-w-max hover:scale-105 hover:shadow-lg no-underline">
              About
            </a>
          </div>

          <img src="\images\home\hero.jpg" alt="Premier Metrics Hero" className="w-full max-w-6xl rounded-3xl shadow-premier" />
        </div>

        {/* Statistics Cards Section */}
        <div className="w-full px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-premier-dark text-center mb-8 font-bold">In depth statistics, made easy</h2>
            <div className="flex flex-col md:flex-row gap-5 md:gap-8">
              <div className="flex flex-col text-gray-500 w-full flex-1 gap-4">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img src="/images/home/card1.png" alt="Player Kicking Ball" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-grow gap-1">
                  <p className="font-semibold text-premier-blue text-base md:text-lg leading-tight">Take a closer look at players!</p>
                  <p className="text-sm md:text-base leading-relaxed">
                    Easily see which players are performing/underperforming and in what areas.
                  </p>
                </div>
              </div>

              <div className="flex flex-col text-gray-500 w-full flex-1 gap-4">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img src="/images/home/card2.png" alt="Player Kicking Ball" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-grow gap-1">
                  <p className="font-semibold text-premier-blue text-base md:text-lg leading-tight">Compare players!</p>
                  <p className="text-sm md:text-base leading-relaxed">
                    Compare multiple players to each other and see who's been better than who at what.
                  </p>
                </div>
              </div>

              <div className="flex flex-col text-gray-500 w-full flex-1 gap-4"> {/* increased gap here */}
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img src="/images/home/card3.png" alt="Player Kicking Ball" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-grow gap-1"> {/* reduced gap here */}
                  <p className="font-semibold text-premier-blue text-base md:text-lg leading-tight"> {/* added leading-tight just in case */}
                    Be surprised!
                  </p>
                  <p className="text-sm md:text-base leading-relaxed"> {/* added leading-relaxed for vibes */}
                    Find fun and surprising stats about the players you love! (or hate)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* League Table */}
        <div className="w-full px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <LeagueTable></LeagueTable>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full px-4 md:px-8 py-12 md:py-16">
          <div id="about" className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto text-premier-dark">
            <h2 className="text-3xl md:text-4xl font-bold">About Premier Metrics</h2>
            <p className="text-base">
              Premier Metrics is an in-depth Premier League statistics comparison
              website built by Pedro Boudoux, a Computer Science student at the
              University of Guelph.
            </p>
            <p className="text-base">
              Created as a fun side project to learn React and PostgreSQL, Premier
              Metrics is a full-featured web app that allows users to
              explore and compare player and team stats from the 2024/25 Premier
              League season. I wanted to create a fun, interactive and accessible
              way to look at and compare complex football statistics for fans like
              myself to use either that be for FPL, debates with friends, or for
              finding hidden gems in the league.
            </p>

            <h3 className="text-lg md:text-xl font-semibold border-t border-gray-300 pt-6">Data Sources & Disclaimer</h3>
            <p className="text-base">
              All statistical data, team logos, and player names are sourced from
              FBref and the official Premier League website. All rights to these
              materials belong to their respective owners. This project is
              strictly for educational and non-commercial use.
            </p>

            <h3 className="text-lg md:text-xl font-semibold border-t border-gray-300 pt-6">Technologies Used</h3>
            <ul className="text-base space-y-2 text-gray-500">
              <li className="flex items-start"><span className="mr-3">•</span>Frontend: React & Tailwind CSS</li>
              <li className="flex items-start"><span className="mr-3">•</span>Backend: Supabase (PostgreSQL) with Vercel Serverless Functions</li>
              <li className="flex items-start"><span className="mr-3">•</span>Scraping & Data Processing: Python & Pandas</li>
              <li className="flex items-start"><span className="mr-3">•</span>Data Visualization: Chart.js</li>
              <li className="flex items-start"><span className="mr-3">•</span>Deployment: Supabase & Vercel</li>
              <li className="flex items-start"><span className="mr-3">•</span>Other: Figma (for design mockups!) & Photoshop.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
