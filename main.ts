import EventBus, { ChickenEvents } from "./EventBus";

const bus = new EventBus<ChickenEvents>()

const uuid = bus.on("spawn", (chickenId, date) => {
   console.log(`La poule ${chickenId} a spawn le ${date}`)
})

bus.emit("spawn", "123")

bus.off('spawn', uuid)

bus.emit("spawn", "456")
