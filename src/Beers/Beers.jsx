import { useActor } from '@xstate/react'

const BeersList = ({ beers = [] }) => beers.map(({ name, description, id }) => <div key={id}>{name}</div>)

export default ({ actor }) => {
  const [current, send] = useActor(actor)

  const { beers, error, retries } = current.context
  console.log('Beers context: ', current.context)

  return (
    <div>
      <h2>Beers</h2>
      <input onChange={e => send({ type: "SEARCH", searchTerm: e.target.value })} placeholder='Search beers' />
      {current.matches('loading') && <p>Loading beers...</p>}
      {current.matches('failed') && <p>Loading beers failed, retired {retries} times</p>}
      {current.matches('error') && <p>Loading beers failed, retrying...</p>}
      {current.matches('success') && <p>Loading beers successful</p>}
      {current.matches('success') && <p>Loading beers successful</p>}
      {current.matches('success') && <BeersList beers={beers} />}
    </div>
  )
}
