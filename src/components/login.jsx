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

function Login() {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, password } = form;

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const user = users.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {
            alert(`Welcome back, ${user.name}!`);
            
        } else {
            alert("Invalid username or password.");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
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
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
