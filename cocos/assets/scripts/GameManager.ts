import { _decorator, Component, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: AudioClip })
    bgm: AudioClip | null = null;
 
    @property({ type: AudioClip })
    sfxJump: AudioClip | null = null;

    @property({ type: AudioClip })
    sfxHit: AudioClip | null = null;

    @property({ type: AudioClip })
    sfxPickup: AudioClip | null = null;

    @property({ type: AudioClip })
    sfxGameOver: AudioClip | null = null;

    @property({ type: AudioClip })
    sfxWin: AudioClip | null = null;

    @property({ type: AudioClip })
    sfxJump2: AudioClip | null = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


