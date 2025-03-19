import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Expenses = () => {
  const { token } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchGroups = async () => {
      try {
        console.log("Fetching groups...");
        const response = await axios.get("http://localhost:5067/api/dashboard/user-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Groups API Response:", response.data.groups);
        setGroups(response.data.groups || []);

        if (response.data.groups.length > 0) {
          setSelectedGroup(response.data.groups[0].groupName);
          fetchExpenses(response.data.groups[0].groupName);
        }
      } catch (err) {
        setError("Failed to load groups.");
      }
    };

    fetchGroups();
  }, [token, navigate]);

  const fetchExpenses = async (groupName) => {
    if (!groupName) return;

    try {
      console.log(`Fetching expenses for group ${groupName}...`);
      const response = await axios.get(`http://localhost:5067/api/expenses/group/${groupName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Expenses API Response:", response.data);
      setExpenses(response.data || []);

      // ✅ Filter out pending expenses
      const pending = response.data.filter(expense => !expense.isSettled);
      setPendingExpenses(pending);

    } catch (err) {
      console.error("Error fetching expenses:", err.response?.data || err.message);
      setError("Failed to load expenses.");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedGroup) {
      setError("Please select a valid group.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5067/api/expenses/add",
        {
          description,
          amount: parseFloat(amount),
          groupName: selectedGroup,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Expense added successfully!");
      setDescription("");
      setAmount("");
      fetchExpenses(selectedGroup);
    } catch (err) {
      console.error("Error adding expense:", err.response?.data || err.message);
      setError("Error adding expense.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Expenses</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Navigation Buttons */}
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button className="btn btn-success" onClick={() => navigate("/payments")}>Pending Payments</button>
        <button className="btn btn-warning" onClick={() => navigate("/groups")}>Manage Groups</button>
      </div>

      {/* Add Expense Form */}
      <div className="card mb-3">
        <div className="card-header">Add New Expense</div>
        <div className="card-body">
          <form onSubmit={handleAddExpense}>
            <div className="mb-3">
              <label>Group:</label>
              <select
                className="form-control"
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  fetchExpenses(e.target.value);
                }}
                required
              >
                <option value="" disabled>Select a group</option>
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <option key={group.groupName} value={group.groupName}>
                      {group.groupName}
                    </option>
                  ))
                ) : (
                  <option disabled>No groups available</option>
                )}
              </select>
            </div>
            <div className="mb-3">
              <label>Description:</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Amount:</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </form>
        </div>
      </div>

      {/* List Expenses */}
      <div className="card mb-3">
        <div className="card-header">Group Expenses</div>
        <div className="card-body">
          {Array.isArray(expenses) && expenses.length > 0 ? (
            <ul className="list-group">
              {expenses.map((expense) => (
                <li key={expense.id} className="list-group-item">
                  {expense.description} - ₹{expense.amount} (Paid by: {expense.PaidByName})
                </li>
              ))}
            </ul>
          ) : (
            <p>No expenses found.</p>
          )}
        </div>
      </div>

      {/* Pending Expenses */}
      <div className="card mb-3">
        <div className="card-header">Pending Expenses</div>
        <div className="card-body">
          {pendingExpenses.length > 0 ? (
            <ul className="list-group">
              {pendingExpenses.map((expense) => (
                <li key={expense.id} className="list-group-item">
                  {expense.description} - ₹{expense.amount} (Paid by: {expense.PaidByName})
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending expenses.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Expenses;
