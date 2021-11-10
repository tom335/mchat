const serialize = str => JSON.stringify(str)


export default class WebSocketClient {

    constructor(opts) {
        this.opts = opts
        this.init()
    }

    init(callback = null) {
        this.socket = new WebSocket(this.opts.addr)

        this.listen('open', ev => {
            this.opts.onOpen(ev)
            if (callback) callback()
        })

        this.listen('message', (event) => {
            this.opts.onMessage(event, JSON.parse(event.data))
        })

        this.listen('close', () => {
            // restart connection on close
            // this.setup(opts)
        })
        
    }

    listen(evt, fn) {
        this.socket.addEventListener(evt, fn)
    }

    ping() {
        this.socket.send('PING')
    }

    join(channel) {
        this.socket.send(serialize({action: 'join', channel: channel}))
    }

    message(message, channel) {
        const send = () => {
            this.socket.send(
                serialize({ action: 'message',
                            channel: channel, message: message })
            )
        }

        if (this.socket.readyState === WebSocket.CLOSED)
            this.init(send)
        else
            send()

    }
}
