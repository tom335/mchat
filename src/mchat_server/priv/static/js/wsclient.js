const serialize = str => JSON.stringify(str)


export default class WebSocketClient {

    setup(opts) {
        this.socket = new WebSocket("ws://localhost:4000/ws")

        this.listen('open', ev => {
            opts.onOpen(ev)
        })

        this.listen('message', (event) => {
            opts.onMessage(event, JSON.parse(event.data))
        })

        this.listen('close', () => {
            // restart connection on close
            this.setup(opts)
        })
    }

    listen(evt, fn) {
        this.socket.addEventListener(evt, fn)
    }

    join(channel) {
        this.socket.send(serialize({action: 'join', channel: channel}))
    }

    message(message, channel) {
        this.socket.send(
            serialize({ action: 'message',
                        channel: channel, message: message })
        )
    }
}
