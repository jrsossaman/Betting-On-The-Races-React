import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";
import createUser from "../api/create_user";
import getUser from "../api/get_user";

function SignUp() {
  const { setUser, setWallet, loginUser, registerUser } = useRaceBetting();
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

  // Phone validation regex for format (555) 555-5555
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone field - format as user types
    if (name === "phone") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "");
      
      // Format to (XXX) XXX-XXXX
      let formatted = "";
      if (digits.length > 0) {
        if (digits.length <= 3) {
          formatted = `(${digits}`;
        } else if (digits.length <= 6) {
          formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
          formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
      }
      
      setForm({
        ...form,
        [name]: formatted,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // LOGIN validation
      if (!form.username || !form.password) {
        setError("Username and password are required.");
        return;
      }
    } else {
      // SIGNUP validation - all fields required
      if (!form.name || !form.username || !form.password || !form.email || !form.phone) {
        setError("All fields are required.");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      // Validate phone format
      if (!phoneRegex.test(form.phone)) {
        setError("Please enter a valid phone number in the format (555) 555-5555.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        // LOGIN MODE - Use context loginUser function
        const result = loginUser(form.username, form.password);
        if (!result.success) {
          setError(result.message);
          return;
        }

        // Login successful
        setUser(result.user);
        setWallet(result.user.wallet || 1000);
        alert(`Welcome back, ${result.user.name}!`);
        setForm({ name: "", username: "", password: "", email: "", phone: "" });

      } else {
        // SIGNUP MODE - Use context registerUser function
        const newUser = {
          name: form.name,
          username: form.username,
          password: form.password,
          wallet: 1000, // initial balance
          email: form.email || "",
          phone: form.phone || "",
        };

        const registerResult = registerUser(newUser);
        if (!registerResult.success) {
          setError(registerResult.message);
          return;
        }

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
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="(555) 555-5555"
                maxLength="14"
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

