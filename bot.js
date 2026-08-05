const mineflayer = require('mineflayer')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('AFK Bot is running')
})

app.listen(PORT, () => {
  console.log('Web server online on port', PORT)
})

function createBot() {
  console.log('Trying to connect...')

  const bot = mineflayer.createBot({
    host: 'pgnr.aternos.me',
    port: 50932,
    username: 'AFKBot' + Math.floor(Math.random() * 999),
    version: 1.21.11,          // auto detect
    auth: 'offline'
  })

  bot.on('login', () => {
    console.log('Logged in successfully!')
  })

  bot.once('spawn', () => {
    console.log('Bot is inside the game!')
    bot.chat('AFK bot online')
    startMoving(bot)
  })

  bot.on('error', err => {
    console.log('Error:', err.message)
  })

  bot.on('kicked', reason => {
    console.log('Kicked:', reason)
    setTimeout(createBot, 12000)
  })

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting...')
    setTimeout(createBot, 12000)
  })
}

async function startMoving(bot) {
  while (bot.entity) {
    try {
      bot.setControlState('forward', true)
      bot.setControlState('sprint', true)

      if (Math.random() > 0.5) {
        bot.setControlState('jump', true)
        await sleep(400)
        bot.setControlState('jump', false)
      }

      if (Math.random() > 0.7) {
        const dir = Math.random() > 0.5 ? 'left' : 'right'
        bot.setControlState(dir, true)
        await sleep(600)
        bot.setControlState(dir, false)
      }

      await sleep(1500 + Math.random() * 2000)
    } catch (e) {
      await sleep(2000)
    }
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

createBot()
