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
            const p = document.createElement('p')
            console.log(json)
            p.innerText = json.message

            document.querySelector('.messages').append(p)
        }
    }
})


document.addEventListener('alpine:init', () => {

    Alpine.store('channels', {
        items: [
            {
                name: 'general',
            },
            {
                name: 'programming',
            }
        ]
    })

    Alpine.data('app', () => ({

        currentChannel() {
            return this.channel
        },

        setChannel(name) {
            console.log(`set channel to ${name}`)
            // this.channel = name
        },

        sendMessage() {
            const input = document.querySelector('.message')
            const message = input.value

            console.log("Sending... to room:general")
            ws.message(message, roomGeneral)
        }
    }))
})

