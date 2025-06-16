import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/navbar/navbar.jsx'
import { LeagueTable } from './components/navbar/league_table.jsx';

function App() {
  return (
    <>
      <Navbar></Navbar>

      <div>
        <h1>Welcome to Premier Metrics!</h1>
        <p>Unlock deep insights into every Premier League match, team, and player. From expected goals to pressing stats, Premier Metrics delivers cutting-edge analytics and visualizations to help fans, analysts, and fantasy managers make smarter decisions.</p>
        <a className='emph-button'>About</a>

        <img src=""></img>

      </div>

      <div>
        <h2>In depth statistics, made easy</h2>
        <div>
          <div className='card1'>
            <img src=''></img> {/* Generic Image for the Card */}
            <p>Take a closer look at players!</p>
            <p>Easily see which players are performing/underperforming and in what areas. </p>
          </div>

          <div className='card1'>
            <img src=''></img> {/* Generic Image for the Card */}
            <p>Compare players!</p>
            <p>Compare multiple players to each other and see who’s been better than who at what.</p>
          </div>

          <div className='card1'>
            <img src=''></img> {/* Generic Image for the Card */}
            <p>Be surprised!</p>
            <p>Discover interesting unexpected stats about your favourite players!</p>
          </div>
        </div>
      </div>

      <LeagueTable></LeagueTable>



    </>
  );
}

export default App;
