const resolutionX = 900;
const resolutionY = 900;
var tileSizeX = 128;
var tileSizeY = 128;

var groundTiles;
var playerTankSprite;
var goalSprite;
var playerOffsetX = (resolutionX / 2 - 24);
var playerOffsetY = (resolutionY / 2 - 24);
var goalOffsetX = (resolutionX / 2 - (Math.random() * 200) + 0);
var goalOffsetY = (resolutionY / 2 - (Math.random() * 200) + 0);
console.log(goalOffsetX + " Goal Off Set " + goalOffsetY);



const app = new PIXI.Application({ width: resolutionX, height: resolutionY, backgroundColor: 0x1099bb });

var boxWidth = resolutionX/ 40;
var boxHeight = resolutionY / 40;
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
        goalSprite.x = Math.round(goalOffsetX);
        goalSprite.y = Math.round(goalOffsetY);
        app.stage.addChild(goalSprite);
        
        

    })
    
    
}
)

function collide(){
    console.log(playerTankSprite.x + " " + playerTankSprite.y);
    console.log(goalSprite.x + " " + goalSprite.y);
    let newXValue = (Math.random() * 200);
    let newYValue = (Math.random() * 200);

    let positionX = false;
    let positionY = false; 
    for (let i = 0; i < 20; i++) {
        if(playerTankSprite.x == goalSprite.x + i){
            console.log("Position X collide");
            positionX = true};
        if(playerTankSprite.y == goalSprite.y+ i){
            console.log("Position X collide");
            positionY = true};
    }
    if(positionX && positionY){
        console.log("Both position collide");
        goalSprite.position.y =+ newYValue;
        goalSprite.position.x =+ newXValue;
        goalSprite.x = Math.round(goalSprite.x);
        goalSprite.y = Math.round(goalSprite.y);
    }
}


function onKeyDown(key) {
    collide();
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
    playerTankSprite.position.x = Math.round(playerTankSprite.position.x);
    playerTankSprite.position.y = Math.round(playerTankSprite.position.y);
    console.log(playerTankSprite.x + " " + playerTankSprite.y);
}
;