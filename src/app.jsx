import React, { useEffect } from 'react';
import { RaceBettingProvider, useRaceBetting } from './context/race_betting_context';
import SignUp from './components/sign-up';
import RunRace from './components/run_race';
import driversData from './drivers.json';

function AppContent() {
    const { setDrivers } = useRaceBetting();

    useEffect(() => {
        // Load drivers from JSON file on component mount
        if (driversData && driversData.body) {
            setDrivers(driversData.body);
        }
    }, [setDrivers]);

    return (
        <div className='app container'>
            <h1>🏎️ Betting on the Races!</h1>
            <p>Create new profile or start racing</p>
            <SignUp />
            <RunRace />
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
