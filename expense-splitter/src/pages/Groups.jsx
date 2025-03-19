import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const { token } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [memberEmails, setMemberEmails] = useState("");
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
        const response = await axios.get("http://localhost:5067/api/groups/user-groups", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Groups API Response:", response.data);
        setGroups(response.data || []);
      } catch (err) {
        console.error("Error fetching groups:", err.response?.data || err.message);
        setError("Failed to load groups.");
      }
    };

    fetchGroups();
  }, [token, navigate]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailsArray = memberEmails.split(",").map(email => email.trim());

    try {
      await axios.post(
        "http://localhost:5067/api/groups/create",  // ✅ Fixed API route
        { groupName, memberEmails: emailsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Group created successfully!");
      setGroupName("");
      setMemberEmails("");

      // Refresh groups after creating a new one
      const updatedGroups = await axios.get("http://localhost:5067/api/groups/user-groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(updatedGroups.data || []);
    } catch (err) {
      console.error("Error creating group:", err.response?.data || err.message);
      setError(err.response?.data || "Error creating group.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Groups</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Navigation Buttons */}
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        <button className="btn btn-success" onClick={() => navigate("/expenses")}>Manage Expenses</button>
        <button className="btn btn-warning" onClick={() => navigate("/payments")}>Pending Payments</button>
      </div>

      {/* Create Group Form */}
      <div className="card mb-3">
        <div className="card-header">Create New Group</div>
        <div className="card-body">
          <form onSubmit={handleCreateGroup}>
            <div className="mb-3">
              <label>Group Name:</label>
              <input
                type="text"
                className="form-control"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Member Emails (comma-separated):</label>
              <input
                type="text"
                className="form-control"
                value={memberEmails}
                onChange={(e) => setMemberEmails(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Group</button>
          </form>
        </div>
      </div>

      {/* List Groups */}
      <div className="card">
        <div className="card-header">Your Groups</div>
        <div className="card-body">
          {groups.length > 0 ? (
            <ul className="list-group">
              {groups.map((group) => (
                <li key={group.groupId} className="list-group-item">
                  <strong>{group.groupName}</strong>
                  <br />
                  <small>Members:</small>
                  <ul>
                    {group.members?.length > 0 ? (
                      group.members.map((member) => (
                        <li key={`${group.groupId}-${member.userId}`}>{member.fullName}</li>  // ✅ Unique key fix
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
    </div>
  );
};

export default Groups;
