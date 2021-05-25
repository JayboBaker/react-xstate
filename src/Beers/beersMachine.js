import { Machine, assign } from 'xstate'

// The state machine is serializable
const stateMachine = {
  id: 'beer',
  initial: 'idle',
  context: {
    retries: 0,
  },
  states: {
    idle: {
      always: 'loading'
    },
    success: {},
    noResults: {},
    failed: {},
    loading: {
      invoke: {
        id: 'fetch-beers',
        src: 'invokeBeers',
        onDone: {
          target: 'resolved',
          actions: ['handleResolved']
        },
        onError: {
          target: 'error',
          actions: ['handleError'],
        }
      },
    },
    resolved: {
      always:[
        {
          target: 'noResults',
          cond: 'hasResults'
        },
        {
          target: 'success',
        },
      ]
    },
    error: {
      always: [
        {
          target: 'failed',
          cond: 'hasRetriedMax'
        },
        {
          target: 'loading',
          actions: 'updateRetries',
        },
      ]
    }
  },
  on: {
    SEARCH: {
      target: 'loading',
    },
  }
}

// State charts can sit within the app
const stateCharts =  {
  actions: {
    handleResolved: assign({
      beers: (_, event) => event.data,
      lastUpdated: () => Date.now()
    }),
    handleError: assign({
      error: (_, event) => event.data,
      lastUpdated: () => Date.now()
    }),
    updateRetries: assign({
      retries: (context) => context.retries + 1
    })
  },
  guards: {
    hasResults: (context) => !context.beers.length,
    hasRetriedMax: (context) => context.retries >= 3
  },
  services: {
    invokeBeers: (context, event) => {
    const { searchTerm = '' } = event

    const param = searchTerm && `?beer_name=${searchTerm}`

    return fetch(`https://api.punkapi.com/v2/beers${param}`)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json()
      })
    }
  }
}

const beersMachine = Machine(stateMachine, stateCharts)

export default beersMachine
