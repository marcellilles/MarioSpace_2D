import backgroundLevel2 from '../img/level2/mountain2.png'
import mountains from '../img/level2/mountain2.png'
import lgPlatformLevel2 from '../img/level2/lgPlatform.png'
import mdPlatformLevel2 from '../img/level2/mdPlatform.png'
import spritePowerUpShootLeft from '../img/player/spriteFireFlowerShootLeft.png'
import spritePowerUpShootRight from '../img/player/spriteFireFlowerShootRight.png'

export const images = {
    hero: {
        shoot: {
            powerUp: {
                right: spritePowerUpShootRight,
                left: spritePowerUpShootLeft
            }
        }
    },
    levels: {
        1: {
            background: ''
        }
        ,
        2: {
            background: backgroundLevel2,
            mountains: mountains,
            lgPlatform: lgPlatformLevel2,
            mdPlatform: mdPlatformLevel2
        }
    }
}
