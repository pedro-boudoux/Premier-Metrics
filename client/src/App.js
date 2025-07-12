import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Home} from "./pages/home"
import {Navbar} from "./components/navbar"
import {Footer} from "./components/footer"

function App() {
  return (
    <>
      <Navbar></Navbar>

      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />

        </Routes>
      </Router>

      <Footer></Footer>

    </>
  );
}

export default App;
