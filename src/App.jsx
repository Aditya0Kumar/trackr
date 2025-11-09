import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddReport from "./pages/AddReport.jsx";
import Reports from "./pages/Reports.jsx";
import Navbar from "./components/navbar.jsx";
import PrivateRoute from "./components/PrivateRoutes.jsx";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            <Route path="/add-report" element={<PrivateRoute><AddReport /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;