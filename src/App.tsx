
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error";

function App() {
    return (
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/error" element={<Error/>}/>
            </Routes>
          </div>
        </Router>
    );
}

export default App;
