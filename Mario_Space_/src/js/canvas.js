import gsap from 'gsap'
import {
    createImage,
    createImageAsync,
    isOnTopOfPlatform,
    collisionTop,
    isOnTopOfPlatformCircle,
    hitBottomOfPlatform,
    hitSideOfPlatform,
    objectsTouch
} from './utils.js'

import platform from '../img/platform.png'
import hills from '../img/hills2.png'
import spaceshipbg from '../img/spaceship_side.png'
import portal from '../img/portal.png'
import background from '../img/background3.png'
import spaceinvbg from '../img/spaceinv_bg.png'
import platformSmallTall from '../img/platformSmallTall.png'
import block from '../img/block2.png'
import blockTri from '../img/blockTri2.png'
import upside from '../img/upside.png'
import lgPlatform from '../img/lgPlatform.png'
import tPlatform from '../img/tPlatform.png'
import xtPlatform from '../img/xtPlatform.png'
import ladderPoleSprite from '../img/ladder2.png'
import antenna from '../img/antenna.png'

import spaceship from '../img/spaceship.png'
import invader from '../img/invader.png'

import spriteRunLeft from '../img/spriteMarioRunLeft.png'
import spriteRunRight from '../img/spriteMarioRunRight.png'
import spriteStandLeft from '../img/spriteMarioStandLeft.png'
import spriteStandRight from '../img/spriteMarioStandRight.png'
import spriteJumpRight from '../img/spriteJumpRight.png'
import spriteJumpLeft from '../img/spriteJumpLeft.png'

import spritePowerUpRunRight from '../img/spriteFireFlowerRunRight.png'
import spritePowerUpRunLeft from '../img/spriteFireFlowerRunLeft.png'
import spritePowerUpStandRight from '../img/spriteFireFlowerStandRight.png'
import spritePowerUpStandLeft from '../img/spriteFireFlowerStandLeft.png'
import spritePowerUpJumpRight from '../img/spriteFireFlowerJumpRight.png'
import spritePowerUpJumpLeft from '../img/spriteFireFlowerJumpLeft.png'

import spritePowerUp from '../img/powerup2.png'

import alien from '../img/spriteGoomba.png'

import {images} from './images'
import {audio} from './audio'

const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const c = canvas.getContext('2d')
const winnerTable = document.querySelector('#winnerTable')

localStorage.setItem('isGameOngoing', false)

canvas.width = 1366
canvas.height = 768

let gravity = 1.2

game = {
    disableUserInput: false
}

class Player {
    constructor() {
        this.speed = 9;
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.scale = 0.3;
        this.width = 398 * this.scale;
        this.height = 353 * this.scale;

        this.frames = 0;
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                powerUp: {
                    right: createImage(spritePowerUpStandRight),
                    left: createImage(spritePowerUpStandLeft)
                }
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                powerUp: {
                    right: createImage(spritePowerUpRunRight),
                    left: createImage(spritePowerUpRunLeft)
                }
            },
            jump: {
                right: createImage(spriteJumpRight),
                left: createImage(spriteJumpLeft),
                powerUp: {
                    right: createImage(spritePowerUpJumpRight),
                    left: createImage(spritePowerUpJumpLeft)
                }
            },
            shoot: {
                powerUp: {
                    right: createImage(images.hero.shoot.powerUp.right),
                    left: createImage(images.hero.shoot.powerUp.left)
                }
            }
        };

        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = 398;

        this.powerUps = {
            powerUp: false
        };
        this.invincible = false;
        this.opacity = 1;
    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = 'rgba(255,255,255,0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            353,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        c.restore();
    }

    update() {
        this.frames++;
        const {currentSprite, sprites} = this;

        if (
            this.frames > 58 &&
            (currentSprite === sprites.stand.right ||
                currentSprite === sprites.stand.left ||
                currentSprite === sprites.stand.powerUp.left ||
                currentSprite === sprites.stand.powerUp.right)
        )
            this.frames = 0;
        else if (
            this.frames > 28 &&
            (currentSprite === sprites.run.right ||
                currentSprite === sprites.run.left ||
                currentSprite === sprites.run.powerUp.right ||
                currentSprite === sprites.run.powerUp.left)
        )
            this.frames = 0;
        else if (
            currentSprite === sprites.jump.right ||
            currentSprite === sprites.jump.left ||
            currentSprite === sprites.jump.powerUp.right ||
            currentSprite === sprites.jump.powerUp.left ||
            currentSprite === sprites.shoot.powerUp.left ||
            currentSprite === sprites.shoot.powerUp.right
        )
            this.frames = 0;

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        }

        if (this.invincible) {
            if (this.opacity === 1) {
                this.opacity = 0;
            } else {
                this.opacity = 1;
            }
        } else {
            this.opacity = 1;
        }
    }
}

class Platform {
    constructor({x, y, image, block, text}) {
        this.position = {
            x,
            y
        }

        this.velocity = {
            x: 0
        }

        this.image = image
        this.width = image.width
        this.height = image.height
        this.block = block
        this.text = text
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)

        if (this.text) {
            c.font = '20px Fantasy'
            c.fillStyle = 'orange'
            c.fillText(this.text, this.position.x, this.position.y)
        }
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

//genericObject
class Platform2 {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }

        this.velocity = {
            x: 0
        }

        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
    }
}

class Alien {
    constructor({
                    position,
                    velocity,
                    distance = {
                        limit: 50,
                        traveled: 0
                    }
                }) {
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }
        this.width = 50
        this.height = 50

        this.image = createImage(alien)
        this.frames = 0

        this.distance = distance
    }

    draw() {

        c.drawImage(
            this.image,
            130 * this.frames,
            0,
            130,
            150,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.frames++
        if (this.frames >= 28) this.frames = 0

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity

        this.distance.traveled += Math.abs(this.velocity.x)

        if (this.distance.traveled > this.distance.limit) {
            this.distance.traveled = 0
            this.velocity.x = -this.velocity.x
        }
    }
}

class PowerUp {
    constructor({position, velocity}) {
        this.position = {
            x: position.x,
            y: position.y
        }

        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }

        this.width = 56
        this.height = 60

        this.image = createImage(spritePowerUp)
        this.frames = 2
    }

    draw() {

        c.drawImage(
            this.image,
            56 * this.frames,
            0,
            60,
            60,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.frames++
        if (this.frames >= 1) this.frames = 0

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Particle {
    constructor({
                    position,
                    velocity,
                    radius,
                    color = '#654428',
                    fireball = false,
                    fades = false
                }) {
        this.position = {
            x: position.x,
            y: position.y
        }

        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }

        this.radius = radius
        this.ttl = 300
        this.color = color
        this.fireball = fireball
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.ttl--
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.radius + this.velocity.y <= canvas.height)
            this.velocity.y += gravity * 0.4

        if (this.fades && this.opacity > 0) {
            this.opacity -= 0.01
        }

        if (this.opacity < 0) this.opacity = 0
    }
}

class Ship {
    constructor() {

        this.scale = 0.1
        this.width = 300 * this.scale
        this.height = 300 * this.scale

        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: canvas.height - this.height - 20
        }

        this.velocity = {
            x: 0
        }

        this.image = createImage(spaceship)
        this.rotation = 0
        this.opacity = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        c.rotate(this.rotation)
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }

    update() {
        if (keys2.left.pressed && this.position.x >= 0) {
            this.velocity.x = -5
            this.rotation = -0.15
        } else if (keys2.right.pressed && this.position.x + this.width <= canvas.width) {
            this.velocity.x = 5
            this.rotation = 0.15
        } else {
            this.velocity.x = 0
            this.rotation = 0
        }

        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({position, velocity}) {

        this.position = position
        this.velocity = velocity

        this.radius = 4
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class ShipParticle {
    constructor({position, velocity, radius, color, fades}) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades) this.opacity -= 0.01
    }
}

class InvaderProjectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity

        this.width = 4
        this.height = 16
    }

    draw() {
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor({position}) {

        this.position = {
            x: position.x,
            y: position.y
        }

        this.velocity = {
            x: 0
        }

        this.image = createImage(invader)
        this.scale = 0.1
        this.width = 300 * this.scale
        this.height = 300 * this.scale
        this.rotation = 0
        this.opacity = 1
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class InvaderGrid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 30

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({position: {x: x * 30, y: y * 30}}))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

let platformImage
let platformSmallTallImage
let upsideImage
let blockTriImage
let lgPlatformImage
let tPlatformImage
let xtPlatformImage
let blockImage
let spaceshipbgImage
let spaceinvbgImage
let portalImage
let mountains

let platforms = []
let platforms2 = []
let aliens = []
let particles = []
let powerUps = []

let lastKey
let keys

let player
let game
let score = 0
let scrollOffset
let ladderPole
let ladderPoleImage
let antennaImage
let currentLevel = 1

function selectLevel(currentLevel) {
    wonLevel = false
    if (!audio.musicLevels.playing()) audio.musicLevels.play()
    switch (currentLevel) {
        case 1:
            initLevel1()
            break
        case 2:
            initLevel2()
            break
        case 3:
            initLevel3()
            break
    }
}

function createTable(playersArray) {
    while (winnerTable.firstChild) {
        winnerTable.removeChild(winnerTable.firstChild);
    }
    let table = document.createElement('TABLE');
    table.border = '1';

    let tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    playersArray.forEach(player => {
        let tr = document.createElement('TR');
        tableBody.appendChild(tr);

        let name = document.createElement('TD');
        name.width = '75';
        name.appendChild(document.createTextNode(player.player));
        let score = document.createElement('TD');
        score.width = '75';
        score.appendChild(document.createTextNode(player.score));
        tr.appendChild(name);
        tr.appendChild(score);
    })

    for (let i = playersArray.length; i < 7; i++) {
        let tr = document.createElement('TR');
        tableBody.appendChild(tr);

        let name = document.createElement('TD');
        name.width = '75';
        name.appendChild(document.createTextNode('player' + (i + 1)));
        let score = document.createElement('TD');
        score.width = '75';
        score.appendChild(document.createTextNode('-'));
        tr.appendChild(name);
        tr.appendChild(score);
    }

    winnerTable.appendChild(table);
}

async function initLevel1() {
    player = new Player()
    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }
    scrollOffset = 0

    game = {
        disableUserInput: false
    }

    platformImage = await createImageAsync(platform)
    platformSmallTallImage = await createImageAsync(platformSmallTall)
    blockTriImage = await createImageAsync(blockTri)
    blockImage = await createImageAsync(block)
    lgPlatformImage = await createImageAsync(lgPlatform)
    tPlatformImage = await createImageAsync(tPlatform)
    xtPlatformImage = await createImageAsync(xtPlatform)
    ladderPoleImage = await createImageAsync(ladderPoleSprite)
    antennaImage = await createImageAsync(antenna)
    portalImage = await createImageAsync(portal)
    upsideImage = await createImageAsync(upside)

    const rankingList = localStorage.getItem('ranklist')
    if (!rankingList) {
        winnerTable.innerHTML = 'You are hopefully!'
    } else {
        createTable(JSON.parse(rankingList))
    }

    ladderPole = new Platform2({
        x: 13315,
        y: canvas.height - lgPlatformImage.height - ladderPoleImage.height,
        image: ladderPoleImage
    })

    powerUps = [
        new PowerUp({
            position: {
                x: 700,
                y: 20
            },
            velocity: {
                x: 0,
                y: 0
            }
        })
    ]

    player = new Player()

    const alienWidth = 50
    aliens = [
        new Alien({
            position: {
                x: 700 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 300,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 800 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 300,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 900 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 300,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 350 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 100,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 1800 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 1900 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 2900 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 5800 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 5900 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 6300 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 6350 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 6450 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 6500 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 6600 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 6650 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 6750 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 6800 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 9200 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 10200 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -0.3,
                y: 0
            },
            distance: {
                limit: 400,
                traveled: 0
            }
        })
    ]

    particles = []
    platforms = [
        new Platform({
            x: 0,
            y: -300,
            image: upsideImage,
            block: true
        }),

        new Platform({
            x: 550,
            y: 500,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 704,
            y: 500,
            image: blockImage,
            block: true
        }),

        new Platform({
            x: 750,
            y: 500,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 1100,
            y: 450,
            image: blockImage,
            block: true
        }),

        new Platform({
            x: 1100,
            y: 500,
            image: blockImage,
            block: true
        }),

        new Platform({
            x: 1100,
            y: 550,
            image: blockImage,
            block: true
        }),

        new Platform({
            x: 250,
            y: 300,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 650,
            y: 100,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 1100,
            y: 350,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 8400,
            y: 400,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 8700,
            y: 200,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 9000,
            y: 500,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 6600,
            y: 400,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 6750,
            y: 200,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 7100,
            y: 200,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 7400,
            y: 300,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 11650,
            y: 400,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 12000,
            y: 300,
            image: blockTriImage,
            block: true
        }),

        new Platform({
            x: 12350,
            y: 400,
            image: blockTriImage,
            block: true
        })
    ]

    platforms2 = [
        new Platform2({
            x: -1,
            y: -1,
            image: createImage(background)
        }),

        new Platform2({
            x: -1,
            y: 200,
            image: createImage(hills)
        })
    ]

    scrollOffset = 0

    const platformsMap = [
        'low',
        'low',
        'space',
        'low',
        'high',
        'space',
        'space',
        'low',
        'space',
        'mid',
        'space',
        'high',
        'space',
        'high',
        'space',
        'space',
        'high',
        'space',
        'low',
        'low',
        'mid',
        'high',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'low',
        'high',
        'low',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'mid',
        'high',
        'low',
        'low',
        'portal'
    ]

    let platformDistance = 0

    platformsMap.forEach((symbol) => {
        switch (symbol) {
            case 'low':
                platforms.push(
                    new Platform({
                        x: platformDistance,
                        y: canvas.height - lgPlatformImage.height,
                        image: lgPlatformImage,
                        block: true
                    })
                )

                platformDistance += lgPlatformImage.width - 2
                break

            case 'space':
                platformDistance += 125
                break

            case 'mid':
                platforms.push(
                    new Platform({
                        x: platformDistance,
                        y: canvas.height - tPlatformImage.height,
                        image: tPlatformImage,
                        block: true
                    })
                )

                platformDistance += tPlatformImage.width
                break

            case 'high':
                platforms.push(
                    new Platform({
                        x: platformDistance,
                        y: canvas.height - xtPlatformImage.height,
                        image: xtPlatformImage,
                        block: true
                    })
                )

                platformDistance += xtPlatformImage.width
                break

            case 'portal':
                platforms.push(
                    new Platform({
                        x: 14000,
                        y: 350,
                        image: portalImage,
                        block: false
                    })
                )
                break
        }
    })
}

//###########################LEVEL2##########################################

async function initLevel2() {
    player = new Player()
    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }
    scrollOffset = 0

    game = {
        disableUserInput: false
    }

    blockTriImage = await createImageAsync(blockTri)
    blockImage = await createImageAsync(block)
    lgPlatformImage = await createImageAsync(images.levels[2].lgPlatform)
    tPlatformImage = await createImageAsync(tPlatform)
    xtPlatformImage = await createImageAsync(xtPlatform)
    ladderPoleImage = await createImageAsync(ladderPoleSprite)
    antennaImage = await createImageAsync(antenna)
    spaceshipbgImage = await createImageAsync(spaceshipbg)
    portalImage = await createImageAsync(portal)
    mountains = await createImageAsync(images.levels[2].mountains)
    let mdPlatformImage = await createImageAsync(images.levels[2].mdPlatform)

    ladderPole = new Platform2({
        x: 7650,
        y: canvas.height - lgPlatformImage.height - antennaImage.height + 15,
        image: antennaImage
    })

    powerUps = [
        new PowerUp({
            position: {
                x: 720,
                y: 200
            },
            velocity: {
                x: 0,
                y: 0
            }
        })
    ]

    player = new Player()

    const alienWidth = 43.33
    aliens = [
        new Alien({
            position: {
                x: 903 + mdPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -2,
                y: 0
            },
            distance: {
                limit: 700,
                traveled: 0
            }
        }),
        new Alien({
            position: {
                x:
                    1878 +
                    lgPlatformImage.width +
                    155 +
                    200 +
                    200 +
                    200 +
                    blockImage.width / 2 -
                    alienWidth / 2,
                y: 100
            },
            velocity: {
                x: 0,
                y: 0
            },
            distance: {
                limit: 0,
                traveled: 0
            }
        }),
        new Alien({
            position: {
                x: 3831 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -1,
                y: 0
            },
            distance: {
                limit: lgPlatformImage.width - alienWidth,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 4131 + lgPlatformImage.width - alienWidth,
                y: 100
            },
            velocity: {
                x: -1,
                y: 0
            },
            distance: {
                limit: lgPlatformImage.width - alienWidth,
                traveled: 0
            }
        }),

        new Alien({
            position: {
                x: 4734,
                y: 100
            },
            velocity: {
                x: 1,
                y: 0
            },
            distance: {
                limit: lgPlatformImage.width - alienWidth,
                traveled: 0
            }
        })
    ]
    particles = []
    platforms = [
        new Platform({
            x: 103 + mdPlatformImage.width + 115,
            y: 300,
            image: blockTriImage,
            block: true
        }),
        new Platform({
            x: 903 + mdPlatformImage.width + 115,
            y: 300,
            image: blockTriImage,
            block: true
        }),
        new Platform({
            x: 903 + mdPlatformImage.width + 115 + blockTriImage.width,
            y: 300,
            image: blockTriImage,
            block: true
        }),
        new Platform({
            x: 1878 + lgPlatformImage.width + 175,
            y: 360,
            image: blockImage,
            block: true
        }),
        new Platform({
            x: 1878 + lgPlatformImage.width + 155 + 200,
            y: 300,
            image: blockImage,
            block: true
        }),
        new Platform({
            x: 1878 + lgPlatformImage.width + 155 + 200 + 200,
            y: 330,
            image: blockImage,
            block: true
        }),
        new Platform({
            x: 1878 + lgPlatformImage.width + 155 + 200 + 200 + 200,
            y: 240,
            image: blockImage,
            block: true
        }),
        new Platform({
            x: 4734 - mdPlatformImage.width / 2,
            y: canvas.height - lgPlatformImage.height - mdPlatformImage.height,
            image: mdPlatformImage
        }),
        new Platform({
            x: 5987,
            y: canvas.height - lgPlatformImage.height - mdPlatformImage.height,
            image: mdPlatformImage
        }),
        new Platform({
            x: 5987,
            y: canvas.height - lgPlatformImage.height - mdPlatformImage.height * 2,
            image: mdPlatformImage
        }),
        new Platform({
            x: 6787,
            y: canvas.height - lgPlatformImage.height - mdPlatformImage.height,
            image: mdPlatformImage
        }),
        new Platform({
            x: 6787,
            y: canvas.height - lgPlatformImage.height - mdPlatformImage.height * 2,
            image: mdPlatformImage
        }),
        new Platform({
            x: 6787,
            y: canvas.height - lgPlatformImage.height - mdPlatformImage.height * 3,
            image: mdPlatformImage
        })
    ]
    platforms2 = [
        new Platform2({
            x: -1,
            y: -1,
            image: createImage(images.levels[2].background)
        }),
        new Platform2({
            x: -1,
            y: canvas.height - mountains.height,
            image: mountains
        })
    ]

    scrollOffset = 0

    const platformsMap = [
        'portal',
        'low',
        'mid',
        'space',
        'space',
        'space',
        'low',
        'space',
        'space',
        'space',
        'space',
        'space',
        'space',
        'low',
        'low',
        'space',
        'space',
        'mid',
        'space',
        'space',
        'mid',
        'space',
        'space',
        'low',
        'low',
        'spaceshipbg'
    ]

    let platformDistance = 0

    platformsMap.forEach((symbol) => {
        switch (symbol) {
            case 'mid':
                platforms.push(
                    new Platform({
                        x: platformDistance,
                        y: canvas.height - mdPlatformImage.height,
                        image: mdPlatformImage,
                        block: true
                    })
                )

                platformDistance += mdPlatformImage.width - 3

                break

            case 'low':
                platforms.push(
                    new Platform({
                        x: platformDistance - 2,
                        y: canvas.height - lgPlatformImage.height,
                        image: lgPlatformImage,
                        block: true
                    })
                )

                platformDistance += lgPlatformImage.width - 3

                break

            case 'space':
                platformDistance += 175

                break

            case 'spaceshipbg':
                platforms.push(
                    new Platform({
                        x: 8760,
                        y: 450,
                        image: spaceshipbgImage,
                        block: false
                    })
                )
                break

            case 'portal':
                platforms.push(
                    new Platform({
                        x: -50,
                        y: -50,
                        image: portalImage,
                        block: false
                    })
                )
                break
        }
    })
}

//###########################LEVEL3##########################################

let ship
let projectiles = []
let grids = []
let invaderProjectiles = []
let shipParticles = []

let keys2 = {
    left: {
        pressed: false
    },
    right: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let ticksSinceLastInvaderSpawn = 0
let randomInterval = Math.floor(Math.random() * 500 + 1500)
let game2 = {
    over: false,
    active: true
}

async function initLevel3() {

    ship = new Ship()

    scrollOffset = 0

    game = {
        disableUserInput: false
    }

    spaceinvbgImage = await createImageAsync(spaceinvbg)

    platforms2 = [
        new Platform2({
            x: 0,
            y: 0,
            image: spaceinvbgImage
        })
    ]


    for (let i = 0; i < 100; i++) {
        shipParticles.push(new ShipParticle({
                position: {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height
                },
                velocity: {
                    x: 0,
                    y: 0.3
                },
                radius: Math.random() * 3,
                color: 'white'
            })
        )
    }
}

let timer = 0
let timeLimit = 6000

function saveMyPlayer(score, name = '', playerIndex, list) {
    let newList = []
    for (let i = 0; i < 7; i++) {
        let player = list[i]
        let idx = i;
        if (idx < playerIndex) {
            newList.push(player ?? {player: `player${i + 1}`})
        } else if (idx === playerIndex) {
            newList.push({player: name ?? `player${idx + 1}`, score: score})
        } else {
            newList.push(list[idx - 1] ?? {player: `player${i + 1}`})
        }
    }
    localStorage.setItem('ranklist', JSON.stringify(newList))
}

function handleGameWon() {
    let rankingList = JSON.parse(localStorage.getItem('ranklist'))
    let foundPlayerPlace = false
    let playerName = localStorage.getItem('playerName') || 'Marci';

    if (rankingList) {
        for (let i = 0; i < 7; i++) {
            player = rankingList[i]
            if ((player?.score < scoreEl.innerHTML || !player) && !foundPlayerPlace) {
                foundPlayerPlace = true
                saveMyPlayer(scoreEl.innerHTML, playerName, i, rankingList)
            }
        }
    } else {
        localStorage.setItem('ranklist', JSON.stringify([{
            player: playerName,
            score: scoreEl.innerHTML
        }]))
    }
}

function level3AnimationHooks() {
    ship?.update()

    if (timer >= timeLimit) {
        audio.completeLevel.play()
        audio.musicLevels.stop()
        window.alert("You won!")
        handleGameWon()
        game2.active = false
        location.reload()
        return
    }

    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else invaderProjectile.update()

        //projectile hit ship
        if (invaderProjectile.position.y + invaderProjectile.height >=
            ship.position.y && invaderProjectile.position.x +
            invaderProjectile.width >= ship.position.x &&
            invaderProjectile.position.x <= ship.position.x +
            ship.width
        ) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                ship.opacity = 0
                game2.over = true
                audio.musicLevels.stop()
                audio.die.play()
            }, 0)
            setTimeout(() => {
                window.alert("You lost!")
                game2.active = false
                location.reload()
            }, 2000)
            createParticles({
                object: ship,
                color: 'white',
                fades: true
            })
        }
    })
    projectiles.forEach((projectile, index) => {

        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        //spawn projectiles
        if (ticksSinceLastInvaderSpawn % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
                invaderProjectiles
            )
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})

            //projectiles hit invaders
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                ) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        )
                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        )

                        //remove invader and projectile
                        if (invaderFound && projectileFound) {
                            score += 25
                            scoreEl.innerHTML = score
                            createParticles({
                                object: invader,
                                fades: true
                            })

                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width =
                                    lastInvader.position.x -
                                    firstInvader.position.x +
                                    lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })

    //spawn invaders
    if (ticksSinceLastInvaderSpawn % randomInterval === 0) {
        grids.push(new InvaderGrid())
        randomInterval = Math.floor(Math.random() * 500 + 1500)
        ticksSinceLastInvaderSpawn = 0
    }
    ticksSinceLastInvaderSpawn++
    timer += 1;
    shipParticles.forEach(shipParticle => {

        if (shipParticle.position.y - shipParticle.radius >= canvas.height) {
            shipParticle.position.x = Math.random() * canvas.width
            shipParticle.position.y = -shipParticle.radius
        }

        if (shipParticle.opacity <= 0) {
            setTimeout((i) => {
                shipParticles.slice(i, 1)
            }, 0)
        } else {
            shipParticle.update()
        }
    })
}

let wonLevel = false

function ladderPoleAction() {
    if (ladderPole) {
        ladderPole.update()
        ladderPole.velocity.x = 0

        // touches ladderpole | win condition | complete level
        if (
            !wonLevel &&
            objectsTouch({
                object1: player,
                object2: ladderPole
            })
        ) {
            audio.completeLevel.play()
            audio.musicLevels.stop()
            game.disableUserInput = true
            player.velocity.x = 0
            player.velocity.y = 0
            wonLevel = true
            gravity = 0

            player.currentSprite = player.sprites.stand.right

            if (player.powerUps.powerUp)
                player.currentSprite = player.sprites.stand.powerUp.right

            // ladder slide
            setTimeout(() => {
                audio.descend.play()
            }, 200)
            gsap.to(player.position, {
                y: canvas.height - lgPlatformImage.height - player.height,
                duration: 1,
                onComplete() {
                    player.currentSprite = player.sprites.run.right

                    if (player.powerUps.powerUp)
                        player.currentSprite = player.sprites.run.powerUp.right
                }
            })

            gsap.to(player.position, {
                delay: 1,
                x: canvas.width,
                duration: 2,
                ease: 'power1.in'
            })

            // switch to the next level
            setTimeout(() => {
                currentLevel++
                gravity = 0.8
                selectLevel(currentLevel)
            }, 6000)
        }
    }
}

function drawPlatforms() {
    platforms2.forEach((platforms2) => {
        platforms2.update()
        platforms2.velocity.x = 0
    })

    platforms.forEach((platform) => {
        platform.update()
        platform.velocity.x = 0
    })
}

function drawShooting() {
    particles.forEach((particle, i) => {
        particle.update()

        if (
            particle.fireball &&
            (particle.position.x - particle.radius >= canvas.width ||
                particle.position.x + particle.radius <= 0)
        )
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
    })
}

function powerUp() {
    // obtains power up
    powerUps.forEach((powerUp, i) => {
        if (
            objectsTouch({
                object1: player,
                object2: powerUp
            })
        ) {
            audio.obtainPowerUp.play()
            player.powerUps.powerUp = true
            setTimeout(() => {
                powerUps.splice(i, 1)
            }, 0)
        } else powerUp.update()
    })
}

function alienStomp() {
    aliens.forEach((alien, index) => {
        alien.update()

        //remove alien on fireball hit
        particles.forEach((particle, particleIndex) => {
            if (
                particle.fireball &&
                particle.position.x + particle.radius >= alien.position.x &&
                particle.position.y + particle.radius >= alien.position.y &&
                particle.position.x - particle.radius <=
                alien.position.x + alien.width &&
                particle.position.y - particle.radius <=
                alien.position.y + alien.height
            ) {
                for (let i = 0; i < 50; i++) {
                    particles.push(
                        new Particle({
                            position: {
                                x: alien.position.x + alien.width / 2,
                                y: alien.position.y + alien.height / 2
                            },
                            velocity: {
                                x: (Math.random() - 0.5) * 7,
                                y: (Math.random() - 0.5) * 15
                            },
                            radius: Math.random() * 3
                        })
                    )
                }
                setTimeout(() => {
                    aliens.splice(index, 1)
                    particles.splice(particleIndex, 1)
                    score += 200
                    scoreEl.innerHTML = score
                }, 0)
            }
        })

        // alien stomp
        if (
            collisionTop({
                object1: player,
                object2: alien
            })
        ) {
            audio.goombaSquash.play()

            for (let i = 0; i < 50; i++) {
                particles.push(
                    new Particle({
                        position: {
                            x: alien.position.x + alien.width / 2,
                            y: alien.position.y + alien.height / 2
                        },
                        velocity: {
                            x: (Math.random() - 0.5) * 7,
                            y: (Math.random() - 0.5) * 15
                        },
                        radius: Math.random() * 3
                    })
                )
            }
            player.velocity.y -= 40
            setTimeout(() => {
                aliens.splice(index, 1)
                score += 100
                scoreEl.innerHTML = score
            }, 0)
        } else if (
            player.position.x + player.width >= alien.position.x &&
            player.position.y + player.height >= alien.position.y &&
            player.position.x <= alien.position.x + alien.width
        ) {
            // player hits alien
            // lose powerup / lose powerup
            if (player.powerUps.powerUp) {
                player.invincible = true
                player.powerUps.powerUp = false
                audio.losePowerUp.play()

                setTimeout(() => {
                    player.invincible = false
                }, 1000)
            } else if (!player.invincible) {
                audio.die.play()
                score = 0
                scoreEl.innerHTML = score
                selectLevel(currentLevel)
            }
        }
    })
}

function createParticles({object, color, fades}) {
    for (let i = 0; i < 15; i++) {
        shipParticles.push(new ShipParticle({
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 3,
                    y: (Math.random() - 0.5) * 3
                },
                radius: Math.random() * 3,
                color: color || '#71797E',
                fades
            })
        )
    }
}

function animate() {
    if (!game2.active) return
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    if (currentLevel === 1 || currentLevel === 2) {
        drawPlatforms()
        ladderPoleAction()
        hitSideWall()
        player.update()
        drawShooting()
        spriteMoves()
        particleBounces()
        alienStomp()
        powerUp()
    }

    if (currentLevel === 3) {
        level3AnimationHooks()
    }

    if (player?.position.y > canvas.height) {
        audio.die.play()
        score = 0
        scoreEl.innerHTML = score
        selectLevel(currentLevel)
    }

    requestAnimationFrame(animate)
}

function resetGame() {
    audio.die.play()
    score = 0
    scoreEl.innerHTML = score
    if (currentLevel >= 2) {
        currentLevel = 1
        selectLevel(1)
    } else {
        selectLevel(1)
    }
}

function hitSideWall() {
    // scrolling code starts
    let hitSide = false
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (
        (keys.left.pressed && player.position.x > 100) ||
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
    ) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        // scrolling code
        if (keys.right.pressed) {
            for (let i = 0; i < platforms.length; i++) {
                const platform = platforms[i]
                platform.velocity.x = -player.speed

                if (
                    platform.block &&
                    hitSideOfPlatform({
                        object: player,
                        platform
                    })
                ) {
                    platforms.forEach((platform) => {
                        platform.velocity.x = 0
                    })

                    hitSide = true
                    break
                }
            }

            if (!hitSide) {
                scrollOffset += player.speed

                ladderPole.velocity.x = -player.speed

                platforms2.forEach((platforms2) => {
                    platforms2.velocity.x = -player.speed * 0.66
                })

                aliens.forEach((alien) => {
                    alien.position.x -= player.speed
                })

                powerUps.forEach((powerUp) => {
                    powerUp.position.x -= player.speed
                })

                particles.forEach((particle) => {
                    particle.position.x -= player.speed
                })
            }
        } else if (keys.left.pressed && scrollOffset > 0) {
            for (let i = 0; i < platforms.length; i++) {
                const platform = platforms[i]
                platform.velocity.x = player.speed

                if (
                    platform.block &&
                    hitSideOfPlatform({
                        object: player,
                        platform
                    })
                ) {
                    platforms.forEach((platform) => {
                        platform.velocity.x = 0
                    })

                    hitSide = true
                    break
                }
            }

            if (!hitSide) {
                scrollOffset -= player.speed

                ladderPole.velocity.x = player.speed

                platforms2.forEach((platforms2) => {
                    platforms2.velocity.x = player.speed * 0.66
                })

                aliens.forEach((alien) => {
                    alien.position.x += player.speed
                })

                powerUps.forEach((powerUp) => {
                    powerUp.position.x += player.speed
                })

                particles.forEach((particle) => {
                    particle.position.x += player.speed
                })
            }
        }
    }
}

function particleBounces() {
    platforms.forEach((platform) => {
        if (
            isOnTopOfPlatform({
                object: player,
                platform
            })
        ) {
            player.velocity.y = 0
        }

        if (
            platform.block &&
            hitBottomOfPlatform({
                object: player,
                platform
            })
        ) {
            player.velocity.y = -player.velocity.y
        }

        if (
            platform.block &&
            hitSideOfPlatform({
                object: player,
                platform
            })
        ) {
            player.velocity.x = 0
        }

        // particles bounce
        particles.forEach((particle, index) => {
            if (
                isOnTopOfPlatformCircle({
                    object: particle,
                    platform
                })
            ) {
                let bounce = 0.9
                particle.velocity.y = -particle.velocity.y * 0.99

                if (particle.radius - 0.4 < 0) particles.splice(index, 1)
                else particle.radius -= 0.4
            }

            if (particle.ttl < 0) particles.splice(index, 1)
        })

        aliens.forEach((alien) => {
            if (
                isOnTopOfPlatform({
                    object: alien,
                    platform
                })
            )
                alien.velocity.y = 0
        })

        powerUps.forEach((powerUp) => {
            if (
                isOnTopOfPlatform({
                    object: powerUp,
                    platform
                })
            )
                powerUp.velocity.y = 0
        })
    })
}

function spriteMoves() {
    // sprite switching
    if (player.shooting) {
        player.currentSprite = player.sprites.shoot.powerUp.right

        if (lastKey === 'left') {
            player.currentSprite = player.sprites.shoot.powerUp.left
        }
        return
    }

    if (
        keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.run.right
    ) {
        player.currentSprite = player.sprites.run.right
    } else if (
        keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.run.left
    ) {
        player.currentSprite = player.sprites.run.left
    } else if (
        !keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.stand.left
    ) {
        player.currentSprite = player.sprites.stand.left
    } else if (
        !keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.stand.right
    ) {
        player.currentSprite = player.sprites.stand.right
    }

    // powerup sprites
    if (!player.powerUps.powerUp) return

    if (
        keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.run.powerUp.right
    ) {
        player.currentSprite = player.sprites.run.powerUp.right
    } else if (
        keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.run.powerUp.left
    ) {
        player.currentSprite = player.sprites.run.powerUp.left
    } else if (
        !keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.stand.powerUp.left
    ) {
        player.currentSprite = player.sprites.stand.powerUp.left
    } else if (
        !keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.stand.powerUp.right
    ) {
        player.currentSprite = player.sprites.stand.powerUp.right
    }
}

selectLevel(1)
animate()

let upPressed = false

addEventListener('keydown', ({keyCode}) => {
    const isGameOngoing = localStorage.getItem('isGameOngoing')

    if (game.disableUserInput || isGameOngoing !== 'true') return

    if (currentLevel === 1 || currentLevel === 2) {
        switch (keyCode) {
            case 65:
                keys.left.pressed = true
                lastKey = 'left'

                break

            case 68:
                keys.right.pressed = true
                lastKey = 'right'

                break

            case 87:
                if (upPressed) return
                upPressed = true
                player.velocity.y -= 25

                audio.jump.play()

                if (lastKey === 'right') player.currentSprite = player.sprites.jump.right
                else player.currentSprite = player.sprites.jump.left

                if (!player.powerUps.powerUp) break

                if (lastKey === 'right')
                    player.currentSprite = player.sprites.jump.powerUp.right
                else player.currentSprite = player.sprites.jump.powerUp.left

                break

            case 32:

                if (!player.powerUps.powerUp) return

                player.shooting = true

                setTimeout(() => {
                    player.shooting = false
                }, 100)

                audio.powerUpShot.play()

                let velocity = 15
                if (lastKey === 'left') velocity = -velocity

                particles.push(
                    new Particle({
                        position: {
                            x: player.position.x + player.width / 2,
                            y: player.position.y + player.height / 2
                        },
                        velocity: {
                            x: velocity,
                            y: 0
                        },
                        radius: 5,
                        color: 'red',
                        fireball: true
                    })
                )
                break

            case 82:
                resetGame()

                break
        }
    }

    if (currentLevel === 3) {
        switch (keyCode) {

            case 65:
                keys2.left.pressed = true
                lastKey = 'left'

                break

            case 82:
                resetGame()

                break

            case 68:
                keys2.right.pressed = true
                lastKey = 'right'

                break

            case 32:
                ship.shooting = true

                setTimeout(() => {
                    ship.shooting = false
                }, 100)

                projectiles.push(new Projectile({
                    position: {
                        x: ship.position.x + ship.width / 2,
                        y: ship.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                }))
                audio.powerUpShot.play()
                break
        }
    }
})

addEventListener('keyup', ({keyCode}) => {
    const isGameOngoing = localStorage.getItem('isGameOngoing')

    if (game.disableUserInput || isGameOngoing !== 'true') return

    if (currentLevel === 1 || currentLevel === 2) {
        switch (keyCode) {
            case 65:
                keys.left.pressed = false
                break

            case 68:
                keys.right.pressed = false

                break

            case 87:
                upPressed = false
                break

            case 82:
                break
        }
    }

    if (currentLevel === 3) {
        switch (keyCode) {
            case 65:
                keys2.left.pressed = false
                break
            case 68:
                keys2.right.pressed = false
                break
            case 32:
                break
        }
    }
})