import { Machine, assign, spawn, send } from 'xstate'
import beersMachine from '../Beers/beersMachine'
import basketMachine from '../Basket/basketMachine'

const basketId = 'basket'
const beersId = 'beers'

const appMachine = Machine(
  {
    id: 'app',
    initial: 'initial',
    context: {
      beersRef: null,
      basketRef: null,
    },
    states: {
      initial: {
        entry: ['spawnBeers', 'spawnBasket']
      }
    },
    on: {
      ADD_TO_BASKET: {
        actions: ['addToBasket']
      }
    },
  },
  {
    actions: {
      addToBasket: (context, event) => context.basketRef.send({ ...event, type: 'ADD' }),
      spawnBeers: assign((context, event) => ({
        ...context,
        beersRef: context.beersRef || spawn(beersMachine, beersId)
      })),
      spawnBasket: assign((context, event) => ({
        ...context,
        basketRef: context.basketRef || spawn(basketMachine, basketId)
      }))
    }
  }
);


  export default appMachine
