class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }
    create() { 
        this.cursors = this.input.keyboard.createCursorKeys()

        this.BG2 = this.add.tileSprite(0, 780, 720, 720, 'veryfarbg').setOrigin(0, 0.5).setScale(1.5)
        this.BG1 = this.add.tileSprite(0, 810, 720, 720, 'farbg').setOrigin(0, 0.6).setScale(1.5)
        this.BG0 = this.add.tileSprite(0, 820, 720, 800, 'nearbg').setOrigin(0, 0.25).setScale(1.5)

        this.cameras.main.setBackgroundColor(0x807580)

        this.drone1 = this.add.sprite(game.config.width/5, game.config.height/4, 'drone').setOrigin(0.5, 0.5).setScale(6)
        this.drone2 = this.add.sprite(game.config.width/1.3, game.config.height/6, 'drone').setOrigin(0.5, 0.5).setScale(6)
        this.drone3 = this.add.sprite(game.config.width/2, game.config.height/1.2, 'drone').setOrigin(0.5, 0.5).setScale(6)
        this.drones = this.add.group([this.drone1, this.drone2, this.drone3])
        this.anims.play('hovering', this.drones.getChildren())


        this.swordui = this.add.image(game.config.width/2, game.config.height/2, 'swordbar').setOrigin(0.5, 0.6).setScale(5, 6)
        //this.scene.start('playScene')
        this.optionSelected = false
    }

    update() {
        if(!this.optionSelected) {
            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                this.optionSelected = true
                //this.scene.start('creditScene')    
            }
            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                this.optionSelected = true
                   
            }
        } else {
            //cutscene
            this.drones.incY(15)
            this.swordui.setRotation(this.swordui.y/2000)
            this.swordui.y += 30

            if(this.drone3.y > 1000) {
                this.BG2.y -= 11
                this.BG1.y -= 10
                this.BG0.y -= 9
            }
            if(this.BG0.y < 0) {
                this.cameras.main.setBackgroundColor(0x000000)

                if(this.BG0.y < -500) {
                    this.scene.start('playScene') 
                }
            } 
        }  
    }

}