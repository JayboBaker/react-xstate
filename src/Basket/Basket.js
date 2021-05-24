import { useActor } from '@xstate/react'

const Messaging = ({ state, items }) => {
  switch (state) {
    case 'notEmpty': {
      return Object.values(items).map(({ amount, name, id }) => <p key={id}>{amount} x {name}</p>)
    }
    default : {
      return <p>Basket is empty</p>
    }
  }
}
const Basket = ({ actor }) => {
  const [current, send] = useActor(actor)
  const { items } = current.context

  return (
    <div>
      <h2>Basket</h2>
      <Messaging {...{ items, state: current.value }}/>
    </div>
  )
}

export default Basket
