import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const { token } = useContext(AuthContext);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPendingPayments = async () => {
      try {
        console.log("Fetching pending payments...");

        const response = await axios.get("http://localhost:5067/api/dashboard/user-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Pending Payments API Response:", response.data.pendingPayments);

        setPendingPayments(response.data.pendingPayments || []);
      } catch (err) {
        console.error("Error fetching payments:", err.response ? err.response.data : err.message);
        setError("Failed to load pending payments.");
      }
    };

    fetchPendingPayments();
  }, [token, navigate]);

  const handlePay = async (expenseId) => {
    try {
      await axios.post(
        "http://localhost:5067/api/payment/pay",
        { expenseId }, // ✅ Removed userId, backend extracts it from token
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Payment marked as paid!");

      // ✅ Remove paid expense from state correctly
      setPendingPayments((prev) => prev.filter((payment) => payment.expenseId !== expenseId));
    } catch (err) {
      setError(err.response?.data || "Error processing payment.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Pending Payments</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <button className="btn btn-success" onClick={() => navigate("/expenses")}>
          Expenses
        </button>
        <button className="btn btn-warning" onClick={() => navigate("/groups")}>
          Groups
        </button>
      </div>

      <div className="card">
        <div className="card-header">Your Pending Payments</div>
        <div className="card-body">
          {Array.isArray(pendingPayments) && pendingPayments.length > 0 ? (
            <ul className="list-group">
              {pendingPayments.map((payment, index) => (
                <li key={payment.expenseId || index} className="list-group-item">
                  {payment.description} - ₹{payment.amount} ({payment.groupName})
                  <button className="btn btn-success btn-sm float-end" onClick={() => handlePay(payment.expenseId)}>
                    Pay
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending payments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
