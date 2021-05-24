import { useMachine } from '@xstate/react'

import logo from '../15gLogo.png';
import './App.css';

import Beers from '../Beers/Beers'
import Basket from '../Basket/Basket'
import appMachine from './appMachine'

const App = () => {
  const [current, send] = useMachine(appMachine)

  const { beersRef, basketRef } = current.context

  const handleItemClick = (payload) => () => send({ type: 'ADD_TO_BASKET', payload })

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <h1>React and Xstate</h1>
        <div className='App-split'>
          { beersRef && <Beers actor={beersRef} handleItemClick={handleItemClick} />}
          { basketRef && <Basket actor={basketRef} />}
        </div>
      </header>
    </div>
  );
}

export default App
