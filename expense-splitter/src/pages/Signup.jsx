import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log("Signing up with:", fullName, email);

      await axios.post("http://localhost:5067/api/auth/signup", {
        fullName,
        email,
        password,
      });

      setSuccess("🎉 Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setError(err.response?.data || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label>Full Name:</label>
          <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary me-2">Sign Up</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/login")}>Login</button>
      </form>
    </div>
  );
};

export default Signup;
