import React, {createContext, useContext, useState} from "react";

export const raceBettingContext = createContext();

export function RaceBettingProvider({ children }) {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(0);
    const [drivers, setDrivers] = useState([]);
    const [raceHistory, setRaceHistory] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]); // Store all registered users

    const updateWallet = (amount) => {
        setWallet(prev => {
            const newWallet = prev + amount;
            // Update the logged-in user's wallet in registeredUsers
            if (user) {
                setRegisteredUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.username === user.username
                            ? { ...u, wallet: newWallet }
                            : u
                    )
                );
            }
            return newWallet;
        });
    };

    const setWalletDirect = (amount) => {
        setWallet(amount);
        // Update the logged-in user's wallet in registeredUsers
        if (user) {
            setRegisteredUsers(prevUsers =>
                prevUsers.map(u =>
                    u.username === user.username
                        ? { ...u, wallet: amount }
                        : u
                )
            );
        }
    };

    const updateUserData = (userData) => {
        setUser(userData);
    };

    const addRaceResult = (result) => {
        setRaceHistory(prev => [...prev, result]);
    };

    const registerUser = (userCredentials) => {
        // Check if username already exists
        if (registeredUsers.some(u => u.username === userCredentials.username)) {
            return { success: false, message: 'Username already taken.' };
        }
        // Add new user
        setRegisteredUsers([...registeredUsers, userCredentials]);
        return { success: true, message: 'User registered successfully.' };
    };

    const loginUser = (username, password) => {
        const foundUser = registeredUsers.find(u => u.username === username);
        if (!foundUser) {
            return { success: false, message: 'User not found.' };
        }
        if (foundUser.password !== password) {
            return { success: false, message: 'Incorrect password.' };
        }
        return { success: true, user: foundUser };
    };

    const value = {
        user,
        setUser: updateUserData,
        wallet,
        setWallet: setWalletDirect,
        updateWallet,
        drivers,
        setDrivers,
        raceHistory,
        addRaceResult,
        registeredUsers,
        registerUser,
        loginUser,
    };

    return (
        <raceBettingContext.Provider value={value}>
            {children}
        </raceBettingContext.Provider>
    );
}

export function useRaceBetting() {
    const context = useContext(raceBettingContext);
    if (!context) {
        throw new Error('useRaceBetting must be used within RaceBettingProvider');
    }
    return context;
}

