import { useMachine } from '@xstate/react'
import beerMachine from './beerMachine'

const BeersList = ({ beers = [] }) => beers.map(({ name, description, id }) => <div key={id}>{name}</div>)

export default () => {
  const [current, send] = useMachine(beerMachine)

  const { beers, error, retries } = current.context

  console.log({ beers, error, current: current.value, retries })

  return (
    <div>
      <input onChange={e => send("SEARCH", { value: e.target.value } )} placeholder='Search beers' />
      {current.matches('loading') && <h2>Loading beers...</h2>}
      {current.matches('failed') && <h2>Loading beers failed, retired {retries} times</h2>}
      {current.matches('error') && <h2>Loading beers failed, retrying...</h2>}
      {current.matches('success') && <h2>Loading beers successful</h2>}
      {current.matches('success') && <BeersList beers={beers} />}
    </div>
  )
}
