function transmitter() {
  const subscriptions = []
  let nowDispatching = false
  let toUnsubscribe = {}

  const unsubscribe = (onChange) => {
    const id = subscriptions.indexOf(onChange)
    if (id < 0) return
    if (nowDispatching) {
      toUnsubscribe[id] = onChange
      return
    }
    subscriptions.splice(id, 1)
  }

  const subscribe = (onChange) => {
    const id = subscriptions.push(onChange)
    const dispose = () => unsubscribe(onChange)
    return { dispose }
  }

  const publish = (...args) => {
    nowDispatching = true
    try {
      subscriptions.forEach(
        (subscription, id) => toUnsubscribe[id] || subscription(...args)
      )
    } finally {
      nowDispatching = false
      Object.keys(toUnsubscribe).forEach(id => unsubscribe(toUnsubscribe[id]))
      toUnsubscribe = {}
    }
  }

  const destroy = () => {
    subscriptions.forEach(onChange => unsubscribe(onChange));
    subscriptions.length = 0;
  }

  return {
    publish,
    subscribe,
    destroy,
    $subscriptions: subscriptions
  }
}

module.exports = transmitter
