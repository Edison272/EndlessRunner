class Load extends Phaser.Scene {
    constructor() {
        super("loadScene")
    }

    preload() {
        //load audio

        //player
        this.load.audio('sfx-deflect', './assets/sfx-deflect.mp3')
        this.load.audio('sfx-swish', './assets/sfx-swish.mp3')
        this.load.audio('sfx-thud', './assets/sfx-thud.mp3')
        this.load.audio('sfx-shwing', './assets/sfx-shwing.mp3')
        this.load.audio('sfx-running', './assets/sfx-running.mp3')
        this.load.audio('sfx-woosh', './assets/sfx-woosh.mp3')
        this.load.audio('sfx-hurt', './assets/sfx-hurt.mp3')

        this.load.audio('sfx-boom', './assets/sfx-boom.mp3')
        this.load.audio('sfx-drone', './assets/sfx-drone.mp3')

        this.load.audio('sfx-bum', './assets/sfx-bum.mp3')

        this.load.audio('sfx-looping-beat', './assets/sfx-looping-beat.mp3')

        // load images/tile sprites
        this.load.image('building', './assets/Building.png')

        this.load.image('bullet', './assets/Bullet.png')

        this.load.image('nearbg', './assets/Backgrounds/NearBG.png')
        this.load.image('farbg', './assets/Backgrounds/FarBG.png')
        this.load.image('veryfarbg', './assets/Backgrounds/VeryFarBG.png')

        //animations
        this.load.spritesheet('superslash', './assets/SuperSlash.png', {
            frameWidth: 135,
            frameHeight: 90,
            startFrame: 0,
            endFrame: 14
        })
        this.load.spritesheet('slash', './assets/Slash.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('swordsman', './assets/Swordsman.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 10
        })
        this.load.spritesheet('swordbar', './assets/SwordBar.png', {
            frameWidth: 128,
            frameHeight: 13,
            startFrame: 0,
            endFrame: 6
        })
        this.load.spritesheet('flighticon', './assets/FlightIcon.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 1
        })
        this.load.spritesheet('drone', './assets/Drone.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 13
        })
    }

    create() {
        //forum https://phaser.discourse.group/t/audiocontext-was-not-allowed-to-start/795
        if (game.sound.context.state === 'suspended') {
            game.sound.context.resume();
        }

        //drone animations
        this.anims.create({
            key: 'hovering',
            frameRate: 40,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('drone', {
                start:0,
                end:13
            })
        })
    
        this.anims.create({
            key: 'chargesword',
            frameRate: 20,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('swordbar', {
                start:0,
                end:6
            })
        })

        //swordsman animations
        this.anims.create({
            key: 'running',
            frameRate: 20,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('swordsman', {
                start:0,
                end:4
            })
        })
        this.anims.create({
            key: 'jumping',
            frameRate: 5,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('swordsman', {
                frames: [9, 8]
            })
        })
        this.anims.create({
            key: 'dropping',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('swordsman', {
                frames: [9, 5]
            })
        })
        this.anims.create({
            key: 'slashing',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('swordsman', {
                start:5,
                end:7
            })
        })
        this.anims.create({
            key: 'death',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('swordsman', {
                start:9,
                end:10
            })
        })

        //sword slash
        this.anims.create({
            key: 'swordslash',
            frameRate: 40,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('slash', {
                frames: [0, 0, 0, 1, 1, 1, 2, 2, 2, 6, 6, 5, 3, 3, 3, 4, 4, 4]
            })
        })
        this.anims.create({
            key: 'superswordslash',
            frameRate: 40,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('superslash', {
                start: 0,
                end: 14
            })
        })

        document.getElementById('info').innerHTML = `<strong>DEFLECTION RUN CONTROLS:</strong>\<br>
         - Jump              | Up Arrow \<br>
         - Dash Down         | Down Arrow\<br>
         - Sword Swing       | Right Arrow\<br>
         - Super Slash       | Left Arrow\<br>
         =================================\<br>
         Run on Walls by jumping while along side them! \<br>
         Double Jump by deflecting Bullets!\<br>
         Charge your Sword to perform a Super Slash!\<br>
         `
        this.scene.start('menuScene') 
    }
}