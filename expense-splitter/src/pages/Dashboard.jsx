import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [completedExpenses, setCompletedExpenses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        console.log("Fetching dashboard data...");

        const response = await axios.get("http://localhost:5067/api/dashboard/user-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data);

        setGroups(response.data.groups || []);
        setPendingPayments(response.data.pendingPayments || []);
        setCompletedExpenses(response.data.completedExpenses || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err.response?.data || err.message);
        setError("Failed to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, [token, navigate]);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Navigation Buttons */}
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={() => navigate("/groups")}>Manage Groups</button>
        <button className="btn btn-success" onClick={() => navigate("/expenses")}>Manage Expenses</button>
        <button className="btn btn-warning" onClick={() => navigate("/payments")}>Pending Payments</button>
      </div>

      {/* Groups Section */}
      <div className="card mb-3">
        <div className="card-header">Your Groups</div>
        <div className="card-body">
          {groups.length > 0 ? (
            <ul className="list-group">
              {groups.map((group) => (
                <li key={group.id} className="list-group-item">
                  <strong>{group.groupName}</strong>
                  <ul>
                    {group.members?.length > 0 ? (
                      group.members.map((member) => (
                        <li key={`${group.id}-${member.userId}`}>{member.fullName}</li> 
                      ))
                    ) : (
                      <li>No members found.</li>
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No groups found.</p>
          )}
        </div>
      </div>

      {/* Pending Payments Section */}
      <div className="card mb-3">
        <div className="card-header">Pending Payments</div>
        <div className="card-body">
          {pendingPayments.length > 0 ? (
            <ul className="list-group">
              {pendingPayments.map((payment) => (
                <li key={payment.expenseId} className="list-group-item">  {/* ✅ Unique Key */}
                  <strong>{payment.description}</strong> - ₹{payment.amount}
                  <br />
                  <small>Group: {payment.groupName}</small>
                  <br />
                  <small>Paid By: {payment.paidBy}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending payments.</p>
          )}
        </div>
      </div>

      {/* Completed Expenses Section */}
      <div className="card mb-3">
        <div className="card-header">Completed Expenses</div>
        <div className="card-body">
          {completedExpenses.length > 0 ? (
            <ul className="list-group">
              {completedExpenses.map((expense) => (
                <li key={expense.expenseId} className="list-group-item">  {/* ✅ Unique Key */}
                  <strong>{expense.description}</strong> - ₹{expense.amount}
                  <br />
                  <small>Group: {expense.groupName}</small>
                  <br />
                  <small>Paid By: {expense.paidBy}</small>
                  <br />
                  <small>Created On: {new Date(expense.createdAt).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No completed expenses.</p>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button className="btn btn-danger" onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
