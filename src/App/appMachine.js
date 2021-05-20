import { Machine, assign, spawn } from 'xstate'
import beersMachine from '../Beers/beersMachine'

const appMachine = Machine(
  {
    id: 'app',
    initial: 'idle',
    context: {
      beersList: [],
      beersRef: null,
      searchTerm: '',
    },
    states: {
      idle: {
        entry: ['spawnBeers']
      }
    },
  },
  {
    actions: {
      spawnBeers: assign((context, event) => {
        return {
          ...context,
          beersRef: context.beersRef || spawn(beersMachine)
        }
      })
    }
  }
);


  export default appMachine
