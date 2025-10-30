// import React from "react";
// import { signUp } from './sign-up';


// function login() {
    
//     if (form.name || form.username || form.password == value) {
//         // handle when name is truthy
//     }
//     return null;
// }
// export default login
import React, { useState } from "react";
import getUser from "../api/get_user";
import { useRaceBetting } from "../context/race_betting_context";

function Login() {
  const { setUser } = useRaceBetting();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { username, password } = form;

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      setLoading(true);
      const user = await getUser(username, password);

      if (user) {
        // Set user in context to log them in
        setUser(user);
        alert(`Welcome back, ${user.name}!`);
        setForm({ username: "", password: "" });
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An error occurred while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default Login;
