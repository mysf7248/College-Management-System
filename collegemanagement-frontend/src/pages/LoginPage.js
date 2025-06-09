import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = () => {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (auth.token) return <Navigate to="/" />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiLogin(form.email, form.password);
      login(data);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <div className="form-error">{error}</div>}
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;