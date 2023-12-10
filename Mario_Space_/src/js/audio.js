import {Howl} from 'howler'
import audioCompleteLevel from '../audio/audioCompleteLevel.mp3'
import audioDescend from '../audio/audioDescend.mp3'
import audioDie from '../audio/audioDie.mp3'
import audioPowerUpShot from '../audio/audioPowerUpShot.mp3'
import audioFireworkBurst from '../audio/audioFireworkBurst.mp3'
import audioFireworkWhistle from '../audio/audioFireworkWhistle.mp3'
import audioGameOver from '../audio/audioGameOver.mp3'
import audioJump from '../audio/audioJump.mp3'
import audioLosePowerUp from '../audio/audioLosePowerUp.mp3'
import audioObtainPowerUp from '../audio/audioWinLevel.mp3'
import audioGoombaSquash from '../audio/audioGoombaSquash.mp3'
import audioMusicLevels from '../audio/audioMusicLevels.mp3'

export const audio = {
    completeLevel: new Howl({
        src: [audioCompleteLevel],
        volume: 0.1
    }),
    descend: new Howl({
        src: [audioDescend],
        volume: 0.1
    }),
    die: new Howl({
        src: [audioDie],
        volume: 0.1
    }),
    powerUpShot: new Howl({
        src: [audioPowerUpShot],
        volume: 0.1
    }),
    fireworkBurst: new Howl({
        src: [audioFireworkBurst],
        volume: 0.1
    }),

    fireworkWhistle: new Howl({
        src: [audioFireworkWhistle],
        volume: 0.1
    }),
    gameOver: new Howl({
        src: [audioGameOver],
        volume: 0.1
    }),
    jump: new Howl({
        src: [audioJump],
        volume: 0.1
    }),
    losePowerUp: new Howl({
        src: [audioLosePowerUp],
        volume: 0.1
    }),
    musicLevels: new Howl({
        src: [audioMusicLevels],
        volume: 0.1,
        loop: true,
        autoplay: true
    }),
    obtainPowerUp: new Howl({
        src: [audioObtainPowerUp],
        volume: 0.1
    }),
    goombaSquash: new Howl({
        src: [audioGoombaSquash],
        volume: 0.1
    })
}
