import { useMachine } from '@xstate/react'

import logo from '../15gLogo.png';
import './App.css';

import Beers from '../Beers/Beers'
import appMachine from './appMachine'

const App = () => {
  const [current, send] = useMachine(appMachine)

  const { beersRef } = current.context

  console.log({ c: current.context })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React and Xstate</h1>
        <div className="App-split">
          { beersRef && <Beers actor={beersRef} />}
        </div>
      </header>
    </div>
  );
}

export default App
