import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";


function SignUp() {
    const { setUser, setWallet, registerUser, loginUser } = useRaceBetting();
    const [isLogin, setIsLogin] = useState(false);
    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            // LOGIN MODE
            if (!form.username || !form.password) {
                setError('Username and password are required.');
                return;
            }

            const result = loginUser(form.username, form.password);
            if (!result.success) {
                setError(result.message);
                return;
            }

            // Login successful
            const userData = result.user;
            setUser(userData);
            setWallet(userData.wallet);
            alert(`Welcome back, ${userData.name}!`);
            setForm({ name: '', username: '', password: '' });
        } else {
            // SIGNUP MODE
            if (!form.name || !form.username || !form.password) {
                setError('All fields are required.');
                return;
            }

            const newUser = {
                name: form.name,
                username: form.username,
                password: form.password,
                wallet: 1000,
                races: 0,
                totalWinnings: 0,
            };

            const result = registerUser(newUser);
            if (!result.success) {
                setError(result.message);
                return;
            }

            // Signup successful - log them in
            setUser(newUser);
            setWallet(1000);
            alert(`Welcome ${form.name}! You've been given $1000 to start betting!`);
            setForm({ name: '', username: '', password: '' });
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setForm({ name: '', username: '', password: '' });
        setError('');
    };

    return (
        <div className="signup-container">
            <h2>{isLogin ? 'Login to Your Account' : 'Create Your Profile'}</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                {!isLogin && (
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
                        onClick={toggleMode}
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