import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";
import createUser from "../api/create_user";
import getUser from "../api/get_user";

function SignUp() {
  const { setUser, setWallet } = useRaceBetting();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password || (!isLogin && !form.name)) {
      setError(isLogin ? "Username and password are required." : "All fields are required.");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        // LOGIN MODE
        const user = await getUser(form.username, form.password);
        if (!user) {
          setError("Invalid username or password.");
          return;
        }

        // Login successful
        setUser(user);
        setWallet(user.wallet);
        alert(`Welcome back, ${user.name}!`);
        setForm({ name: "", username: "", password: "", email: "", phone: "" });

      } else {
        // SIGNUP MODE
        const newUser = {
          name: form.name,
          username: form.username,
          password: form.password,
          wallet: 1000, // initial balance
          email: form.email || "",
          phone: form.phone || "",
        };

        // Call API to create user
        await createUser(
          newUser.name,
          newUser.username,
          newUser.password,
          newUser.wallet,
          newUser.email,
          newUser.phone
        );

        // Signup successful - log them in
        setUser(newUser);
        setWallet(newUser.wallet);
        alert(`Welcome ${newUser.name}! You've been given $1000 to start betting!`);
        setForm({ name: "", username: "", password: "", email: "", phone: "" });
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForm({ name: "", username: "", password: "", email: "", phone: "" });
    setError("");
  };

  return (
    <div className="signup-container">
      <h2>{isLogin ? "Login to Your Account" : "Create Your Profile"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label>Email (optional):</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>
            <div>
              <label>Phone (optional):</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </>
        )}

        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
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
            placeholder="Enter password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (isLogin ? "Logging in..." : "Creating...") : isLogin ? "Login" : "Create Profile"}
        </button>
      </form>

      <div className="auth-toggle">
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={toggleMode} className="toggle-button">
            {isLogin ? "Create Profile" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

