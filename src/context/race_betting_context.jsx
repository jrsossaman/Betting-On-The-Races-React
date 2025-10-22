import React, {createContext, useContext, useState} from "react";

export const raceBettingContext = createContext();

export function RaceBettingProvider({ children }) {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(0);
    const [drivers, setDrivers] = useState([]);
    const [raceHistory, setRaceHistory] = useState([]);

    const updateWallet = (amount) => {
        setWallet(prev => prev + amount);
    };

    const updateUserData = (userData) => {
        setUser(userData);
    };

    const addRaceResult = (result) => {
        setRaceHistory(prev => [...prev, result]);
    };

    const value = {
        user,
        setUser: updateUserData,
        wallet,
        updateWallet,
        drivers,
        setDrivers,
        raceHistory,
        addRaceResult,
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

