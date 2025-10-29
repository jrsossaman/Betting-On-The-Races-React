import React, { useState } from "react";
debugger;
function SignUp() {
    debugger;
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
            wallet: wallet,
        };

        setForm()
    }
        // const response = await fetch('https://unit-4-project-app-24d5eea30b23.herokuapp.com/post/data',
        //     method = 'POST',
        //     headers = {
        //         'Content-Type': application/JSON
        //     },
        //     body = JSON.stringify(newUser),
        // )};

        // if (!response.ok) {
        //     throw new Error('Failed to create new user.')
        // }
        // const data = response.json();
        // console.log('Profile created.', data);
    // alert('Sign-up successful.')
    console.log("Sign up successful")
    debugger;
    // setForm({name: '', username: '', password: ''});
    // setWallet(0);

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

// export default SignUp;