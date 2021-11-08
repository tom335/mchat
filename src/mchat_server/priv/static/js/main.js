import WebSocketClient from './wsclient.js'

const ws = new WebSocketClient()
const roomGeneral = 'room:general'


ws.setup({

    onOpen: ev => {
        console.log('joining room:general')
        ws.join(roomGeneral)
    },

    onMessage: (ev, json) => {
        if (json.message) {
            Alpine.store('messages').addMessage(json.message)
        }
    }
})


document.addEventListener('alpine:init', () => {

    ws.join('general')

    Alpine.store('channels', {
        current: 'general',

        items: [
            {
                name: 'general',
            },
            {
                name: 'programming',
            }
        ],

        setChannel(name) {
            console.log(`set channel to ${name}`)
            this.current = name
            ws.join(name)
        },
    })

    Alpine.store('messages', {

        items: {
            'general': [
                {
                    'from': 'admin',
                    'to':   'general',
                    'text': 'Welcome to #general',
                    'timestamp': Date.now()
                }
            ],
            'programming' : [
                {
                    'from': 'admin',
                    'to':   'general',
                    'text': 'Welcome to #programming',
                    'timestamp': Date.now()
                }
            ]
        },

        addMessage(message) {
            const m = JSON.parse(message)
            console.log(this.items[m.to])
            this.items[m.to].push(m)
        }
    })

    Alpine.data('app', () => ({

        currentChannel() {
            return this.channel
        },

        sendMessage() {
            const input = document.querySelector('.message')
            const message = {
                from: 'user',
                to: Alpine.store('channels').current,
                text: input.value,
                timestamp: Date.now()
            }

            console.log("Sending... to room:general")
            ws.message(JSON.stringify(message), message.to)
        },

        formatDate(timestamp) {
            const d = new Date(timestamp)
            return d.toLocaleTimeString()
        }
    }))
})

