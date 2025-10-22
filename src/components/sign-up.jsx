import React, { useState } from "react";
import { useRaceBetting } from "../context/race_betting_context";

function SignUp() {
    const { setUser, updateWallet } = useRaceBetting();
    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
    });
    const [signUpComplete, setSignUpComplete] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!form.name || !form.username || !form.password) {
            alert('All fields are required.');
            return;
        }

        const newUser = {
            name: form.name,
            username: form.username,
            password: form.password,
            wallet: 1000, // Starting balance
        };

        // Update context with user data
        setUser(newUser);
        updateWallet(1000); // Initialize wallet with $1000

        alert(`Welcome ${form.name}! You've been given $1000 to start betting!`);
        
        setForm({ name: '', username: '', password: '' });
        setSignUpComplete(true);

        // Reset message after 3 seconds
        setTimeout(() => setSignUpComplete(false), 3000);
    };

    return (
        <div className="signup-container">
            <h2>Create Your Profile</h2>
            {signUpComplete && <div className="success-message">✅ Profile created successfully!</div>}
            <form onSubmit={handleSignUp}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <button type="submit">Create Profile</button>
            </form>
        </div>
    );
}

export default SignUp;