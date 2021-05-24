import { useActor } from '@xstate/react'

const BeersList = ({ beers = [], handleItemClick }) => beers.map(({ name, id }) => <div onClick={handleItemClick({ name, id })} key={id}>{name}</div>)

const Messaging = ({ beers, retries, state, handleItemClick }) => {
  switch (state) {
    case 'loading': {
      return <p>Loading beers...</p>
    }
    case 'failed': {
      return <p>Loading beers failed, retried {retries} times</p>
    }
    case 'error': {
      return <p>Loading beers failed, retrying...</p>
    }
    case 'noResults': {
      return <p>No beers match that search term</p>
    }
    case 'success': {
      return <BeersList {... {beers, handleItemClick }} />
    }
    default: {
      return <p>Please enter a search term</p>
    }
  }
}


export default ({ actor, handleItemClick }) => {
  const [current, send] = useActor(actor)
  if (!current) return null
  const { context } = current
  const { beers, retries } = context

  return (
    <div>
      <h2>Beers</h2>
      <input onChange={e => send({ type: 'SEARCH', searchTerm: e.target.value })} placeholder='Search beers' />
      <Messaging {...{ beers, retries, state: current.value, handleItemClick }} />
    </div>
  )

}
