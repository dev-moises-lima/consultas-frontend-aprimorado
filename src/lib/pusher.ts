import Pusher from "pusher-js";

const app_key = import.meta.env.VITE_PUSHER_APP_KEY
const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER

const pusher = new Pusher(app_key, {
  cluster
})

export const atualizacoes = pusher.subscribe('atualizacoes')