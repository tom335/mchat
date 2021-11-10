import WebSocketClient from './wsclient.js'

const ws_addr = 'ws://localhost:4000/ws'
const ws = new WebSocketClient({

    addr: ws_addr,

    onOpen: ev => {
        console.log('Socket open: joining default rooms')
        ws.join('general')
        ws.join('programming')
    },

    onMessage: (ev, json) => {
        if (json.message) {
            Alpine.store('messages').addMessage(json.message)
        }
    }
})

function randInt(min = 0, max = 1000) {
    return Math.floor(Math.random() * max) + min
}


function genUserName() {
    return 'user_' + randInt()
}

const userName = genUserName()


document.addEventListener('alpine:init', () => {

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
            console.log(`Channel set to ${name}`)
            this.current = name
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

        currentUser() {
            return userName
        },

        sendMessage() {
            const input = document.querySelector('.message')
            const message = {
                from: this.currentUser(),
                to: Alpine.store('channels').current,
                text: input.value,
                timestamp: Date.now()
            }
            input.value = ''

            ws.message(JSON.stringify(message), message.to)
        },

        formatDate(timestamp) {
            const d = new Date(timestamp)
            return d.toLocaleTimeString()
        }
    }))
})

