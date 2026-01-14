import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Home} from "./pages/home"
import {Compare} from "./pages/compare"
import {Player} from "./pages/player"
import {Navbar} from "./components/navbar"
import {Footer} from "./components/footer"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar></Navbar>

        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/compare" element={<Compare/>} />
            <Route path="/player/:id" element={<Player/>} />
          </Routes>
        </main>

        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
