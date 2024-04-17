const resolutionX = 900;
const resolutionY = 900;
var tileSizeX = 128;
var tileSizeY = 128;

var groundTiles;
var playerTankSprite;
var goalSprite;
var playerOffsetX = (resolutionX / 2 - 24);
var playerOffsetY = (resolutionY / 2 - 24);


const app = new PIXI.Application({ width: resolutionX, height: resolutionY, backgroundColor: 0x1099bb });

var boxWidth = resolutionX/ 15;
var boxHeight = resolutionY / 15;
console.log(boxWidth);

document.getElementById("pixi-container").appendChild(app.view);

const texturePromise = PIXI.Assets.load('imgs/imgGalaxy.png');
const tankPromise = PIXI.Assets.load('imgs/imgTanks.png');
const goalPromise = PIXI.Assets.load('imgs/imgTanks.png');

texturePromise.then((texturePromiseReceive) => {
    document.addEventListener('keydown', onKeyDown);
    var groundTiles = new PIXI.tilemap.CompositeRectTileLayer(0, PIXI.utils.TextureCache['imgs/imgGalaxy.png']);
    
    app.stage.addChild(groundTiles);

    for (var i = 0; i <= parseInt(resolutionX / tileSizeX); i++) {
        for (var j = 0; j <= parseInt(resolutionX / tileSizeX); j++) {
            groundTiles.addFrame('imgs/imgGalaxy.png', i * tileSizeX, j * tileSizeY);
        }
    }
    tankPromise.then((tankPromiseReceive) => {
        
            var tankTexture = new PIXI.Texture(
                PIXI.utils.TextureCache['imgs/imgTanks.png'],
                new PIXI.Rectangle(0 * 48, 22*48, 48, 48)
            );
            playerTankSprite = new PIXI.Sprite(tankTexture);
            playerTankSprite.x = playerOffsetX;
            playerTankSprite.y = playerOffsetY;
            app.stage.addChild(playerTankSprite);
            
        }
    )
    goalPromise.then((goalPromiseReceive) =>{
        var goalTexture = new PIXI.Texture(
            PIXI.utils.TextureCache['imgs/imgTanks.png'],
            new PIXI.Rectangle(0 * 48,46*48, 48, 48)
        );
        goalSprite = new PIXI.Sprite(goalTexture);
        spawnGoal();
        app.stage.addChild(goalSprite);

    })
    
}
)
function spawnGoal(){
    var randomX = Math.floor((Math.random() * 10) + 0);
    var randomY = Math.floor((Math.random() * 10) + 0);

    goalSprite.position.x = resolutionX - randomX;
    goalSprite.position.y = resolutionY - randomY;


}

function onKeyDown(key) {
    // W Key is 87
    // Up arrow is 87
    if (key.keyCode === 87 || key.keyCode === 38) {
        // If the W key or the Up arrow is pressed, move the player up.
        if (playerTankSprite.position.y != 0) {
            // Don't move up if the player is at the top of the stage
            playerTankSprite.position.y -= boxHeight;
        }
    }

    // S Key is 83
    // Down arrow is 40
    if (key.keyCode === 83 || key.keyCode === 40) {
        // If the S key or the Down arrow is pressed, move the player down.
        if (playerTankSprite.position.y != resolutionY - boxHeight) {
            // Don't move down if the player is at the bottom of the stage
            playerTankSprite.position.y += boxHeight;
        }
    }

    // A Key is 65
    // Left arrow is 37
    if (key.keyCode === 65 || key.keyCode === 37) {
        // If the A key or the Left arrow is pressed, move the player to the left.
        if (playerTankSprite.position.x != 0) {
            // Don't move to the left if the player is at the left side of the stage
            playerTankSprite.position.x -= boxWidth;
        }
    }

    // D Key is 68
    // Right arrow is 39
    if (key.keyCode === 68 || key.keyCode === 39) {
        // If the D key or the Right arrow is pressed, move the player to the right.
        if (playerTankSprite.position.x != resolutionX - boxWidth) {
            // Don't move to the right if the player is at the right side of the stage
            playerTankSprite.position.x += boxWidth;
        }
    }
}
;