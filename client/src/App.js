import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Home} from "./pages/home"
import {Compare} from "./pages/compare"
import {Player} from "./pages/player"
import {Navbar} from "./components/navbar"
import {Footer} from "./components/footer"

function App() {
  return (
    <Router>
      <Navbar></Navbar>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/compare" element={<Compare/>} />
          <Route path="/player/:id" element={<Player/>} />
        </Routes>
      </div>

      <Footer></Footer>
    </Router>
  );
}

export default App;
