class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }
    preload() {
        //swordbar
    }
    create() {
        //game rules
        this.gameOver = false
        this.difficultyScale = 1
        this.endScreen = false
        this.difficultyCurb = 1

        //BACKGROUND
        this.BG2 = this.add.tileSprite(0, 0, 720, 720, 'veryfarbg').setOrigin(0, 0.5).setScale(1.5)
        this.BG1 = this.add.tileSprite(0, 0, 720, 720, 'farbg').setOrigin(0, 0.6).setScale(1.5)
        this.BG0 = this.add.tileSprite(0, 0, 720, 800, 'nearbg').setOrigin(0, 0.25).setScale(1.5)

        this.cameras.main.setBackgroundColor(0x807580)

        //buildings
        this.surfaces = this.add.group()
        for(let i = 0; i < 3; i ++) {
            let building = this.physics.add.sprite(game.config.width/2+50 + 500*i, 700, 'building').setScale(3).setOrigin(0, 0.25)
            building.body.setSize(96,160).setOffset(0, 10)
            building.body.setImmovable(true)
            this.surfaces.add(building)
        }



        //PLAYER
        this.player = new Swordsman(this, game.config.width/3, 0, 'swordsman').setOrigin(0.5, 0)
        this.cameras.main.setBounds(0,-game.config.height,game.config.width, game.config.height*2)
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5)

        //bullets
        this.bullets = this.add.group()

        //INTERFACES
        this.swordui = this.add.image(game.config.width/2, game.config.height/2, 'swordbar').setOrigin(0.5, 0.6).setScale(5)
        this.swordCounter = 6
        this.swordui.setFrame(6)

        this.jumpui = this.add.image(game.config.width/8, game.config.height/2, 'flighticon').setOrigin(0.5, 0.7).setScale(2.5)
        this.jumpui.setFrame(0)

        this.p1Score = 0
        //text stuff for interfaces
        let scoreConfig = {
            fontFamily: 'Arial',
            fontSize: '54px',
            backgroundColor: 'rgba(180, 180, 180, 0.5)',
            color: '#ccf5ff',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 200
          }
        this.scoreui = this.add.text(game.config.width/2 - scoreConfig.fixedWidth/2, 0, this.p1Score, scoreConfig)
        this.scoreTime = this.time.addEvent({
            delay: 1000, // ms
            callback: () => {
                this.p1Score += 1
                this.difficultyScale += 0.01
                this.scoreui.text = Math.floor(this.p1Score)
            },
            //args: [],
            callbackScope: null  ,
            loop: true,
          });

        //controls
        this.cursors = this.input.keyboard.createCursorKeys()
        this.is_slashing

        //touching surfaces
        this.physics.add.collider(this.player, this.surfaces, (player, surfaces) => {
            player.OnGround = true
        })

        //getting shot
        this.physics.add.collider(this.player, this.bullets, (player, bullets) => {
            this.sound.play('sfx-hurt')
            this.swordsmanFSM.transition('death')
            bullets.destroy()
        })

        //deflecting stuff
        this.physics.add.overlap(this.player.slash, this.bullets, (player, bullets) => {
            this.sound.play('sfx-deflect')
            if(this.swordCounter > 0) {
                this.swordCounter -= 1
                this.swordui.setFrame(this.swordCounter)
            }
            if(this.swordCounter == 0) {
                this.player.canSuperSlash = true
            }
            this.player.OnGround = true
            bullets.destroy()
        })

        //drones
        this.drone1 = new Drone(this, game.config.width/1.25, 0, 'drone').setOrigin(0.5, 0)
        
        this.drones = this.add.group([this.drone1])

        //drone spawn timer
        this.time.delayedCall(8000, () => {
        this.time.addEvent({
            delay: 5000/(this.difficultyScale*1.3), // ms
            callback: () => {
                var drone = new Drone(this, Phaser.Math.Between(game.config.width/1.9, game.config.width/1)
                , -game.config.height, 'drone').setOrigin(0.5, 0)
                this.drones.add(drone)
            },
            //args: [],
            callbackScope: null  ,
            loop: true,
          })})

        //music solution from https://stackoverflow.com/questions/34210393/looping-audio-in-phaser
        this.bgMusic = this.sound.add('sfx-looping-beat')
        this.bgMusic.loop = true; // This is what you are looking for
        this.bgMusic.play();

    }

    //swordsman special ability
    superslash() {
        this.p1Score += 10
        this.scoreui.text = Math.floor(this.p1Score)
        this.bullets.clear(true, true)
        this.drones.getChildren().forEach(drone => {
            drone.death()
        }, this)

        this.sound.play('sfx-shwing')
        this.swordCounter = 6
        this.player.OnGround = true
        this.swordui.setFrame(this.swordCounter)
        this.player.body.setVelocityY(-1000)
        
        this.difficultyCurb = this.difficultyCurb * 0.9
        this.difficultyScale += 0.5 * this.difficultyCurb

    }

    //drone attack
    shoot(x, y) {
        var bullet = this.physics.add.sprite(x, y, 'bullet').setScale(3)
        let bulletVector = new Phaser.Math.Vector2(this.player.body.x - x, this.player.body.y - y).normalize()
        bullet.body.setVelocity(bulletVector.x*400, bulletVector.y*400)
        this.bullets.add(bullet)
    }

    update() {
        //parallax-y effect
        this.BG2.tilePositionX += 1*(this.difficultyScale)
        this.BG1.tilePositionX += 1.375*(this.difficultyScale)
        this.BG0.tilePositionX += 1.75*(this.difficultyScale)

        //adjust ui
        this.swordui.y = this.cameras.main.scrollY + game.config.height*0.95
        this.jumpui.y = this.cameras.main.scrollY + game.config.height*0.95
        this.scoreui.y = this.cameras.main.scrollY + game.config.height*0.05
        if(this.player.OnGround) {
            this.jumpui.setFrame(1)
        } else {
            this.jumpui.setFrame(0)
        }

        //buildings
        this.surfaces.getChildren().forEach(surface => {
            surface.body.x -= 5*(this.difficultyScale)
            if(surface.body.x <= -288) {
                surface.body.x = game.config.width+200
                surface.body.y = Phaser.Math.Between(400, 600)-100*(this.difficultyScale-1)
            }
        }, this)

        //control swordsman FSM
        if(this.player.currentAnim != 'death') {
            this.swordsmanFSM.step()
        }

        //drones!
        this.drones.getChildren().forEach(drone => {
            drone.intoPosition()
            if(drone.body.y > 1080) {
                this.sound.play('sfx-boom')
                drone.destroy()
            }
        }, this)

        //end of game
        if(this.player.body.y > 1080 && !this.gameOver) {
            this.gameOver = true
            this.sound.play('sfx-thud')
            this.cameras.main.shake(300, 0.02)
            this.scoreTime.destroy()
            this.bgMusic.stop()
            this.swordsmanFSM.transition('death')
        }
        if(this.gameOver) {
            //slowdown cam and parallax
            if(this.difficultyScale > 0) {
                this.difficultyScale -= 0.01
            } else if(this.difficultyScale < 0) {
                this.difficultyScale = 0
            }

            //go back to menu or whatnot
            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                this.sound.play('sfx-bum')
                this.scene.start('menuScene')    
            }
            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                this.sound.play('sfx-bum')
                this.scene.restart()    
            }
            
            //end screen message
            if(!this.endScreen) {
                this.endScreen = true
                let endConfig = {
                    fontFamily: 'arial',
                    fontSize: '68px',
                    backgroundColor: '#FF0000',
                    color: '#000000',
                    align: 'center',
                    padding: {
                      top: 5,
                      bottom: 5,
                    },
                    fixedWidth: 1080
                  }
                this.add.text(game.config.width/2, game.config.height/2.3, 'GAME OVER', endConfig).setOrigin(0.5)
                
                endConfig.fontSize = '30px'
                this.add.text(game.config.width/2, game.config.height/2, "'<' arrow to go to the menu, '>' play again", endConfig).setOrigin(0.5)
            }
        }
    }
}