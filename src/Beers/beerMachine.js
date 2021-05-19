import { Machine, assign } from 'xstate'
  // Available variables:
  // - Machine
  // - interpret
  // - assign
  // - send
  // - sendParent
  // - spawn
  // - raise
  // - actions
  // - XState (all XState exports)

  const invokeBeers = (context, event) => {
    const { value: searchTerm = '' } = event

    console.log({ event })

    const param = searchTerm && `?beer_name=${searchTerm}`

    return fetch(`https://api.punkapi.com/v2/beers${param}`)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json()
      })
  }


  const beerMachine = Machine({
    id: 'fetch',
    initial: 'idle',
    context: {
      retries: 0
    },
    states: {
      idle: {
        always: 'loading'
      },
      loading: {
        invoke: {
          id: "fetch-beers",
          src: invokeBeers,
          onDone: {
            target: "success",
            actions: assign({
              beers: (_, event) => event.data,
              lastUpdated: () => Date.now()
            })
          },
          onError: {
            target: "error",
            actions: assign({
              error: (_, event) => event.data,
              lastUpdated: () => Date.now()
            })
          }
        },
      },
      success: {},
      failed: {
        type: 'final'
      },
      error: {
        on: {
          RETRY: [{
            target: 'loading',
            actions: assign({
              retries: (context) => context.retries + 1
            }),
            cond: (context) => context.retries <= 3
          },{
            target: 'failed',
            cond: (context) => context.retries > 1
          }]
        }
      }
    },
    on: {
      SEARCH: {
        target: "loading",
      }
    }
  });


  export default beerMachine
