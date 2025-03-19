import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Expenses from "./pages/Expenses";
import Payments from "./pages/Payments";

const App = () => {
  const { token } = useContext(AuthContext); // Get token from context

  return (
    <Router>
      <Routes>
        {/* 🚀 If token exists, go to Dashboard, else go to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/groups" element={token ? <Groups /> : <Navigate to="/login" />} />
        <Route path="/expenses" element={token ? <Expenses /> : <Navigate to="/login" />} />
        <Route path="/payments" element={token ? <Payments /> : <Navigate to="/login" />} />

        {/* 🚀 Handle unknown routes (404) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
