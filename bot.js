const mineflayer = require('mineflayer')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('AFK Bot is running')
})

app.listen(PORT, () => {
  console.log('Web server running on port', PORT)
})

function createBot() {
  const bot = mineflayer.createBot({
    host: 'pgnr.aternos.me',
    port: 50932,
    username: 'AFKBot',
    version: '1.21.11',
    auth: 'offline'
  })

  bot.once('spawn', () => {
    console.log('Bot spawned!')
    bot.chat('AFK bot online 24/7')
    startMoving(bot)
  })

  bot.on('error', err => console.log('Error:', err.message))

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason)
    console.log('Reconnecting in 10 seconds...')
    setTimeout(createBot, 10000)
  })

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 10 seconds...')
    setTimeout(createBot, 10000)
  })
}

async function startMoving(bot) {
  while (bot.entity) {
    try {
      bot.setControlState('forward', true)
      bot.setControlState('sprint', true)

      if (Math.random() > 0.55) {
        bot.setControlState('jump', true)
        await sleep(450)
        bot.setControlState('jump', false)
      }

      if (Math.random() > 0.75) {
        bot.setControlState('left', true)
        await sleep(700)
        bot.setControlState('left', false)
      } else if (Math.random() > 0.75) {
        bot.setControlState('right', true)
        await sleep(700)
        bot.setControlState('right', false)
      }

      await sleep(1200 + Math.random() * 1800)
    } catch (err) {
      await sleep(2000)
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

createBot()
