import React, { useEffect, useState } from 'react';
import { RaceBettingProvider, useRaceBetting } from './context/race_betting_context';
import SignUp from './components/sign-up';
import RunRace from './components/run_race';
import DriverStats from './components/driver_stats';
import AccountManagement from './components/account_management';
import driversData from './drivers.json';
import './App.css';



function AppContent() {
    const { setDrivers, user, setUser } = useRaceBetting();
    const [activeView, setActiveView] = useState("racing");

    useEffect(() => {
        // Load drivers from JSON file on component mount
        if (driversData && driversData.body) {
            setDrivers(driversData.body);
        }
    }, [setDrivers]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            setUser(null);
            // Don't reset wallet here - it will be restored on next login
        }
    };

    return (
        <div className='app_container'>
            <div className="header">
                <h1 className="title">🏎️ Betting on the Races!</h1>
                {user ? (
                    <div className="user-info">
                        <span>Welcome, <strong>{user.name}</strong>!</span>
                        <div className="user-actions">
                            <button
                                onClick={() => setActiveView("account")}
                                className={`btn-nav ${activeView === "account" ? "active" : ""}`}
                            >
                                👤 Account
                            </button>
                            <button
                                onClick={() => setActiveView("racing")}
                                className={`btn-nav ${activeView === "racing" ? "active" : ""}`}
                            >
                                🏎️ Racing
                            </button>
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </div>
                    </div>
                ) : (
                    <p className='Create_new'>Create new profile to get started</p>
                )}
                <div className='Sign-up'>
                    {!user ? (
                        <SignUp />
                    ) : activeView === "account" ? (
                        <AccountManagement />
                    ) : (
                        <>
                            <RunRace />
                            <DriverStats />
                        </>
                    )}
                </div>
            </div>
        
        </div>
    );
}

function App() {
    return(
        
        <RaceBettingProvider>
            <AppContent />
        </RaceBettingProvider>
    );
}

export default App;



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
