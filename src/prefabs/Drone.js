class Drone extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setScale(3)

        //spawn
        this.new = true
        this.elevation = Phaser.Math.Between(-100, 400) -100*(scene.difficultyScale-1)

        //drone physics
        this.body.setSize(16,15)
        this.anims.play('hovering', true)

        //shoot timer
        this.shootTime = 3
        this.currTime = 0

        this.shootTime = scene.time.delayedCall(5000, () => {
            scene.time.addEvent({
                delay: 3000/scene.difficultyScale, // ms
                callback: () => {
                    scene.shoot(this.body.x, this.body.y+50)
                },
                //args: [],
                callbackScope: null  ,
                loop: true,
            })});
            this.whirr = scene.sound.add('sfx-drone', {volume: 0.1})
            this.whirr.play()
    }

    intoPosition() {
        if(this.body.y < this.elevation) {
            this.body.y += (this.body.y-this.elevation)/-100
        }
    }
    

    death() {
        this.setGravityY(1100);
        this.shootTime.destroy()
    }

}