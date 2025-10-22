import React from 'react';
import { raceBettingContext } from './context/race_betting_context';
import SignUp from './components/sign-up';
// import from left

function App() {
    return(
        <raceBettingContext>
            <div className='app container'>
                <h1>Betting on the Races!</h1>
                <p>Create new profile</p>
                <SignUp />
            </div>
        </raceBettingContext>
        // main code goes here.
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
