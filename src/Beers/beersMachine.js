import { Machine, assign, send } from 'xstate'

const beersMachine = Machine({
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
          actions: ['handleResolved'],
        }
      },
    },
    resolved: {
      always:[
        {
          target: 'noResults',
          cond: (context) => !context.beers.length
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
          actions: assign({
            retries: (context) => context.retries + 1
          }),
        },
      ]
    }
  },
  on: {
    SEARCH: {
      target: 'loading',
    },
  }
},
{
  actions: {
    handleResolved: assign({
      beers: (_, event) => event.data,
      lastUpdated: () => Date.now()
    }),
    handleError: assign({
      error: (_, event) => event.data,
      lastUpdated: () => Date.now()
    })
  },
  guards: {
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
});

// const serlialized = JSON.stringify(beersMachine)
// // const serlialized = beersMachine.toJSON()
// console.log(serlialized)
// const parsed = JSON.parse(serlialized)

export default beersMachine
