import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";

function SignUp() {
    const { setUser, setWallet } = useRaceBetting();
    const [isLogin, setIsLogin] = useState(false);
    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]); // Store registered users

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.name || !form.username || !form.password) {
            setError('All fields are required.');
            return;
        }

        if (isLogin) {
            // Login: Check if user exists
            const existingUser = users.find(u => u.username === form.username);
            if (!existingUser) {
                setError('User not found. Please create a new profile.');
                return;
            }
            if (existingUser.password !== form.password) {
                setError('Incorrect password.');
                return;
            }

            // Login successful - restore user data
            setUser(existingUser);
            setWallet(existingUser.wallet);
            alert(`Welcome back, ${existingUser.name}!`);
        } else {
            // Sign up: Check if user already exists
            if (users.some(u => u.username === form.username)) {
                setError('Username already taken. Please login or choose a different username.');
                return;
            }

            const newUser = {
                name: form.name,
                username: form.username,
                password: form.password,
                wallet: 1000, // Starting balance for new users
            };

            // Save user to list
            setUsers([...users, newUser]);

            // Log in immediately
            setUser(newUser);
            setWallet(1000);
            alert(`Welcome ${form.name}! You've been given $1000 to start betting!`);
        }

        setForm({ name: '', username: '', password: '' });
    };

    return (
        <div className="signup-container">
            <h2>{isLogin ? 'Login to Your Account' : 'Create Your Profile'}</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSignUp}>
                {!isLogin && (
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required={!isLogin}
                            disabled={isLogin}
                            placeholder="Enter your name"
                        />
                    </div>
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
                <button type="submit">
                    {isLogin ? 'Login' : 'Create Profile'}
                </button>
            </form>

            <div className="auth-toggle">
                <p>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        type="button" 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setForm({ name: '', username: '', password: '' });
                            setError('');
                        }}
                        className="toggle-button"
                    >
                        {isLogin ? 'Create Profile' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default SignUp;