import './style.css'
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js'

const appHost = document.querySelector<HTMLDivElement>('#app')
if (!appHost) {
  throw new Error('Missing #app container')
}

async function bootstrap() {
  const app = new Application()
  await app.init({
    background: '#1a1a2e',
    resizeTo: window,
    antialias: true,
  })

  appHost.appendChild(app.canvas)

  const scene = new Container()
  app.stage.addChild(scene)

  const ground = new Graphics()
    .rect(0, 0, app.renderer.width, 120)
    .fill({ color: 0x0f0f1f })
  ground.y = app.renderer.height - 120
  scene.addChild(ground)

  const player = new Graphics().circle(0, 0, 28).fill({ color: 0xffc857 })
  player.x = 140
  player.y = ground.y - 28
  scene.addChild(player)

  const title = new Text({
    text: 'PixiJS + Vite',
    style: new TextStyle({
      fill: '#ffffff',
      fontSize: 28,
      fontWeight: '600',
    }),
  })
  title.x = 24
  title.y = 24
  scene.addChild(title)

  let velocityY = 0
  const gravity = 1600
  const jumpVelocity = -720

  function jump() {
    if (Math.abs(player.y - (ground.y - 28)) < 1) {
      velocityY = jumpVelocity
    }
  }

  window.addEventListener('pointerdown', jump)
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') jump()
  })

  app.ticker.add((ticker) => {
    const dt = ticker.deltaMS / 1000
    velocityY += gravity * dt
    player.y += velocityY * dt

    const floorY = ground.y - 28
    if (player.y > floorY) {
      player.y = floorY
      velocityY = 0
    }
  })

  window.addEventListener('resize', () => {
    ground.clear()
    ground.rect(0, 0, app.renderer.width, 120).fill({ color: 0x0f0f1f })
    ground.y = app.renderer.height - 120
    player.y = ground.y - 28
  })
}

bootstrap()
