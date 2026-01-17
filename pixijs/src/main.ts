import './style.css';
import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Texture,
} from 'pixi.js';
import { uiAssets } from './uiAssets';
import bgImage from './assets/bg/bg.webp';

const MAX_HP = 3;

function renderHearts(container: HTMLDivElement, hp: number) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  for (let i = 0; i < MAX_HP; i += 1) {
    const heart = document.createElement('span');
    heart.className = i < hp ? 'heart filled' : 'heart empty';
    heart.textContent = '❤️';
    container.appendChild(heart);
  }
}

function createHeader() {
  const header = document.createElement('div');
  header.className = 'game-header';

  const hpDisplay = document.createElement('div');
  hpDisplay.className = 'hp-container';
  hpDisplay.id = 'hp-display';
  renderHearts(hpDisplay, MAX_HP);
  header.appendChild(hpDisplay);

  const scoreContainer = document.createElement('div');
  scoreContainer.className = 'paypal-counter';

  const scoreImage = document.createElement('img');
  scoreImage.src = uiAssets.paypalCounterImage;
  scoreImage.alt = 'PayPal Balance';
  scoreImage.className = 'paypal-counter-image';
  scoreContainer.appendChild(scoreImage);

  const scoreDisplay = document.createElement('span');
  scoreDisplay.className = 'paypal-counter-amount';
  scoreDisplay.id = 'score-display';
  scoreDisplay.textContent = '$0';
  scoreDisplay.style.fontSize = '28px';
  scoreContainer.appendChild(scoreDisplay);

  header.appendChild(scoreContainer);
  return header;
}

function createTutorialOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'tutorial-overlay';
  overlay.id = 'tutorial-overlay';

  const text = document.createElement('div');
  text.className = 'tutorial-text';
  text.id = 'tutorial-text';
  text.textContent = 'Tap to start earning!';
  overlay.appendChild(text);

  const handWrapper = document.createElement('div');
  handWrapper.className = 'tutorial-hand';

  const handIcon = document.createElement('img');
  handIcon.src = uiAssets.handIcon;
  handIcon.alt = 'tap';
  handIcon.className = 'hand-icon';
  handWrapper.appendChild(handIcon);

  overlay.appendChild(handWrapper);
  return overlay;
}

function createEndOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'end-overlay hidden';

  const content = document.createElement('div');
  content.className = 'end-content';

  const title = document.createElement('h1');
  title.className = 'end-title';
  title.id = 'end-title';
  title.textContent = 'Congratulations!';
  content.appendChild(title);

  const subtitle = document.createElement('h2');
  subtitle.className = 'end-subtitle';
  subtitle.id = 'end-subtitle';
  subtitle.textContent = 'Choose your reward!';
  content.appendChild(subtitle);

  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'paypal-card-wrapper';

  const lights = document.createElement('img');
  lights.src = uiAssets.lightsEffect;
  lights.className = 'lights-effect';
  lights.alt = '';
  cardWrapper.appendChild(lights);

  const cardContainer = document.createElement('div');
  cardContainer.className = 'paypal-card-container';

  const cardImage = document.createElement('img');
  cardImage.src = uiAssets.paypalCardImage;
  cardImage.className = 'paypal-card-image';
  cardImage.alt = 'PayPal';
  cardContainer.appendChild(cardImage);

  const endAmount = document.createElement('span');
  endAmount.className = 'paypal-card-amount';
  endAmount.id = 'end-amount';
  endAmount.textContent = '$0.00';
  cardContainer.appendChild(endAmount);

  cardWrapper.appendChild(cardContainer);
  content.appendChild(cardWrapper);

  const countdown = document.createElement('div');
  countdown.className = 'countdown';

  const countdownTime = document.createElement('span');
  countdownTime.className = 'countdown-time';
  countdownTime.id = 'countdown-time';
  countdownTime.textContent = '00:58';
  countdown.appendChild(countdownTime);

  const countdownText = document.createElement('span');
  countdownText.className = 'countdown-text';
  countdownText.textContent = 'Next payment in one minute';
  countdown.appendChild(countdownText);

  content.appendChild(countdown);

  const ctaButton = document.createElement('button');
  ctaButton.className = 'cta-button';
  ctaButton.id = 'cta-button';
  ctaButton.textContent = 'Install and Earn';
  content.appendChild(ctaButton);

  overlay.appendChild(content);
  return overlay;
}

function createFailOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'fail-overlay hidden';

  const image = document.createElement('img');
  image.src = uiAssets.failImage;
  image.className = 'fail-image';
  image.alt = 'FAIL';
  overlay.appendChild(image);

  return overlay;
}

function createFooter() {
  const footer = document.createElement('div');
  footer.className = 'game-footer';
  footer.style.setProperty(
    '--footer-landscape',
    `url(${uiAssets.footerLandscape})`
  );
  footer.style.setProperty(
    '--footer-portrait',
    `url(${uiAssets.footerPortrait})`
  );

  const cta = document.createElement('button');
  cta.className = 'footer-cta';
  cta.id = 'footer-cta';
  cta.textContent = 'DOWNLOAD';
  footer.appendChild(cta);

  return footer;
}

function addStyles() {
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--footer-portrait', `url(${uiAssets.footerPortrait})`);
  rootStyle.setProperty(
    '--footer-landscape',
    `url(${uiAssets.footerLandscape})`
  );
}

function createUI(): HTMLDivElement {
  const existing = document.getElementById('ui-container');
  const container = (existing ??
    document.createElement('div')) as HTMLDivElement;
  container.id = 'ui-container';

  if (existing) {
    container.replaceChildren();
  } else {
    document.body.appendChild(container);
  }

  container.appendChild(createHeader());
  container.appendChild(createTutorialOverlay());
  container.appendChild(createEndOverlay());
  container.appendChild(createFailOverlay());
  container.appendChild(createFooter());
  addStyles();

  return container;
}

async function bootstrap() {
  const appHost = document.querySelector<HTMLDivElement>('#app');
  if (!appHost) {
    throw new Error('Missing #app container');
  }

  const uiContainer = createUI();

  const app = new Application();
  await app.init({
    background: '#ffffff',
    resizeTo: window,
    antialias: true,
  });

  appHost.appendChild(app.canvas);

  const scene = new Container();
  app.stage.addChild(scene);

  const playerSprites = import.meta.glob('./assets/player/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>;

  const sortFrames = (frames: [string, string][]) =>
    frames.sort((a, b) => {
      const aMatch = a[0].match(/_(\d+)\.png$/);
      const bMatch = b[0].match(/_(\d+)\.png$/);
      return Number(aMatch?.[1] ?? 0) - Number(bMatch?.[1] ?? 0);
    });

  const loadFrames = async (prefix: string): Promise<Texture[]> => {
    const entries = Object.entries(playerSprites).filter(([key]) =>
      key.replace(/\\/g, '/').includes(`/player/${prefix}_`)
    );
    const sorted = sortFrames(entries);
    return Promise.all(sorted.map(([, url]) => Assets.load(url)));
  };

  const [runFrames, jumpFrames, idleFrames, hurtFrames] = await Promise.all([
    loadFrames('run'),
    loadFrames('jump'),
    loadFrames('idle'),
    loadFrames('hurt'),
  ]);

  const backgroundTexture = await Assets.load(bgImage);
  const backgroundA = new Sprite(backgroundTexture);
  const backgroundB = new Sprite(backgroundTexture);
  backgroundA.anchor.set(0.5);
  backgroundB.anchor.set(0.5);
  scene.addChild(backgroundA);
  scene.addChild(backgroundB);

  const BASE_WIDTH = 720;
  const BASE_HEIGHT = 1280;
  const PLAYER_SCALE = 1.2;
  const groundHeight = 120;
  const groundLift = 180;
  const ground = new Graphics()
    .rect(0, 0, app.renderer.width, groundHeight);
  ground.y = app.renderer.height - groundHeight - groundLift;
  ground.visible = false;
  scene.addChild(ground);

  const player = new AnimatedSprite(runFrames);
  player.anchor.set(0.5);
  player.scale.set(PLAYER_SCALE);
  player.animationSpeed = 0.18;
  player.play();
  player.x = 140;
  player.y = ground.y - player.height * 0.5;
  scene.addChild(player);

  let velocityY = 0;
  let isJumping = false;
  let isRunning = false;
  const backgroundSpeed = 500;
  const JUMP_HEIGHT = 650;
  const JUMP_TIME = 0.8;
  const gravity = (4 * JUMP_HEIGHT) / (JUMP_TIME * JUMP_TIME);
  const jumpVelocity = -(2 * JUMP_HEIGHT) / JUMP_TIME;
  let currentAnimation: 'run' | 'jump' | 'idle' | 'hurt' = 'run';

  const playAnimation = (name: typeof currentAnimation) => {
    if (currentAnimation === name) return;
    currentAnimation = name;
    switch (name) {
      case 'run':
        player.textures = runFrames;
        player.loop = true;
        player.animationSpeed = 0.18;
        player.gotoAndPlay(0);
        break;
      case 'jump':
        player.textures = jumpFrames;
        player.loop = false;
        player.animationSpeed = 0.15;
        player.gotoAndPlay(0);
        break;
      case 'idle':
        player.textures = idleFrames;
        player.loop = true;
        player.animationSpeed = 0.12;
        player.gotoAndPlay(0);
        break;
      case 'hurt':
        player.textures = hurtFrames;
        player.loop = false;
        player.animationSpeed = 0.2;
        player.gotoAndPlay(0);
        break;
    }
  };

  player.onComplete = () => {
    if (currentAnimation === 'jump') {
      playAnimation(isRunning ? 'run' : 'idle');
    }
  };

  const startGame = () => {
    if (isRunning) return;
    isRunning = true;
    uiContainer.querySelector('#tutorial-overlay')?.remove();
    playAnimation('run');
  };

  function jump() {
    if (!isRunning) {
      startGame();
      return;
    }
    const floorY = ground.y - player.height * 0.5;
    if (Math.abs(player.y - floorY) < 1) {
      velocityY = jumpVelocity;
      isJumping = true;
      playAnimation('jump');
    }
  }

  window.addEventListener('pointerdown', jump);
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') jump();
  });

  let bgScale = 1;
  let bgWidth = 0;

  const applyFlip = (sprite: Sprite, flip: boolean) => {
    sprite.scale.set(flip ? -bgScale : bgScale, bgScale);
  };

  let scrollOffset = 0;
  let segmentIndex = 0;

  const layoutBackgrounds = () => {
    const { width, height } = app.renderer;
    const scale = height / BASE_HEIGHT;
    app.stage.scale.set(scale);
    app.stage.position.set((width - BASE_WIDTH * scale) / 2, 0);
    player.scale.set(PLAYER_SCALE);

    ground.clear();
    ground.rect(0, 0, BASE_WIDTH, groundHeight).fill({ color: 0x0f0f1f });
    ground.y = BASE_HEIGHT - groundHeight - groundLift;
    player.y = ground.y - player.height * 0.5;

    bgScale = BASE_HEIGHT / backgroundTexture.height;
    bgWidth = backgroundTexture.width * bgScale;

    const bgCenterY = BASE_HEIGHT * 0.5;
    backgroundA.position.set(BASE_WIDTH * 0.5, bgCenterY);
    backgroundB.position.set(BASE_WIDTH * 0.5 + bgWidth, bgCenterY);
    scrollOffset = -BASE_WIDTH * 0.5 - bgWidth * 0.5;
    segmentIndex = 0;
    applyFlip(backgroundA, false);
    applyFlip(backgroundB, true);
  };

  

  app.ticker.add((ticker) => {
    const dt = ticker.deltaMS / 1000;
    velocityY += gravity * dt;
    player.y += velocityY * dt;

    const floorY = ground.y - player.height * 0.5;
    if (player.y > floorY) {
      player.y = floorY;
      velocityY = 0;
      if (isJumping) {
        isJumping = false;
        playAnimation(isRunning ? 'run' : 'idle');
      }
    }

    if (isRunning) {
      scrollOffset -= backgroundSpeed * dt;
      while (scrollOffset <= -bgWidth) {
        scrollOffset += bgWidth;
        segmentIndex += 1;
      }
    }

    const baseX = BASE_WIDTH * 0.5 + scrollOffset;
    backgroundA.x = baseX;
    backgroundB.x = baseX + bgWidth;
    applyFlip(backgroundA, segmentIndex % 2 === 1);
    applyFlip(backgroundB, (segmentIndex + 1) % 2 === 1);
  });

  layoutBackgrounds();
  playAnimation('idle');
  window.addEventListener('resize', layoutBackgrounds);
}

bootstrap();
