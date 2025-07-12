import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Home} from "./pages/home"
import {Compare} from "./pages/compare"
import {Teams} from "./pages/teams"
import {Navbar} from "./components/navbar"
import {Footer} from "./components/footer"

function App() {
  return (
    <Router>
      <Navbar></Navbar>

      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/compare" element={<Compare/>} />
          <Route path="/teams" element={<Teams/>} />
        </Routes>
      </div>

      <Footer></Footer>
    </Router>
  );
}

export default App;
