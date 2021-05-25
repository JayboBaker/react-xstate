import { Machine, assign } from 'xstate'

const basketMachine = Machine({
  id: 'basket',
  initial: 'empty',
  context: {
    items: {}
  },
  states: {
    empty: {},
    notEmpty: {
      always: {
        target: 'empty',
        cond: 'isBasketEmpty'
      },
    },
  },
  on: {
    ADD: {
      actions: ['addItem'],
      target: 'notEmpty',
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
  },
  guards: {
    isBasketEmpty: (context) => !Object.values(context.items).length
  },
})


  export default basketMachine
