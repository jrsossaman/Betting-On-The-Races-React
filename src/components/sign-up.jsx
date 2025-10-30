import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";
import createUser from "../api/create_user";
import checkForDuplicates from "../api/check_for_duplicates";
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

  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      let formatted = "";
      if (digits.length <= 3) formatted = `(${digits}`;
      else if (digits.length <= 6) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      else formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      setForm({ ...form, [name]: formatted });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!form.username || !form.password) {
        setError("Username and password are required.");
        return;
      }
    } else {
      if (!form.name || !form.username || !form.password || !form.email || !form.phone) {
        setError("All fields are required.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!phoneRegex.test(form.phone)) {
        setError("Please enter a valid phone number in the format (555) 555-5555.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const user = await getUser(form.username, form.password);
        if (!user) {
          setError("Invalid username or password.");
          return;
        }
        setUser(user);
        setWallet(user.wallet);
        alert(`Welcome back, ${user.name}!`);
        setForm({ name: "", username: "", password: "", email: "", phone: "" });
      } else {
        // SIGNUP MODE
        const duplicate = await checkForDuplicates(form.username);
        if (duplicate) {
          setError("Username already exists. Please choose a different username.");
          return;
        }

        const newUser = {
          name: form.name,
          username: form.username,
          password: form.password,
          wallet: 1000,
          email: form.email,
          phone: form.phone,
        };

        try {
          await createUser(
            newUser.name,
            newUser.username,
            newUser.password,
            newUser.wallet,
            newUser.email,
            newUser.phone
          );

          // Fetch the created user from backend to get all fields (id, isAdmin, etc.)
          const createdUser = await getUser(newUser.username, newUser.password);
          if (createdUser) {
            setUser(createdUser);
            setWallet(createdUser.wallet);
          }
          
          alert(`Welcome ${newUser.name}! You've been given $1000 to start betting!`);
          setForm({ name: "", username: "", password: "", email: "", phone: "" });
        } catch (signupError) {
          setError("An error occurred while creating your account. Please try again.");
          console.error(signupError);
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
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
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
            </div>
            <div>
              <label>Phone:</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(555) 555-5555" maxLength="14" />
            </div>
          </>
        )}

        <div>
          <label>Username:</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Enter username" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
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

