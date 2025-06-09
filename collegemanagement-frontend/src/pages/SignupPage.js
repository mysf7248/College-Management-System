import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { signup as apiSignup } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

const Signup = () => {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [error, setError] = useState("");

  if (auth.token) return <Navigate to="/" />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiSignup(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError("Signup failed. Email may already be in use.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: "2rem" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
        {error && <div className="form-error">{error}</div>}
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
};

export default Signup;