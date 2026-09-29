type Events = Record<string, unknown[]>

export type DefineEvents<T extends Events> = T

export type ChickenEvents = DefineEvents<{
   catch: [ chickenId: string, details: { amount: number, time: number, userId: string } ],
   spawn: [ chickenId: string, date?: Date ],
   ready: []
}>

type Listener<
   TEvents extends Record<string, any>, 
   K extends keyof TEvents
> = (...args: TEvents[K]) => void

export default class EventBus<TEvents extends Events> {
   private lastId = 0
   private functions = new Map<
      keyof TEvents, 
      Map<number, Listener<TEvents, any>>
   >()

   on<K extends keyof TEvents>(
      event: K, 
      fn: Listener<TEvents, K>
   ) {
      const map = this.functions.get(event)
      const newId = this.lastId + 1
      if (map) {
         map.set(newId, fn)
         return newId
      }
      
      this.functions.set(event, new Map([[newId, fn]]))
      return newId
   }

   off<K extends keyof TEvents>(
      event: K, 
      uuid: number
   ) {
      const set = this.functions.get(event)
      if (set) {
         set.delete(uuid)
         if (set.size === 0) this.functions.delete(event)
      }
   }

   offAll<K extends keyof TEvents>(event: K) {
      this.functions.delete(event)
   }

   emit<K extends keyof TEvents>(
      event: K,
      ...args: TEvents[K]
   ) {
      this.functions.get(event)?.forEach(fn => fn(...args))
   }
}