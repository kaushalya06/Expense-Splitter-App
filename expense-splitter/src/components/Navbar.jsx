import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Expense Splitter</h1>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/payments">Payments</Link>
      </div>
    </nav>
  );
};

export default Navbar;
