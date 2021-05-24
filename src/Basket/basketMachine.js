import { Machine, assign } from 'xstate'

const basketMachine = Machine({
  id: 'basket',
  initial: 'empty',
  context: {
    items: {}
  },
  states: {
    empty: {
      always:         {
        target: 'notEmpty',
        cond: (context) => !!Object.values(context.items).length
      },
    },
    notEmpty: {},
  },
  on: {
    ADD: {
      actions: ['addItem'],
      target: 'empty',
    }
  },
},
  {
    actions: {
      addItem: assign({
        items: (context, { payload }) => {
          console.log({ payload })
          const item = context.items[payload.id] || {}
          return {
            ...context.items,
            [payload.id]: {
              ...payload,
              amount: (item.amount || 0) + 1
            },
          }
        }
      })
    }
  }
)


  export default basketMachine
