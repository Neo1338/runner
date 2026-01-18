import './style.css';
import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Graphics,
  MeshRope,
  Point,
  Sprite,
  Text,
  Texture,
} from 'pixi.js';
import { uiAssets } from './uiAssets';
import bgImage from './assets/bg/bg.webp';
import flashlightImage from './assets/ui/flashlight.png';
import bushImage from './assets/ui/bush.png';
import bush2Image from './assets/ui/bush2.png';
import bush3Image from './assets/ui/bush3.png';
import pickupImage from './assets/ui/pickup.png';
import pickup2Image from './assets/ui/pickup2.webp';
import obstacleImage from './assets/ui/obstacle.webp';
import obstacle2Image from './assets/ui/obstacle2.webp';
import finishImage from './assets/ui/finish.png';
import finishLineLeftImage from './assets/ui/finish-line-left.png';
import finishLineRightImage from './assets/ui/finish-line-right.png';
import finishLeftImage from './assets/ui/finish-left.png';
import finishRightImage from './assets/ui/finish-right.png';
import bgmAudio from './assets/audio/bgm.mp3';
import fallAudio from './assets/audio/fall.mp3';
import hitAudio from './assets/audio/hit.mp3';
import jumpAudio from './assets/audio/jump.mp3';
import jump2Audio from './assets/audio/jump2.mp3';
import pickupAudio from './assets/audio/pickup.mp3';
import winAudio from './assets/audio/win.mp3';
import confetti1Image from './assets/ui/confetti.png';
import confetti2Image from './assets/ui/confetti2.png';
import confetti3Image from './assets/ui/confetti3.png';
import confetti4Image from './assets/ui/confetti4.png';
import confetti5Image from './assets/ui/confetti5.png';
import confetti6Image from './assets/ui/confetti6.png';

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
  const enemySprites = import.meta.glob('./assets/enemy/*.png', {
    eager: true,
    import: 'default',
  }) as Record<string, string>;

  const sortFrames = (frames: [string, string][]) =>
    frames.sort((a, b) => {
      const aMatch = a[0].match(/_(\d+)\.png$/);
      const bMatch = b[0].match(/_(\d+)\.png$/);
      return Number(aMatch?.[1] ?? 0) - Number(bMatch?.[1] ?? 0);
    });

  const loadFrames = async (
    entries: Record<string, string>,
    matcher: RegExp
  ): Promise<Texture[]> => {
    const frames = Object.entries(entries).filter(([key]) =>
      matcher.test(key.replace(/\\/g, '/'))
    );
    const sorted = sortFrames(frames);
    return Promise.all(sorted.map(([, url]) => Assets.load(url)));
  };

  const [runFrames, jumpFrames, idleFrames, hurtFrames, enemyFrames] =
    await Promise.all([
      loadFrames(playerSprites, /\/player\/run_/),
      loadFrames(playerSprites, /\/player\/jump_/),
      loadFrames(playerSprites, /\/player\/idle_/),
      loadFrames(playerSprites, /\/player\/hurt_/),
      loadFrames(enemySprites, /\/enemy\/frame_/),
    ]);

  const backgroundTexture = await Assets.load(bgImage);
  const flashlightTexture = await Assets.load(flashlightImage);
  const bushTextures = await Promise.all([
    Assets.load(bushImage),
    Assets.load(bush2Image),
    Assets.load(bush3Image),
  ]);
  const pickupTextures = {
    dollar: await Assets.load(pickupImage),
    paypalCard: await Assets.load(pickup2Image),
  };
  const obstacleTextures = await Promise.all([
    Assets.load(obstacleImage),
    Assets.load(obstacle2Image),
  ]);
  const finishTexture = await Assets.load(finishImage);
  const finishLineTextures = await Promise.all([
    Assets.load(finishLineLeftImage),
    Assets.load(finishLineRightImage),
  ]);
  const finishPoleTextures = await Promise.all([
    Assets.load(finishLeftImage),
    Assets.load(finishRightImage),
  ]);
  const bgm = new Audio(bgmAudio);
  bgm.loop = true;
  bgm.volume = 0.4;
  const sfx = {
    fall: new Audio(fallAudio),
    hit: new Audio(hitAudio),
    jump: new Audio(jumpAudio),
    jump2: new Audio(jump2Audio),
    pickup: new Audio(pickupAudio),
    win: new Audio(winAudio),
  };
  Object.values(sfx).forEach((audio) => {
    audio.volume = 0.6;
    audio.preload = 'auto';
  });
  const confettiTextures = await Promise.all([
    Assets.load(confetti1Image),
    Assets.load(confetti2Image),
    Assets.load(confetti3Image),
    Assets.load(confetti4Image),
    Assets.load(confetti5Image),
    Assets.load(confetti6Image),
  ]);
  const backgroundA = new Sprite(backgroundTexture);
  const backgroundB = new Sprite(backgroundTexture);
  backgroundA.anchor.set(0.5);
  backgroundB.anchor.set(0.5);
  scene.addChild(backgroundA);
  scene.addChild(backgroundB);
  const decorLayer = new Container();
  scene.addChild(decorLayer);
  const bushLayer = new Container();
  scene.addChild(bushLayer);
  const pickupLayer = new Container();
  scene.addChild(pickupLayer);
  const obstacleLayer = new Container();
  scene.addChild(obstacleLayer);
  const enemyLayer = new Container();
  scene.addChild(enemyLayer);
  const finishLayer = new Container();
  scene.addChild(finishLayer);
  const confettiLayer = new Container();
  scene.addChild(confettiLayer);

  const BASE_WIDTH = 720;
  const BASE_HEIGHT = 1280;
  const PLAYER_SCALE = 1.1;
  const groundHeight = 120;
  const groundLift = 180;
  const finishDimmer = new Graphics();
  finishDimmer.rect(0, 0, BASE_WIDTH, BASE_HEIGHT).fill({ color: 0x000000 });
  finishDimmer.alpha = 0;
  scene.addChild(finishDimmer);
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
  scene.setChildIndex(finishDimmer, scene.children.length - 1);
  scene.setChildIndex(confettiLayer, scene.children.length - 1);

  let velocityY = 0;
  let isJumping = false;
  let jumpQueued = false;
  let jumpEnabled = false;
  let tutorialEnemy: AnimatedSprite | null = null;
  let tutorialTriggered = false;
  let tutorialActive = false;
  let isRunning = false;
  const backgroundSpeed = 500;
  const START_BALANCE = 0;
  const DOLLAR_VALUE = 20;
  const PAYPAL_CARD_MIN = 5;
  const PAYPAL_CARD_MAX = 50;
  const INVINCIBILITY_TIME = 0.5;
  const BLINK_INTERVAL = 0.08;
  const JUMP_HEIGHT = 650;
  const JUMP_TIME = 0.8;
  const gravity = (4 * JUMP_HEIGHT) / (JUMP_TIME * JUMP_TIME);
  const jumpVelocity = -(2 * JUMP_HEIGHT) / JUMP_TIME;
  let currentAnimation: 'run' | 'jump' | 'idle' | 'hurt' = 'run';
  let score = START_BALANCE;
  let hp = MAX_HP;
  let isInvincible = false;
  let invincibleTimer = 0;
  let blinkTimer = 0;
  let blinkOn = false;
  let collectiblesCount = 0;
  let nextPraiseAt = 3 + Math.floor(Math.random() * 2);
  let isLosing = false;
  let loseFadeTimer = 0;
  let distanceTraveled = 0;
  let spawnIndex = 0;

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

  const getRunAnimation = () => (isRunning ? 'run' : 'idle');

  const setTutorialVisible = (visible: boolean, text?: string) => {
    const overlay =
      uiContainer.querySelector<HTMLDivElement>('#tutorial-overlay');
    if (!overlay) return;
    if (text) {
      const label = overlay.querySelector<HTMLDivElement>('#tutorial-text');
      if (label) label.textContent = text;
    }
    overlay.classList.toggle('hidden', !visible);
  };

  const playSfx = (key: keyof typeof sfx) => {
    const audio = sfx[key];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  player.onComplete = () => {
    if (currentAnimation === 'jump') {
      playAnimation(getRunAnimation());
    }
    if (currentAnimation === 'hurt') {
      playAnimation(getRunAnimation());
    }
  };

  const startGame = () => {
    if (isRunning) return;
    if (hp <= 0) return;
    if (finishLine !== null) return;
    finishDimTarget = 0;
    finishDimmer.alpha = 0;
    isRunning = true;
    jumpEnabled = false;
    setTutorialVisible(false);
    playAnimation(getRunAnimation());
    bgm.play().catch(() => {});
  };

  const handleInput = (event?: Event) => {
    if (event && event.cancelable) {
      event.preventDefault();
    }
    jump();
  };

  function jump() {
    if (hp <= 0) return;
    if (tutorialActive) {
      tutorialActive = false;
      isRunning = true;
      tutorialEnemy?.play();
      setTutorialVisible(false);
      jumpEnabled = true;
      jumpQueued = false;
      velocityY = jumpVelocity;
      isJumping = true;
      playAnimation('jump');
      playSfx('jump');
      return;
    }
    if (!isRunning) {
      startGame();
      return;
    }
    if (!jumpEnabled) return;
    const floorY = ground.y - player.height * 0.5;
    const grounded =
      player.y >= floorY - 8 && Math.abs(velocityY) < 80 && !isJumping;
    if (grounded) {
      velocityY = jumpVelocity;
      isJumping = true;
      jumpQueued = false;
      playAnimation('jump');
      playSfx('jump');
    } else if (isRunning) {
      jumpQueued = true;
    }
  }

  window.addEventListener('pointerdown', (event) => {
    if (event.target !== app.canvas) {
      handleInput(event);
    }
  }, { passive: false });
  app.canvas.addEventListener('pointerdown', handleInput, { passive: false });
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') jump();
  });

  let bgScale = 1;
  let bgWidth = 0;
  const FLASHLIGHT_SCALE = 0.9;
  const FLASHLIGHT_SPACING = 700;
  const FLASHLIGHT_Y = BASE_HEIGHT * 0.305;
  let flashlightScale = 1;
  const flashlights: Sprite[] = [];
  const BUSH_SCALE = 0.3;
  const BUSH_SPAWN_MIN = 1;
  const BUSH_SPAWN_MAX = 1.8;
  const BUSH_Y = BASE_HEIGHT * 0.54;
  const BUSH_SPAWN_X_MIN = BASE_WIDTH + 500;
  const BUSH_SPAWN_X_MAX = BASE_WIDTH + 1000;
  const BUSH_INITIAL_X_MIN = -400;
  const BUSH_INITIAL_X_MAX = BASE_WIDTH + 400;
  const BUSH_INITIAL_GAP_MIN = 260;
  const BUSH_INITIAL_GAP_MAX = 640;
  let bushScale = 1;
  let bushTimer = 0;
  let nextBushDelay = BUSH_SPAWN_MIN;
  const bushes: Sprite[] = [];
  const PICKUP_SCALE = 0.08;
  const COLLECTIBLE_BASE_OFFSET = 160;
  let pickupScale = 1;
  const pickups: {
    sprite: Sprite;
    type: 'dollar' | 'paypalCard';
    yOffset: number;
  }[] = [];
  const OBSTACLE_SCALE = 0.45;
  const ENEMY_SCALE = 0.40;
  const FINISH_SCALE = 0.9;
  const ENEMY_CHASE_SPEED = 300;
  const ENEMY_SPEED_MULTIPLIER = 1;
  const OBSTACLE_PULSE_SPEED = 6;
  const OFFSCREEN_MARGIN_RATIO = 0.7;
  const OFFSCREEN_MARGIN = BASE_WIDTH * OFFSCREEN_MARGIN_RATIO;
  const obstacles: { container: Container; danger: Sprite; pulseOffset: number }[] = [];
  const enemies: AnimatedSprite[] = [];
  type FinishLine = {
    container: Container;
    base: Sprite;
    tapeLeft: Sprite;
    tapeRight: Sprite;
    poleLeft: Sprite;
    poleRight: Sprite;
    leftRope?: MeshRope;
    rightRope?: MeshRope;
    leftRopePoints: Point[];
    rightRopePoints: Point[];
    leftVelocities: { x: number; y: number }[];
    rightVelocities: { x: number; y: number }[];
    animationTime: number;
    isAnimating: boolean;
    broken: boolean;
  };
  let finishLine: FinishLine | null = null;
  const TAPE = {
    ROPE_SEGMENTS: 10,
    ROPE_LENGTH_FACTOR: 0.3,
    GRAVITY: 0.3,
    DAMPING: 0.95,
    WAVE_SPEED: 0.01,
    TIME_DECAY: 0.15,
    MIN_VELOCITY_THRESHOLD: 0.1,
    MIN_ANIMATION_TIME: 1,
    ROPE_SEGMENT_DISTANCE: 10,
    LEFT_ROPE_OFFSET_X: 0,
    LEFT_ROPE_OFFSET_Y: 0,
    RIGHT_ROPE_OFFSET_X: 20,
    RIGHT_ROPE_OFFSET_Y: -20,
    TAPE_BREAK_OFFSET: -300,
    SCALE_X: 1.8,
  };
  const CONFETTI = {
    PARTICLE_COUNT: 280,
    LIFETIME: 5000,
    FADE_START: 0.7,
    SCALE_MIN: 0.8,
    SCALE_MAX: 1.5,
    BURST_SPEED_MIN: 6,
    BURST_SPEED_MAX: 20,
    BURST_ANGLE_SPREAD: 30,
    SIDE_MARGIN: 50,
    SIDE_SPAWN_HEIGHT: 0.7,
    SIDE_SPAWN_SPREAD_Y: 200,
    SPAWN_SPREAD_X: 100,
    SPAWN_SPREAD_Y: 50,
    GRAVITY: 0.05,
    AIR_RESISTANCE: 0.998,
    WIND_X: 0,
    ROTATION_SPEED_MIN: 0.02,
    ROTATION_SPEED_MAX: 0.1,
  };
  const confettiParticles: {
    sprite: Sprite;
    vx: number;
    vy: number;
    rotation: number;
    lifetime: number;
    maxLifetime: number;
  }[] = [];
  let finishDimTarget = 0;
  const warningLabels: { container: Container; x: number }[] = [];
  let hasSeededDecor = false;
  let hasSetInitialOffset = false;

  type ScriptEntry =
    | { type: 'collectible'; distance: number; yOffset?: number }
    | { type: 'enemy'; distance: number; pauseForTutorial?: boolean }
    | { type: 'obstacle'; distance: number; warningLabel?: boolean }
    | { type: 'finish'; distance: number };

  const spawnScript: ScriptEntry[] = [
    { type: 'collectible', distance: 1 },
    { type: 'collectible', distance: 2 },
    { type: 'enemy', distance: 3, pauseForTutorial: true },
    { type: 'collectible', distance: 4, yOffset: 50 },
    { type: 'collectible', distance: 4.2, yOffset: 150 },
    { type: 'collectible', distance: 4.4, yOffset: 250 },
    { type: 'collectible', distance: 4.6, yOffset: 150 },
    { type: 'collectible', distance: 4.8, yOffset: 50 },
    { type: 'obstacle', distance: 5.6, warningLabel: true },
    { type: 'collectible', distance: 6.4 },
    { type: 'enemy', distance: 7 },
    { type: 'collectible', distance: 7.6 },
    { type: 'collectible', distance: 7.8, yOffset: 100 },
    { type: 'collectible', distance: 8, yOffset: 200 },
    { type: 'collectible', distance: 8.2, yOffset: 280 },
    { type: 'collectible', distance: 8.4, yOffset: 200 },
    { type: 'collectible', distance: 8.6, yOffset: 100 },
    { type: 'obstacle', distance: 9, warningLabel: true },
    { type: 'collectible', distance: 9.6 },
    { type: 'enemy', distance: 10 },
    { type: 'collectible', distance: 10.6 },
    { type: 'collectible', distance: 11, yOffset: 80 },
    { type: 'collectible', distance: 11.2, yOffset: 180 },
    { type: 'collectible', distance: 11.4, yOffset: 80 },
    { type: 'obstacle', distance: 12 },
    { type: 'enemy', distance: 12.6 },
    { type: 'collectible', distance: 13 },
    { type: 'collectible', distance: 13.2, yOffset: 100 },
    { type: 'collectible', distance: 13.4, yOffset: 200 },
    { type: 'collectible', distance: 13.6, yOffset: 100 },
    { type: 'obstacle', distance: 14, warningLabel: true },
    { type: 'collectible', distance: 14.5 },
    { type: 'enemy', distance: 15 },
    { type: 'collectible', distance: 15.4, yOffset: 80 },
    { type: 'collectible', distance: 15.6, yOffset: 180 },
    { type: 'collectible', distance: 15.8, yOffset: 260 },
    { type: 'collectible', distance: 16, yOffset: 180 },
    { type: 'collectible', distance: 16.2, yOffset: 80 },
    { type: 'obstacle', distance: 16.5 },
    { type: 'finish', distance: 18 },
  ];

  const applyFlip = (sprite: Sprite, flip: boolean) => {
    sprite.scale.set(flip ? -bgScale : bgScale, bgScale);
  };

  const ensureFlashlights = () => {
    const needed = Math.ceil((BASE_WIDTH + FLASHLIGHT_SPACING * 2) / FLASHLIGHT_SPACING);
    while (flashlights.length < needed) {
      const sprite = new Sprite(flashlightTexture);
      sprite.anchor.set(0.5);
      sprite.scale.set(flashlightScale);
      decorLayer.addChild(sprite);
      flashlights.push(sprite);
    }
  };

  const scheduleNextBush = () => {
    nextBushDelay =
      BUSH_SPAWN_MIN + Math.random() * (BUSH_SPAWN_MAX - BUSH_SPAWN_MIN);
  };

  const createPickup = (type: 'dollar' | 'paypalCard') => {
    const sprite = new Sprite(pickupTextures[type]);
    sprite.anchor.set(0.5);
    sprite.scale.set(pickupScale);
    return sprite;
  };

  const spawnPickup = (baseX: number, yOffset = 0) => {
    const type = Math.random() < 0.6 ? 'dollar' : 'paypalCard';
    const sprite = createPickup(type);
    sprite.x = baseX;
    const baseY = ground.y - COLLECTIBLE_BASE_OFFSET;
    sprite.y = baseY - yOffset;
    pickupLayer.addChild(sprite);
    pickups.push({ sprite, type, yOffset });
  };

  const spawnObstacle = (baseX: number, warningLabel = false) => {
    const baseTexture = obstacleTextures[0] ?? obstacleTextures[1];
    const container = new Container();
    container.x = baseX;
    container.y = ground.y;
    const base = new Sprite(baseTexture);
    base.anchor.set(0.5, 1);
    base.scale.set(bgScale * OBSTACLE_SCALE);
    container.addChild(base);
    const danger = new Sprite(obstacleTextures[1] ?? baseTexture);
    danger.anchor.set(0.5, 1);
    danger.scale.set(bgScale * OBSTACLE_SCALE);
    danger.alpha = 0.6;
    container.addChild(danger);
    obstacleLayer.addChild(container);
    obstacles.push({ container, danger, pulseOffset: Math.random() * Math.PI * 2 });
    if (warningLabel) {
      createWarningLabel(baseX);
    }
  };

  const spawnEnemy = (baseX: number, pauseForTutorial = false) => {
    const sprite = new AnimatedSprite(enemyFrames);
    sprite.anchor.set(0.5, 1);
    sprite.scale.set(-bgScale * ENEMY_SCALE, bgScale * ENEMY_SCALE);
    sprite.animationSpeed = 0.2;
    sprite.loop = true;
    sprite.play();
    sprite.x = baseX;
    sprite.y = ground.y;
    enemyLayer.addChild(sprite);
    enemies.push(sprite);
    if (pauseForTutorial && !tutorialEnemy) {
      tutorialEnemy = sprite;
    }
  };

  const spawnFinish = (baseX: number) => {
    if (finishLine) return;
    const container = new Container();
    container.x = baseX;
    container.y = ground.y;
    const base = new Sprite(finishTexture);
    base.anchor.set(0.5, 1);
    base.scale.set(bgScale * FINISH_SCALE);
    container.addChild(base);
    const poleLeft = new Sprite(finishPoleTextures[0]);
    poleLeft.anchor.set(0.5, 1);
    poleLeft.rotation = Math.PI / 2;
    poleLeft.scale.set(bgScale * FINISH_SCALE * 0.5);
    container.addChild(poleLeft);
    const poleRight = new Sprite(finishPoleTextures[1] ?? finishPoleTextures[0]);
    poleRight.anchor.set(0.5, 1);
    poleRight.rotation = Math.PI / 2;
    poleRight.scale.set(bgScale * FINISH_SCALE * 0.7);
    container.addChild(poleRight);
    const tapeLeft = new Sprite(finishLineTextures[0]);
    tapeLeft.anchor.set(0, 0);
    tapeLeft.scale.set(
      bgScale * FINISH_SCALE * TAPE.SCALE_X * 0.7,
      bgScale * FINISH_SCALE * 0.7
    );
    const tapeRight = new Sprite(finishLineTextures[1]);
    tapeRight.anchor.set(1, 0);
    tapeRight.scale.set(
      bgScale * FINISH_SCALE * TAPE.SCALE_X * 0.5,
      bgScale * FINISH_SCALE * 0.5
    );
    container.addChild(tapeLeft);
    container.addChild(tapeRight);
    finishLayer.addChild(container);
    finishLine = {
      container,
      base,
      tapeLeft,
      tapeRight,
      poleLeft,
      poleRight,
      leftRopePoints: [],
      rightRopePoints: [],
      leftVelocities: [],
      rightVelocities: [],
      animationTime: 0,
      isAnimating: false,
      broken: false,
    };
    positionFinishTape();
  };

  const addBushSprite = (desiredX: number) => {
    const lastTexture = bushes[bushes.length - 1]?.texture;
    const options =
      lastTexture == null
        ? bushTextures
        : bushTextures.filter((item) => item !== lastTexture);
    const texture = options[Math.floor(Math.random() * options.length)];
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 1);
    sprite.scale.set(bushScale);
    let x = desiredX;
    if (bushes.length > 0) {
      const lastBush = bushes[bushes.length - 1];
      const minSpacing = 0.5 * Math.max(sprite.width, lastBush.width);
      if (x - lastBush.x < minSpacing) {
        x = lastBush.x + minSpacing;
      }
    }
    sprite.x = x;
    sprite.y = BUSH_Y;
    bushLayer.addChild(sprite);
    bushes.push(sprite);
  };

  const spawnBushCluster = (baseX: number) => {
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i += 1) {
      const desiredX = baseX + (Math.random() * 60 - 30);
      addBushSprite(desiredX);
    }
  };

  const clearBushes = () => {
    for (const sprite of bushes) {
      sprite.destroy();
    }
    bushes.length = 0;
    bushLayer.removeChildren();
  };

  const seedInitialBushes = () => {
    clearBushes();
    let x = BUSH_INITIAL_X_MIN;
    while (x < BUSH_INITIAL_X_MAX) {
      spawnBushCluster(x);
      x +=
        BUSH_INITIAL_GAP_MIN +
        Math.random() * (BUSH_INITIAL_GAP_MAX - BUSH_INITIAL_GAP_MIN);
    }
  };

  const createWarningLabel = (x: number) => {
    const container = new Container();
    const text = new Text({
      text: 'EVADE',
      style: {
        fontFamily: 'GameFont, sans-serif',
        fontSize: 32,
        fontWeight: '900',
        fill: '#ff0000',
        stroke: { color: '#000000', width: 4 },
        align: 'center',
      },
    });
    text.anchor.set(0.5, 0.5);
    const padding = 16;
    const bg = new Graphics();
    bg.roundRect(
      -text.width / 2 - padding,
      -text.height / 2 - padding / 2,
      text.width + padding * 2,
      text.height + padding,
      8
    );
    bg.fill({ color: 0xffcc00, alpha: 0.95 });
    bg.stroke({ width: 4, color: 0xff9900 });
    container.addChild(bg);
    container.addChild(text);
    container.x = x;
    container.y = ground.y - 200;
    warningLabels.push({ container, x });
    obstacleLayer.addChild(container);
  };

  const ellipsesIntersect = (
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number },
    shrink = 0.75
  ) => {
    const aW = a.width * shrink;
    const aH = a.height * shrink;
    const bW = b.width * shrink;
    const bH = b.height * shrink;
    const aCx = a.x + a.width / 2;
    const aCy = a.y + a.height / 2;
    const bCx = b.x + b.width / 2;
    const bCy = b.y + b.height / 2;
    const dx = aCx - bCx;
    const dy = aCy - bCy;
    const rx = aW / 2 + bW / 2;
    const ry = aH / 2 + bH / 2;
    return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
  };

  const fitTextToContainer = (
    element: HTMLSpanElement,
    maxSize: number,
    minSize: number
  ) => {
    let size = maxSize;
    element.style.fontSize = `${size}px`;
    const containerWidth = element.offsetWidth;
    while (element.scrollWidth > containerWidth && size > minSize) {
      size -= 1;
      element.style.fontSize = `${size}px`;
    }
  };

  const updateScoreDisplay = () => {
    const currencySymbol = '$';
    const scoreDisplay =
      uiContainer.querySelector<HTMLSpanElement>('#score-display');
    const endAmount =
      uiContainer.querySelector<HTMLSpanElement>('#end-amount');
    if (scoreDisplay) {
      scoreDisplay.textContent = `${currencySymbol}${Math.floor(score)}`;
      fitTextToContainer(scoreDisplay, 28, 12);
    }
    if (endAmount) {
      endAmount.textContent = `${currencySymbol}${score.toFixed(2)}`;
    }
  };

  const updateHpDisplay = () => {
    const hpDisplay =
      uiContainer.querySelector<HTMLDivElement>('#hp-display');
    if (hpDisplay) {
      renderHearts(hpDisplay, hp);
    }
  };

  const updateCountdownDisplay = (seconds: number) => {
    const countdownTime =
      uiContainer.querySelector<HTMLSpanElement>('#countdown-time');
    if (!countdownTime) return;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    countdownTime.textContent = `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  let countdownInterval: number | undefined;

  const startCountdown = (seconds: number) => {
    const countdown = uiContainer.querySelector<HTMLDivElement>('.countdown');
    if (!countdown) return;
    if (countdownInterval) {
      window.clearInterval(countdownInterval);
    }
    let timeLeft = seconds;
    countdown.style.display = 'block';
    updateCountdownDisplay(timeLeft);
    countdownInterval = window.setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        countdown.style.display = 'none';
        if (countdownInterval) {
          window.clearInterval(countdownInterval);
          countdownInterval = undefined;
        }
      } else {
        updateCountdownDisplay(timeLeft);
      }
    }, 1000);
  };

  let balanceAnimationId: number | undefined;

  const animateBalance = (value: number) => {
    const endAmount =
      uiContainer.querySelector<HTMLSpanElement>('#end-amount');
    if (!endAmount) return;
    if (balanceAnimationId) {
      window.cancelAnimationFrame(balanceAnimationId);
      balanceAnimationId = undefined;
    }
    const start = performance.now();
    const duration = 1000;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = value * eased;
      endAmount.textContent = `$${current.toFixed(2)}`;
      if (t < 1) {
        balanceAnimationId = window.requestAnimationFrame(animate);
      }
    };
    balanceAnimationId = window.requestAnimationFrame(animate);
  };

  const playEndScreenAnimations = (value: number) => {
    const cardContainer =
      uiContainer.querySelector<HTMLDivElement>('.paypal-card-container');
    const lights =
      uiContainer.querySelector<HTMLImageElement>('.lights-effect');
    if (!cardContainer || !lights) return;
    cardContainer.classList.remove('animate-scale');
    lights.classList.remove('animate-lights');
    void cardContainer.offsetHeight;
    cardContainer.classList.add('animate-scale');
    lights.classList.add('animate-lights');
    window.setTimeout(() => {
      animateBalance(value);
    }, 600);
  };

  const showEndScreen = (isWin: boolean, value: number) => {
    const endOverlay = uiContainer.querySelector<HTMLDivElement>('.end-overlay');
    const endTitle = uiContainer.querySelector<HTMLHeadingElement>('#end-title');
    const endSubtitle =
      uiContainer.querySelector<HTMLHeadingElement>('#end-subtitle');
    const ctaButton =
      uiContainer.querySelector<HTMLButtonElement>('#cta-button');
    const countdownText =
      uiContainer.querySelector<HTMLSpanElement>('.countdown-text');
    const footer = uiContainer.querySelector<HTMLDivElement>('.game-footer');
    if (!endOverlay || !endTitle || !endSubtitle || !ctaButton) return;

    endTitle.textContent = isWin ? 'Congratulations!' : "You didn't make it!";
    endSubtitle.textContent = isWin
      ? 'Choose your reward!'
      : 'Try again on the app!';
    ctaButton.textContent = 'Install and Earn';
    ctaButton.classList.toggle('lose', !isWin);
    if (countdownText) {
      countdownText.textContent = 'Next payment in one minute';
    }
    if (footer) {
      footer.style.display = 'none';
    }
    endOverlay.classList.toggle('dim', !isWin);
    finishDimTarget = isWin ? 0.35 : 0;
    endOverlay.classList.remove('hidden');
    playEndScreenAnimations(value);
    startCountdown(60);
    if (isWin) {
      bgm.pause();
      playSfx('win');
    }
    if (isWin) {
      confettiBurstFromSides(BASE_WIDTH, BASE_HEIGHT);
    }
  };

  const showFailAnimation = () => {
    const failOverlay = uiContainer.querySelector<HTMLDivElement>('.fail-overlay');
    if (!failOverlay) return;
    failOverlay.classList.remove('hidden');
    setTimeout(() => {
      failOverlay.classList.add('hidden');
      showEndScreen(false, score);
    }, 1500);
  };

  const handleLose = () => {
    if (!isRunning) return;
    isRunning = false;
    isLosing = true;
    loseFadeTimer = 0;
    playAnimation('hurt');
    bgm.pause();
    playSfx('fall');
    showFailAnimation();
  };

  const handlePlayerHit = () => {
    if (isInvincible || hp <= 0) return;
    hp -= 1;
    updateHpDisplay();
    playAnimation('hurt');
    playSfx('hit');
    isInvincible = true;
    invincibleTimer = INVINCIBILITY_TIME;
    blinkTimer = 0;
    blinkOn = false;
    if (hp <= 0) {
      handleLose();
    }
  };

  const animateFlyingCollectible = (
    source: Sprite,
    type: 'dollar' | 'paypalCard'
  ) => {
    const scoreContainer =
      uiContainer.querySelector<HTMLDivElement>('.paypal-counter');
    if (!scoreContainer) return;
    const canvasRect = app.canvas.getBoundingClientRect();
    const bounds = source.getBounds();
    const startX = canvasRect.left + bounds.x + bounds.width / 2;
    const startY = canvasRect.top + bounds.y + bounds.height / 2;
    const targetRect = scoreContainer.getBoundingClientRect();
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;
    const wrapper = document.createElement('div');
    wrapper.className = 'flying-collectible';
    wrapper.style.setProperty('--fly-duration', '0.4s');
    const img = document.createElement('img');
    img.src = type === 'dollar' ? pickupImage : pickup2Image;
    wrapper.appendChild(img);
    wrapper.style.left = `${startX}px`;
    wrapper.style.top = `${startY}px`;
    const animName = `fly-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const style = document.createElement('style');
    style.textContent = `
@keyframes ${animName} {
  0% {
    left: ${startX}px;
    top: ${startY}px;
    opacity: 1;
    transform: scale(1);
  }
  100% {
    left: ${endX}px;
    top: ${endY}px;
    opacity: 0.8;
    transform: scale(0.5);
  }
}
`;
    document.head.appendChild(style);
    wrapper.style.animation = `${animName} 0.4s ease-in forwards`;
    document.body.appendChild(wrapper);
    wrapper.addEventListener('animationend', () => {
      scoreContainer.classList.remove('pulse');
      void scoreContainer.offsetWidth;
      scoreContainer.classList.add('pulse');
      wrapper.remove();
      style.remove();
    });
  };

  const showPraisePopup = () => {
    const phrases = ['Awesome!', 'Fantastic!', 'Great!', 'Perfect!'];
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    const popup = document.createElement('div');
    popup.className = 'praise-popup';
    popup.textContent = text;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const offsetX = (Math.random() - 0.5) * 60;
    const offsetY = (Math.random() - 0.5) * 40;
    popup.style.left = `${width / 2 + offsetX}px`;
    popup.style.top = `${height * 0.4 + offsetY}px`;
    document.body.appendChild(popup);
    popup.addEventListener('animationend', () => {
      popup.remove();
    });
  };

  const positionFinishTape = () => {
    if (!finishLine) return;
    const base = finishLine.base;
    const leftEdge = -base.width * 0.48;
    const tapeTopY = -base.height * 0.78;
    const tapeBottomY = -base.height * 0.12;
    const poleX = leftEdge - base.width * 0.03;
    finishLine.poleLeft.x = poleX * 0.96;
    finishLine.poleRight.x = poleX * 0.62;
    finishLine.poleLeft.y = tapeTopY * 2.1;
    finishLine.poleRight.y = tapeBottomY * 6;
    const leftTapeX = finishLine.poleLeft.x;
    const rightTapeX = finishLine.poleRight.x - 35 * bgScale * FINISH_SCALE;
    const leftTapeY = finishLine.poleLeft.y - 35 * bgScale * FINISH_SCALE;
    const rightTapeY = finishLine.poleRight.y - 50 * bgScale * FINISH_SCALE;
    finishLine.tapeLeft.x = leftTapeX;
    finishLine.tapeLeft.y = leftTapeY;
    finishLine.tapeRight.x = rightTapeX;
    finishLine.tapeRight.y = rightTapeY;
    finishLine.tapeLeft.rotation = 0.4;
    finishLine.tapeRight.rotation = -2.55;
  };

  const confettiBurst = (x: number, y: number, angleDeg = -90) => {
    const angle = (angleDeg * Math.PI) / 180;
    const spread = (CONFETTI.BURST_ANGLE_SPREAD * Math.PI) / 180;
    for (let i = 0; i < CONFETTI.PARTICLE_COUNT; i += 1) {
      const texture =
        confettiTextures[Math.floor(Math.random() * confettiTextures.length)];
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      const scale =
        CONFETTI.SCALE_MIN +
        Math.random() * (CONFETTI.SCALE_MAX - CONFETTI.SCALE_MIN);
      sprite.scale.set(scale);
      sprite.x = x + (Math.random() - 0.5) * CONFETTI.SPAWN_SPREAD_X;
      sprite.y = y + (Math.random() - 0.5) * CONFETTI.SPAWN_SPREAD_Y;
      const localAngle = angle + (Math.random() - 0.5) * spread;
      const speed =
        CONFETTI.BURST_SPEED_MIN +
        Math.random() * (CONFETTI.BURST_SPEED_MAX - CONFETTI.BURST_SPEED_MIN);
      const vx = Math.cos(localAngle) * speed;
      const vy = Math.sin(localAngle) * speed;
      const rotSpeed =
        CONFETTI.ROTATION_SPEED_MIN +
        Math.random() * (CONFETTI.ROTATION_SPEED_MAX - CONFETTI.ROTATION_SPEED_MIN);
      const rotation = (Math.random() > 0.5 ? 1 : -1) * rotSpeed;
      confettiLayer.addChild(sprite);
      confettiParticles.push({
        sprite,
        vx,
        vy,
        rotation,
        lifetime: 0,
        maxLifetime: CONFETTI.LIFETIME,
      });
    }
  };

  const confettiBurstFromSides = (width: number, height: number) => {
    const y = height * CONFETTI.SIDE_SPAWN_HEIGHT;
    confettiBurst(CONFETTI.SIDE_MARGIN, y, -70);
    confettiBurst(width - CONFETTI.SIDE_MARGIN, y, -110);
  };

  const createRopeFromTape = (
    tape: Sprite,
    texture: Texture,
    points: Point[],
    side: 'left' | 'right'
  ) => {
    points.length = 0;
    const width = texture.width * Math.abs(tape.scale.x);
    const height = texture.height * Math.abs(tape.scale.y);
    const cos = Math.cos(tape.rotation);
    const sin = Math.sin(tape.rotation);
    const offsetX = -tape.anchor.x * width;
    const offsetY = -tape.anchor.y * height;
    const anchorX = offsetX * cos - offsetY * sin;
    const anchorY = offsetX * sin + offsetY * cos;
    const sideOffsetX = side === 'left' ? TAPE.LEFT_ROPE_OFFSET_X : TAPE.RIGHT_ROPE_OFFSET_X;
    const sideOffsetY = side === 'left' ? TAPE.LEFT_ROPE_OFFSET_Y : TAPE.RIGHT_ROPE_OFFSET_Y;
    for (let i = 0; i < TAPE.ROPE_SEGMENTS; i += 1) {
      const dist = (i / (TAPE.ROPE_SEGMENTS - 1)) * width * TAPE.ROPE_LENGTH_FACTOR;
      const dx = dist * cos;
      const dy = dist * sin;
      const x = tape.x + anchorX + dx + sideOffsetX;
      const y = tape.y + anchorY + dy + sideOffsetY;
      points.push(new Point(x, y));
    }
    const rope = new MeshRope({ texture, points });
    finishLine!.container.addChild(rope);
    if (side === 'left') {
      finishLine!.leftRope = rope;
    } else {
      finishLine!.rightRope = rope;
    }
  };

  const animateRopePoints = (points: Point[], velocities: { x: number; y: number }[]) => {
    const decay = Math.exp(-finishLine!.animationTime * TAPE.TIME_DECAY);
    const gravity = TAPE.GRAVITY * decay;
    const wave = decay;
    for (let i = 1; i < points.length; i += 1) {
      const point = points[i];
      const vel = velocities[i];
      vel.y += gravity;
      const waveOffset = Math.sin(finishLine!.animationTime + i * TAPE.WAVE_SPEED) * 2 * wave;
      vel.x += waveOffset * 0.1;
      vel.x *= TAPE.DAMPING;
      vel.y *= TAPE.DAMPING;
      point.x += vel.x;
      point.y += vel.y;
      const prev = points[i - 1];
      const dx = point.x - prev.x;
      const dy = point.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const target = TAPE.ROPE_SEGMENT_DISTANCE;
      if (dist > 0) {
        const diff = (dist - target) / dist;
        const offsetX = dx * diff * 0.5;
        const offsetY = dy * diff * 0.5;
        point.x -= offsetX;
        point.y -= offsetY;
      }
    }
  };

  const updateRopeAnimation = () => {
    if (!finishLine) return;
    finishLine.animationTime += 0.05;
    animateRopePoints(finishLine.leftRopePoints, finishLine.leftVelocities);
    animateRopePoints(finishLine.rightRopePoints, finishLine.rightVelocities);
    let total = 0;
    let count = 0;
    [...finishLine.leftVelocities, ...finishLine.rightVelocities].forEach((v) => {
      total += Math.sqrt(v.x * v.x + v.y * v.y);
      count += 1;
    });
    const avg = count > 0 ? total / count : 0;
    if (avg < TAPE.MIN_VELOCITY_THRESHOLD && finishLine.animationTime > TAPE.MIN_ANIMATION_TIME) {
      finishLine.isAnimating = false;
    }
  };

  const breakFinishTape = () => {
    if (!finishLine || finishLine.broken) return;
    finishLine.broken = true;
    finishLine.tapeLeft.visible = false;
    finishLine.tapeRight.visible = false;
    createRopeFromTape(
      finishLine.tapeLeft,
      finishLineTextures[0],
      finishLine.leftRopePoints,
      'left'
    );
    createRopeFromTape(
      finishLine.tapeRight,
      finishLineTextures[1],
      finishLine.rightRopePoints,
      'right'
    );
    finishLine.leftVelocities = finishLine.leftRopePoints.map(() => ({ x: 0, y: 0 }));
    finishLine.rightVelocities = finishLine.rightRopePoints.map(() => ({ x: 0, y: 0 }));
    finishLine.animationTime = 0;
    finishLine.isAnimating = true;

    // Confetti on finish is handled via burstFromSides to match reference.
  };

  const spawnFromScript = () => {
    while (spawnIndex < spawnScript.length) {
      const entry = spawnScript[spawnIndex];
      const targetDistance = entry.distance * BASE_WIDTH;
      if (distanceTraveled < targetDistance - BASE_WIDTH - OFFSCREEN_MARGIN) {
        break;
      }
      const spawnX = targetDistance - distanceTraveled + OFFSCREEN_MARGIN;
      switch (entry.type) {
        case 'collectible':
          spawnPickup(spawnX, entry.yOffset ?? 0);
          break;
        case 'enemy':
          spawnEnemy(spawnX, entry.pauseForTutorial ?? false);
          break;
        case 'obstacle':
          spawnObstacle(spawnX, entry.warningLabel ?? false);
          break;
        case 'finish':
          spawnFinish(spawnX);
          break;
        default:
          break;
      }
      spawnIndex += 1;
    }
  };

  let worldOffset = 0;

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
    flashlightScale = bgScale * FLASHLIGHT_SCALE;
    bushScale = bgScale * BUSH_SCALE;
    pickupScale = bgScale * PICKUP_SCALE;
    if (!hasSetInitialOffset) {
      worldOffset = -BASE_WIDTH * 0.5 - bgWidth * 0.5;
      hasSetInitialOffset = true;
    }
    ensureFlashlights();
    for (const sprite of flashlights) {
      sprite.scale.set(flashlightScale);
      sprite.y = FLASHLIGHT_Y;
    }
    if (!hasSeededDecor) {
      seedInitialBushes();
      hasSeededDecor = true;
    }
    for (const sprite of bushes) {
      sprite.scale.set(bushScale);
      sprite.y = BUSH_Y;
    }
    for (const item of pickups) {
      item.sprite.scale.set(pickupScale);
      item.sprite.y = ground.y - COLLECTIBLE_BASE_OFFSET - item.yOffset;
    }
    for (const obstacle of obstacles) {
      obstacle.container.y = ground.y;
      for (const child of obstacle.container.children) {
        if (child instanceof Sprite) {
          child.scale.set(bgScale * OBSTACLE_SCALE);
        }
      }
    }
    for (const label of warningLabels) {
      label.container.y = ground.y - 200;
    }
    for (const sprite of enemies) {
      sprite.scale.set(bgScale * ENEMY_SCALE);
      sprite.y = ground.y;
    }
    if (finishLine) {
      finishLine.container.y = ground.y;
      finishLine.base.scale.set(bgScale * FINISH_SCALE);
      finishLine.tapeLeft.scale.set(
        bgScale * FINISH_SCALE * TAPE.SCALE_X * 0.7,
        bgScale * FINISH_SCALE * 0.7
      );
      finishLine.tapeRight.scale.set(
        bgScale * FINISH_SCALE * TAPE.SCALE_X * 0.5,
        bgScale * FINISH_SCALE * 0.5
      );
      finishLine.poleLeft.scale.set(bgScale * FINISH_SCALE * 0.5);
      finishLine.poleRight.scale.set(bgScale * FINISH_SCALE * 0.7);
      positionFinishTape();
    }
    finishDimmer.clear();
    finishDimmer
      .rect(0, 0, app.renderer.width, app.renderer.height)
      .fill({ color: 0x000000 });
    finishDimmer.position.set(-app.stage.position.x / scale, 0);
    finishDimmer.scale.set(1 / scale);
    const bgCenterY = BASE_HEIGHT * 0.5;
    backgroundA.position.set(BASE_WIDTH * 0.5, bgCenterY);
    backgroundB.position.set(BASE_WIDTH * 0.5 + bgWidth, bgCenterY);
    applyFlip(backgroundA, false);
    applyFlip(backgroundB, true);
  };

  

  scheduleNextBush();
  bushTimer = 0;
  updateScoreDisplay();

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
        playAnimation(getRunAnimation());
        playSfx('jump2');
      }
      if (jumpQueued && isRunning && jumpEnabled) {
        jumpQueued = false;
        velocityY = jumpVelocity;
        isJumping = true;
        playAnimation('jump');
      }
    }

    if (isRunning) {
      distanceTraveled += backgroundSpeed * dt;
      worldOffset -= backgroundSpeed * dt;

      spawnFromScript();

      bushTimer += dt;
      if (bushTimer >= nextBushDelay) {
        bushTimer = 0;
        scheduleNextBush();
        spawnBushCluster(
          BUSH_SPAWN_X_MIN +
            Math.random() * (BUSH_SPAWN_X_MAX - BUSH_SPAWN_X_MIN)
        );
      }

      for (let i = bushes.length - 1; i >= 0; i -= 1) {
        const sprite = bushes[i];
        sprite.x -= backgroundSpeed * dt;
        if (sprite.x < -OFFSCREEN_MARGIN) {
          sprite.destroy();
          bushes.splice(i, 1);
        }
      }

      for (let i = pickups.length - 1; i >= 0; i -= 1) {
        const item = pickups[i];
        item.sprite.x -= backgroundSpeed * dt;
        if (item.sprite.x < -OFFSCREEN_MARGIN) {
          item.sprite.destroy();
          pickups.splice(i, 1);
        }
      }

      for (let i = obstacles.length - 1; i >= 0; i -= 1) {
        const obstacle = obstacles[i];
        obstacle.container.x -= backgroundSpeed * dt;
        obstacle.danger.alpha =
          0.4 +
          Math.sin(Date.now() * 0.001 * OBSTACLE_PULSE_SPEED + obstacle.pulseOffset) *
            0.4;
        if (obstacle.container.x < -OFFSCREEN_MARGIN) {
          obstacle.container.destroy();
          obstacles.splice(i, 1);
        }
      }

      for (let i = enemies.length - 1; i >= 0; i -= 1) {
        const sprite = enemies[i];
        sprite.x -=
          (backgroundSpeed + ENEMY_CHASE_SPEED) * ENEMY_SPEED_MULTIPLIER * dt;
        if (sprite.x < -OFFSCREEN_MARGIN) {
          sprite.destroy();
          enemies.splice(i, 1);
        }
      }

      for (let i = warningLabels.length - 1; i >= 0; i -= 1) {
        const label = warningLabels[i];
        label.x -= backgroundSpeed * dt;
        label.container.x = label.x;
        const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.1;
        label.container.scale.set(pulse);
        if (label.x < -OFFSCREEN_MARGIN) {
          label.container.destroy();
          warningLabels.splice(i, 1);
        }
      }

      if (finishLine) {
        finishLine.container.x -= backgroundSpeed * dt;
        if (finishLine.container.x < -OFFSCREEN_MARGIN) {
          finishLine.container.destroy();
          finishLine = null;
        } else if (
          finishLine.container.x <= BASE_WIDTH * 0.5 &&
          !finishLine.broken
        ) {
          breakFinishTape();
          isRunning = false;
          playAnimation('idle');
          showEndScreen(true, score);
        }
      }

      if (!tutorialTriggered && tutorialEnemy && isRunning) {
        const pauseDistance = 260;
        if (tutorialEnemy.x - player.x <= pauseDistance) {
          tutorialTriggered = true;
          tutorialActive = true;
          isRunning = false;
          playAnimation('idle');
          tutorialEnemy.stop();
          setTutorialVisible(true, 'Jump to avoid enemies');
        }
      }

      const playerBounds = player.getBounds();
      if (!isInvincible) {
        for (let i = 0; i < obstacles.length; i += 1) {
          const obstacleBounds = obstacles[i].container.getBounds();
          if (ellipsesIntersect(playerBounds, obstacleBounds, 0.6)) {
            handlePlayerHit();
            break;
          }
        }
      }
      if (!isInvincible) {
        for (let i = 0; i < enemies.length; i += 1) {
          if (ellipsesIntersect(playerBounds, enemies[i].getBounds(), 0.6)) {
            handlePlayerHit();
            break;
          }
        }
      }
      for (let i = pickups.length - 1; i >= 0; i -= 1) {
        const item = pickups[i];
        if (ellipsesIntersect(playerBounds, item.sprite.getBounds())) {
          const reward =
            item.type === 'paypalCard'
              ? Math.floor(
                  Math.random() * (PAYPAL_CARD_MAX - PAYPAL_CARD_MIN + 1)
                ) + PAYPAL_CARD_MIN
              : DOLLAR_VALUE;
          score += reward;
          animateFlyingCollectible(item.sprite, item.type);
          updateScoreDisplay();
          playSfx('pickup');
          collectiblesCount += 1;
          if (collectiblesCount >= nextPraiseAt) {
            showPraisePopup();
            collectiblesCount = 0;
            nextPraiseAt = 3 + Math.floor(Math.random() * 2);
          }
          item.sprite.destroy();
          pickups.splice(i, 1);
        }
      }
    }

    if (isInvincible) {
      invincibleTimer -= dt;
      blinkTimer += dt;
      if (blinkTimer >= BLINK_INTERVAL) {
        blinkTimer = 0;
        blinkOn = !blinkOn;
        player.tint = blinkOn ? 0xff3b3b : 0xffffff;
      }
      if (invincibleTimer <= 0) {
        isInvincible = false;
        player.tint = 0xffffff;
      }
    }

    if (isLosing) {
      loseFadeTimer += dt;
      const t = Math.min(loseFadeTimer / 0.6, 1);
      const alpha = 1 - t;
      for (const enemy of enemies) {
        enemy.alpha = alpha;
      }
      if (t >= 1) {
        isLosing = false;
      }
    }

    if (finishDimmer.alpha !== finishDimTarget) {
      const blend = Math.min(dt * 3, 1);
      finishDimmer.alpha =
        finishDimmer.alpha + (finishDimTarget - finishDimmer.alpha) * blend;
    }

    if (finishLine?.isAnimating) {
      updateRopeAnimation();
    }

    const step = ticker.deltaMS / 16.666;
    for (let i = confettiParticles.length - 1; i >= 0; i -= 1) {
      const particle = confettiParticles[i];
      particle.lifetime += ticker.deltaMS;
      if (particle.lifetime >= particle.maxLifetime) {
        particle.sprite.destroy();
        confettiParticles.splice(i, 1);
        continue;
      }
      particle.vy += CONFETTI.GRAVITY * step;
      particle.vx += CONFETTI.WIND_X * step;
      particle.vx *= CONFETTI.AIR_RESISTANCE;
      particle.vy *= CONFETTI.AIR_RESISTANCE;
      particle.sprite.x += particle.vx * step;
      particle.sprite.y += particle.vy * step;
      particle.sprite.rotation += particle.rotation * step;
      const fadeStart = particle.maxLifetime * CONFETTI.FADE_START;
      if (particle.lifetime >= fadeStart) {
        const t =
          (particle.lifetime - fadeStart) /
          (particle.maxLifetime - fadeStart);
        particle.sprite.alpha = 1 - t;
      }
    }

    const spacing = FLASHLIGHT_SPACING;
    const offset = ((worldOffset % spacing) + spacing) % spacing;
    const startX = -spacing + offset;
    for (let i = 0; i < flashlights.length; i += 1) {
      flashlights[i].x = startX + i * spacing;
    }

    const wrapped = ((worldOffset % bgWidth) + bgWidth) % bgWidth;
    const localOffset = wrapped - bgWidth;
    const segmentIndex = Math.floor((worldOffset - localOffset) / bgWidth);
    const segmentParity = ((segmentIndex % 2) + 2) % 2;
    const baseX = BASE_WIDTH * 0.5 + localOffset;
    backgroundA.x = baseX;
    backgroundB.x = baseX + bgWidth;
    applyFlip(backgroundA, segmentParity === 1);
    applyFlip(backgroundB, ((segmentParity + 1) % 2) === 1);
  });

  layoutBackgrounds();
  playAnimation('idle');
  updateScoreDisplay();
  updateHpDisplay();
  window.addEventListener('resize', layoutBackgrounds);
}

bootstrap();
