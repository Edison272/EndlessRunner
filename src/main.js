//Edison Chan
//Deflection Run
//25~ hours

//Creative Tilt
//I think as far as "creative tilts" goes, I think I'm proud of the wide varied of 
// polished features i was able to add to the game to make it feel even a little bit more immersive.
// A couple that I'm particularly proud of are:
//
// (Technical)
// - the parallax backdrop, which also speeds up as the difficulty increases
// - the camera shake when the player dies to make it feel like they fell off the buildings


// (Visual)
// - the color choices for the characters that allows each element to create a visually appealing screen
// - the character animations & walk cycles which turned out pretty decent for how inexperienced i was
// - the impact frames i added in some of my animations
// - the littlecutscene when you play the game from the menu

let config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [Load, Menu, Play, Credit]
}

let game = new Phaser.Game(config)
let { height, width } = game.config
let borderUISize = game.config.height / 25
let borderPadding = borderUISize / 3
let cursors