import logo from './15gLogo.png';
import './App.css';
import Beers from './Beers/Beers'

const App = () =>{
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React and Xstate</h1>
        <Beers />
      </header>
    </div>
  );
}

export default App;
