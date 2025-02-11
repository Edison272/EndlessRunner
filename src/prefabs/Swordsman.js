class Swordsman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)
      scene.add.existing(this)
      scene.physics.add.existing(this)
      this.setScale(3)

      //swordsman physics
      this.body.setSize(23,29).setOffset(6, 4)
      this.body.pushable = false
      this.setGravityY(1000);

      //sword slash
      this.slash = scene.physics.add.sprite(x, y/2, 'slash').setOrigin(0).setScale(4)
      this.slash.body.enable = false
      this.slash.body.pushable = false
      this.slash.visible = false

      this.canSuperSlash = false
      this.superslash = scene.add.sprite(0, 0, 'superslash').setOrigin(0).setScale(9)
      this.superslash.visible = false

      //state variables
      this.OnGround = true

      this.moveSound = scene.sound.add('sfx-running')
      


      // initialize state machine managing hero (initial state, possible states, state args[])
      scene.swordsmanFSM = new StateMachine('running', {
        running: new RunState(),
        airborne: new AirState(),
        slashing: new SlashState(),
        jumping: new JumpState(),
        dropping: new DropState(),
        superslash: new SuperState(),
        death: new DeathState()
      }, [scene, this])
    }
}

class RunState extends State {
    enter(scene, swordsman) {
      this.moveSound = scene.sound.add('sfx-running')
      this.moveSound.play()
      swordsman.anims.play('running', true)
    }
    execute(scene, swordsman) {
      // use destructuring to make a local copy of the keyboard object
      const {right, left, down, up} = scene.cursors
      if(Phaser.Input.Keyboard.JustDown(right)) {
        this.stateMachine.transition('slashing')
        return
      }
      if(swordsman.OnGround && Phaser.Input.Keyboard.JustDown(up)) {
        this.moveSound.stop()
        swordsman.OnGround = false
        this.stateMachine.transition('jumping')
        return
      }
      if(Phaser.Input.Keyboard.JustDown(left) && swordsman.canSuperSlash) {
        this.moveSound.stop()
        this.stateMachine.transition('superslash')
        return
      }
      if(Phaser.Input.Keyboard.JustDown(down)) {
        this.moveSound.stop()
        this.stateMachine.transition('dropping')
        return
      }
      
    }
}

class AirState extends State {
  enter(scene, swordsman) {
    swordsman.anims.play('jumping', true)
  }
  execute(scene, swordsman) {
    const {right, left, up, down} = scene.cursors
    if(Phaser.Input.Keyboard.JustDown(right)) {
      this.stateMachine.transition('slashing')
      return
    }
    if(Phaser.Input.Keyboard.JustDown(left) && swordsman.canSuperSlash) {
      this.stateMachine.transition('superslash')
      return
    }
    if(swordsman.OnGround && Phaser.Input.Keyboard.JustDown(up)) {
      this.stateMachine.transition('jumping')
      return
    }
    if(Phaser.Input.Keyboard.JustDown(down)) {
      this.stateMachine.transition('dropping')
      return
    }
    if(swordsman.OnGround) {
      this.stateMachine.transition('running')
      return
    }
  }
}

class SlashState extends State {
  enter(scene, swordsman) {
    swordsman.slash.visible = true
    swordsman.slash.body.enable = true
    scene.sound.play('sfx-swish')
    swordsman.slash.anims.play('swordslash').once('animationcomplete', () => {
      swordsman.slash.body.enable = false
      swordsman.slash.visible = false
      
    })
    swordsman.anims.play('slashing').once('animationcomplete', () => {
        this.stateMachine.transition('airborne')
      
    })
  }
  execute(scene, swordsman) {
    swordsman.slash.body.x = swordsman.body.x
    swordsman.slash.body.y = swordsman.body.y-16
  }
}

class JumpState extends State {
    enter(scene, swordsman) {
      this.moveSound = scene.sound.add('sfx-woosh')
      this.moveSound.stop()
      this.moveSound.play()
      swordsman.anims.play('jumping', true)
      swordsman.body.setVelocityY(-700)
    }
    execute(scene, swordsman) {
      this.stateMachine.transition('airborne')
    }
}

class DropState extends State {
  enter(scene, swordsman) {
    this.moveSound = scene.sound.add('sfx-woosh')
    this.moveSound.stop()
    this.moveSound.play()
    swordsman.anims.play('dropping', true)
    swordsman.body.setVelocityY(2000)
  }
  execute(scene,swordsman) {
    this.stateMachine.transition('airborne')
  }
}

class SuperState extends State {
  enter(scene, swordsman) {
    swordsman.slash.body.enable = true
    swordsman.anims.play('slashing', true)
    swordsman.superslash.visible = true
    swordsman.body.setVelocityY(-1000)
    swordsman.superslash.anims.play('superswordslash').once('animationcomplete', () => {
      scene.superslash()
      swordsman.superslash.visible = false
      swordsman.canSuperSlash = false
      if(swordsman.OnGround) {
        this.stateMachine.transition('running')
      } else {
        this.stateMachine.transition('airborne')
        swordsman.slash.body.enable = false
      }
    })
    
  }
  execute(scene, swordsman) {
    swordsman.superslash.x = 0
    swordsman.superslash.y = scene.cameras.main.scrollY
    
  }
}

class DeathState extends State {
  enter(scene, swordsman) {
    swordsman.body.checkCollision.none = true
    swordsman.anims.play('death')
  }
}

