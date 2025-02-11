class Credit extends Phaser.Scene {
    constructor() {
        super("creditScene")
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {

            this.scene.start('menuScene')    
        }
    }
}