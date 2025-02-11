class Credit extends Phaser.Scene {
    constructor() {
        super("creditScene")
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys()

        let UIConfig = {
            fontFamily: 'arial',
            fontSize: '32px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'center',
            padding: {
              top: 10,
              bottom: 10,
            },
            fixedWidth: 1080
            
          }
        this.instructionUI = this.add.text(game.config.width/2, game.config.height, "'<' arrow to return to menu, '>' arrow to play the game", UIConfig).setOrigin(0.5, 1)
        UIConfig.backgroundColor = '#000000'
        UIConfig.color = '#FFFFFF'
        UIConfig.fixedHeight = 360
        UIConfig.align = 'left'
        this.credit = this.add.text(game.config.width/2, game.config.height/2, ` - royalty free SFX from pixabay.com\n
 - Audio Context issue solution from Phaser Forums at:\nhttps://phaser.discourse.group/t/audiocontext-was-not-allowed-to-start/795\n
 - Looping Audio Help from Phaser Forums at:\nhttps://stackoverflow.com/questions/34210393/looping-audio-in-phaser\n
 - Art/Assets Done by Edison Chan\n - Programming Done by Edison Chan`, UIConfig).setOrigin(0.5, 1)


    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.sound.play('sfx-bum')
            this.scene.start('menuScene')    
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.sound.play('sfx-bum')
            this.scene.start('playScene') 
        }
    }
}