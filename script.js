const context = cast.framework.CastReceiverContext.getInstance();
const NAMESPACE = 'urn:x-cast:gameSWJS';

const resolutionX = 800;
const resolutionY = 800;
var tileSizeX = 128;
var tileSizeY = 128;


var groundTiles;
var playerTankSprite;
var goalSprite;
var explodeSprite;
var deathStarSprite;
var playerOffsetX = (resolutionX / 2 - 24);
var playerOffsetY = (resolutionY / 2 - 24);
var goalOffsetX = (resolutionX / 2 - (Math.random() * 200) + 0);
var goalOffsetY = (resolutionY / 2 - (Math.random() * 200) + 0);

var explodeOffsetX = (resolutionX / 2 - (Math.random() * 200) + 0);
var explodeOffsetY = (resolutionY / 2 - (Math.random() * 200) + 0);
var deathStarOffsetX= (resolutionX / 2 - (Math.random() * 200) + 0);
var deathStarOffsetY=(resolutionY / 2 - (Math.random() * 200) + 0);
var score = 0;


var remainingTime;


console.log(goalOffsetX + " Goal Off Set " + goalOffsetY);

const app = new PIXI.Application({ width: resolutionX, height: resolutionY, backgroundColor: 0x1099bb });

var boxWidth = resolutionX/ 40;
var boxHeight = resolutionY / 40;
console.log(boxWidth);
/*
const audio= new Audio('musics/song1.mp3');
audio.volume=0.5;
//audio.loop=true;

function playMusic() {
    audio.play()
}

playMusic();
*/
document.getElementById("pixi-container").appendChild(app.view);

const texturePromise = PIXI.Assets.load('imgs/imgGalaxy.png');
const tankPromise = PIXI.Assets.load('imgs/imgTanks.png');
const goalPromise = PIXI.Assets.load('imgs/imgTieFigther.png');
const explodePromise=PIXI.Assets.load('imgs/imgExplodeAsteroid.png');
const deathStarPromise=PIXI.Assets.load('imgs/imgDeathStar.png');

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
            PIXI.utils.TextureCache['imgs/imgTieFigther.png'],
            new PIXI.Rectangle(0 ,0, 2048, 2048)
        );
        goalSprite = new PIXI.Sprite(goalTexture);
        goalSprite.width=75;
        goalSprite.height=75;
        goalSprite.x = Math.round(goalOffsetX);
        goalSprite.y = Math.round(goalOffsetY);
        app.stage.addChild(goalSprite);  
        text();
    })
    explodePromise.then((explodePromiseReceive) =>{
        var explodeTexture = new PIXI.Texture(
            PIXI.utils.TextureCache['imgs/imgExplodeAsteroid.png'],
            new PIXI.Rectangle(0 ,0, 2048, 2048)
        );
        explodeSprite = new PIXI.Sprite(explodeTexture);
        explodeSprite.width=75;
        explodeSprite.height=75;
        explodeSprite.x = Math.round(explodeOffsetX);
        explodeSprite.y = Math.round(explodeOffsetY);
        app.stage.addChild(explodeSprite);  
    })
    deathStarPromise.then((deathStarReceive)=>{
        var deathStarTexture=new PIXI.Texture(
            PIXI.utils.TextureCache['imgs/imgDeathStar.png'],
            new PIXI.Rectangle(0 ,0, 2048, 2048)
        );
        deathStarSprite=new PIXI.Sprite(deathStarTexture);
        deathStarSprite.width=150;
        deathStarSprite.height=150;
        deathStarSprite.x=Math.round(deathStarOffsetX);
        deathStarSprite.y=Math.round(deathStarOffsetY);
        app.stage.addChild(deathStarSprite);
    })
    
}

)
function text(){
    document.getElementById("score").innerHTML = "Score = " +score;
    document.getElementById("enemie").innerHTML = "Tie Fighter Position X = "+goalSprite.x + "Y = "+goalSprite.y;
    document.getElementById("player").innerHTML = "Player Position X = "+ playerTankSprite.x + "Y = "+ playerTankSprite.y;
    document.getElementById("explosion").innerHTML="Asteroid Position X = "+explodeSprite.x+ " Y = "+explodeSprite.y;
    document.getElementById("explosionTime").innerHTML="Time before explosion="+remainingTime+"s";

}

function handleCustomMess(CustomMess){
    collide();
    if(CustomMess.data.for && !CustomMess.data.bac){
        if (playerTankSprite.position.y != 0) {
            // Don't move up if the player is at the top of the stage
            playerTankSprite.position.y -= boxHeight;
        }
    }
    else if( !CustomMess.data.for && CustomMess.data.bac){
        if (playerTankSprite.position.y != resolutionY - boxHeight) {
            // Don't move down if the player is at the bottom of the stage
            playerTankSprite.position.y += boxHeight;
        }
    }
    if(CustomMess.data.lef && !CustomMess.data.rig){
        if (playerTankSprite.position.x != 0) {
            // Don't move to the left if the player is at the left side of the stage
            playerTankSprite.position.x -= boxWidth;
        }
        
    }else if(CustomMess.data.rig && !CustomMess.data.lef){
        if (playerTankSprite.position.x != resolutionX - boxWidth) {
            // Don't move to the right if the player is at the right side of the stage
            playerTankSprite.position.x += boxWidth;
        }
    }

}

function explode(){
    var explosionRadius=50;
    

    let positionX = false;
    let positionY = false;

    let newXValue = (Math.random() * 600);
    let newYValue = (Math.random() * 600);

    if(playerTankSprite.x >=explodeSprite.x-explosionRadius && playerTankSprite.x<= explodeSprite.x+explosionRadius){
        positionX=true;
    }
    if(playerTankSprite.y >=explodeSprite.y-explosionRadius && playerTankSprite.y<= explodeSprite.y+explosionRadius){
        positionY=true;
    }

    console.log("asteroid x position :"+explodeSprite.x);
    console.log("asteroid y position :"+explodeSprite.y);

    
        remainingTime=3;
        const timeNum=setInterval(()=>{
            if(remainingTime>0){
                document.getElementById("explosionTime").innerHTML="Time before explosion="+remainingTime+"s";
                remainingTime--;
               
            }else{
                clearInterval(timeNum);
                document.getElementById("explosionTime").innerHTML="explosion iminent";
                

                if(positionX && positionY ){
                    
            playerTankSprite.x=playerOffsetX;
            playerTankSprite.y=playerOffsetY;
            score=0;
            
                }
                
                explodeSprite.position.y = newYValue;
                explodeSprite.position.x = newXValue;
                explodeSprite.x = Math.round(explodeSprite.x);
                explodeSprite.y = Math.round(explodeSprite.y);
              
            }

        },1000);

        text();
    }




function collide(){
    let newXValue = (Math.random() * 600);
    let newYValue = (Math.random() * 600);

    let positionX = false;
    let positionY = false; 
    for (let i = 0; i < 80; i++) {
        if(playerTankSprite.x == goalSprite.x + i){
            console.log("Position X collide");
            positionX = true};
        if(playerTankSprite.y == goalSprite.y+ i){
            console.log("Position Y collide");
            positionY = true};
    }
    if(positionX && positionY){
        console.log("Both position collide");
        score +=100;
        goalSprite.position.y = newYValue;
        goalSprite.position.x = newXValue;
        goalSprite.x = Math.round(goalSprite.x);
        goalSprite.y = Math.round(goalSprite.y);
    }

    
    text();
}


function onKeyDown(key) {
    
    collide();
  
  
    // W Key is 87
    // Up arrow is 87
    if (key.keyCode === 87 || key.keyCode === 38) {
        // If the W key or the Up arrow is pressed, move the player up.
        if (playerTankSprite.position.y > 0) {
            // Don't move up if the player is at the top of the stage
            playerTankSprite.position.y -= boxHeight;
        }
        
    }

    // S Key is 83
    // Down arrow is 40
    if (key.keyCode === 83 || key.keyCode === 40) {
        // If the S key or the Down arrow is pressed, move the player down.
        if (playerTankSprite.position.y < 750) {
            // Don't move down if the player is at the bottom of the stage
            playerTankSprite.position.y += boxHeight;
        }
    }

    // A Key is 65
    // Left arrow is 37
    if (key.keyCode === 65 || key.keyCode === 37) {
        // If the A key or the Left arrow is pressed, move the player to the left.
        if (playerTankSprite.position.x > 0) {
            // Don't move to the left if the player is at the left side of the stage
            playerTankSprite.position.x -= boxWidth;
        }
    }

    // D Key is 68
    // Right arrow is 39
    if (key.keyCode === 68 || key.keyCode === 39) {
        // If the D key or the Right arrow is pressed, move the player to the right.
        if (playerTankSprite.position.x < 750) {
            // Don't move to the right if the player is at the right side of the stage
            playerTankSprite.position.x += boxWidth;
        }
    }

    playerTankSprite.position.x = Math.round(playerTankSprite.position.x);
    playerTankSprite.position.y = Math.round(playerTankSprite.position.y);
    explode();
}

const options = new cast.framework.CastReceiverOptions(); 
context.addCustomMessageListener(NAMESPACE, handleCustomMess);
context.start(options);
