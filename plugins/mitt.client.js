import mitt from 'mitt'

export default defineNuxtPlugin(() => {
  const emitter = mitt()

  return {
    provide: {
      emit: emitter.emit, // Will emit an event
      on: emitter.on, // Will register a listener for an event
      off: emitter.off // Will register a listener for an event
    }
  }
})
