import React, { useState } from "react";

function signUp() {
    const [form, setForm] = useState({
        name: '',
        username: '',
        password: '',
    });

    const [wallet, setWallet] = useState(0);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!form.name || !form.username || !form.password) {
            alert('All fields are required.');
            return;
        }

        const newUser = {
            ...form,
            wallet,
        };

        console.log('Profile created successfully.')

        setForm({name: '', username: '', password: ''});
        setWallet(0);
    };

    return (
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
                username="username"
                value={form.username}
                onChange={handleChange}
                required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                type="text"
                password="password"
                value={form.password}
                onChange={handleChange}
                required
                />
            </div>
            <button type="submit">Create Profile</button>
        </form>
    );
}

export default signUp;