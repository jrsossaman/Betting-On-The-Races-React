import React, { useEffect } from 'react';
import { RaceBettingProvider, useRaceBetting } from './context/race_betting_context';
import SignUp from './components/sign-up';
import RunRace from './components/run_race';
import driversData from './drivers.json';
import './App.css';



function AppContent() {
    const { setDrivers, user, setUser, setWallet } = useRaceBetting();

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
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </div>
                ) : (
                    <p className='Create_new'>Create new profile to get started</p>
                )}
                <div className='Sign-up'>
                    {!user ? (
                        <SignUp />
                    ) : (
                        <RunRace />
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
