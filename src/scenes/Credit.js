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

        
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {

            this.scene.start('menuScene')    
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.scene.start('playScene') 
        }
    }
}