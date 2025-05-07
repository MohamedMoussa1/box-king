import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import BoxDetail from "./pages/BoxDetail/BoxDetail";
import CreateBox from "./pages/CreateBox/CreateBox";
import Landing from "./pages/Landing/Landing";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/box/:box_id" element={<BoxDetail />} />
            <Route path="/box/create-box" element={<CreateBox />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
