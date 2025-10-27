import React, {createContext, useContext, useState, useEffect} from "react";

export const raceBettingContext = createContext();

export function RaceBettingProvider({ children }) {
    const [user, setUser] = useState(null);
    const [wallet, setWallet] = useState(0);
    const [drivers, setDrivers] = useState([]);
    const [driverStats, setDriverStats] = useState({}); // Track wins, races, points for each driver
    const [raceHistory, setRaceHistory] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]); // Store all registered users

    // Initialize driver stats when drivers are loaded
    useEffect(() => {
        if (drivers.length > 0) {
            setDriverStats(prevStats => {
                const newStats = { ...prevStats };
                drivers.forEach(driver => {
                    if (!newStats[driver.number]) {
                        newStats[driver.number] = {
                            racesCompleted: 0,
                            wins: 0,
                            totalPoints: 0,
                        };
                    }
                });
                return newStats;
            });
        }
    }, [drivers]);

    // Recalculate driver stats whenever race history changes
    useEffect(() => {
        if (raceHistory.length > 0) {
            // Recalculate all stats from race history
            const newStats = {};
            
            // Initialize stats for all drivers
            drivers.forEach(driver => {
                newStats[driver.number] = {
                    racesCompleted: 0,
                    wins: 0,
                    totalPoints: 0,
                };
            });
            
            // Calculate stats from all races in history
            raceHistory.forEach(race => {
                if (race.winner && race.loser) {
                    const winnerNum = race.winner.number;
                    const loserNum = race.loser.number;
                    
                    // Ensure drivers exist
                    if (!newStats[winnerNum]) {
                        newStats[winnerNum] = { racesCompleted: 0, wins: 0, totalPoints: 0 };
                    }
                    if (!newStats[loserNum]) {
                        newStats[loserNum] = { racesCompleted: 0, wins: 0, totalPoints: 0 };
                    }
                    
                    // Update winner stats
                    newStats[winnerNum].racesCompleted += 1;
                    newStats[winnerNum].wins += 1;
                    newStats[winnerNum].totalPoints += 25;
                    
                    // Update loser stats
                    newStats[loserNum].racesCompleted += 1;
                    newStats[loserNum].totalPoints += 10;
                }
            });
            
            setDriverStats(newStats);
        }
    }, [raceHistory, drivers]);

    const updateWallet = (amount) => {
        setWallet(prev => prev + amount);
    };

    const setWalletDirect = (amount) => {
        setWallet(amount);
    };

    const updateUserData = (userData) => {
        setUser(userData);
    };

    const addRaceResult = (result) => {
        setRaceHistory(prev => {
            // Check if this race already exists to prevent duplicates
            const isDuplicate = prev.some(r => 
                r.timestamp === result.timestamp &&
                r.winner?.number === result.winner?.number &&
                r.loser?.number === result.loser?.number
            );
            
            if (isDuplicate) {
                return prev; // Don't add duplicate
            }
            
            return [...prev, result];
        });
    };

    // Sync wallet changes to registered users
    useEffect(() => {
        if (user) {
            setRegisteredUsers(prevUsers =>
                prevUsers.map(u =>
                    u.username === user.username
                        ? { ...u, wallet: wallet }
                        : u
                )
            );
        }
    }, [wallet, user]);

    // Update user stats when race history changes
    useEffect(() => {
        if (user && raceHistory.length > 0) {
            // Calculate races played, races won, and total winnings from race history
            let racesPlayed = 0;
            let racesWon = 0;
            let totalWinnings = 0;

            raceHistory.forEach(race => {
                if (race.userWon !== undefined) {
                    racesPlayed += 1;
                    if (race.userWon) {
                        racesWon += 1;
                        totalWinnings += race.betAmount; // Add winnings (not including bet return)
                    }
                }
            });

            setRegisteredUsers(prevUsers =>
                prevUsers.map(u =>
                    u.username === user.username
                        ? { ...u, races: racesPlayed, racesWon: racesWon, totalWinnings: totalWinnings }
                        : u
                )
            );
        }
    }, [raceHistory, user]);

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
            return { success: false, message: 'User not found.'};
        }
        if (foundUser.password !== password) {
            return { success: false, message: 'Incorrect password.' };
        }
        return { success: true, user: foundUser };
    };

    const deleteUser = (username) => {
        setRegisteredUsers(prevUsers =>
            prevUsers.filter(u => u.username !== username)
        );
        // If the deleted user is the current user, log them out
        if (user?.username === username) {
            setUser(null);
            setWallet(0);
        }
    };

    const value = {
        user,
        setUser: updateUserData,
        wallet,
        setWallet: setWalletDirect,
        updateWallet,
        drivers,
        setDrivers,
        driverStats,
        setDriverStats,
        raceHistory,
        addRaceResult,
        registeredUsers,
        registerUser,
        loginUser,
        deleteUser,
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

