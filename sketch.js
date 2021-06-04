var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;
var points=0;
var score=0;
var life=3;
var index=0;

var mario,mario_running,mario_collided
var ground,invisibleGround,groundImage;
var moneyGroup,money2Group,money1,money2,money3;
var obstaclesGroup, obstacle1,obstacle2,obstacle3,obstacle4;

var moneySound, jumpSound, deadSound, bgSound;
var restartImg,Shop,candyShop,deco,deco1;

var bellSound;

localStorage["HighestScore"] = 0;

function preload(){
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("backimg13.png");

  moneySound = loadSound("coin.wav");
  jumpSound= loadSound("SmallJumpwav.wav")
  deadSound = loadSound("MarioDiedSound.wav")
  bellSound = loadSound("bells1.mp3");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  money1 = loadImage("money1.png");
  money2 = loadImage("money2.png");
  money3 = loadImage("money3.png");
  
  restartImg = loadImage("restart.png");

  candyShop = loadImage("candyShop.png");
  deco1 = loadImage("deco.png");

}

function setup() {
  createCanvas(1530, 760);

  mario = createSprite(130,400,50,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.5;

  ground = createSprite(0,650,1200,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible=false;

  //candyShop.visible = false;
  
  restart = createSprite(750,300);
  restart.addImage(restartImg);
  restart.scale = 0.9;
  restart.visible = false;
  
  moneyGroup = new Group();
  obstaclesGroup = new Group();
  money2Group = new Group();

  Shop = createSprite(750,100);
  Shop.addImage(candyShop);
  Shop.scale=0.9;

  deco = createSprite(40,60);
  deco.addImage(deco1);
  deco.scale=0.2;
  //score = 0;
}

function draw() {
  background(groundImage);
  textSize(30);
  stroke(255,0,255);
  fill("white");
  text("Points: "+ points, 1310,60);
  
  //text("life: "+ life , 500,60);
  textSize(30);
  stroke(255,0,255);
  fill("white");
  text("Life: "+ life, 1310,90);
  
  textSize(30);
  stroke(255,0,255);
  fill("white");
  text("Score: "+ score, 1310,30);

  drawSprites();

if (gameState===PLAY){
  score = score+ Math.round(frameCount/100);
  //(getFrameRate()/60);
  if(score>= 0){
  ground.velocityX = -6;
  }else{
  ground.velocityX = -(6 + 3*score/100);
  }
  

if(keyDown("space") && mario.y >= 139) {
      jumpSound.play();
      mario.velocityY = -18;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(ground);

   if(obstaclesGroup.isTouching(mario)){
        life=life-1;
        gameState = END;
        deadSound.play();

   } 
   
   if(moneyGroup.isTouching(mario)){
        points=points + 1;
        moneySound.play();
        moneyGroup[0].destroy();
    }

    if(money2Group.isTouching(mario)){
      points= points + 2;
      bellSound.play();
      money2Group[0].destroy();
    }

    spawnMoney();
    spawnObstacles();
    spawnMoney2();
  }
    
  else if (gameState === END ) {
    //bgSound.stop();
   // gameOver.visible = true;
   textSize(50);
   fill(255,0,255);
   text("G A M E  O V E R",560,250);

    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    moneyGroup.setVelocityXEach(0);
    money2Group.setVelocityXEach(0);
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.5;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    moneyGroup.setLifetimeEach(-1);
    money2Group.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  else if(life===0){
    reset();
  }
}

function spawnMoney() {
  //write code here to spawn the clouds
    if(frameCount % 30 === 0) {
      var money = createSprite(900,600,40,40);    
      //generate random obstacles
      var rand = Math.round(random(1,2));
      switch(rand) {
        case 1: money.addImage(money1);
                break;
        case 2: money.addImage(money2);
                break;
      }
    money.velocityX = -(6 + 1*points/100);
    money.scale = 0.1;
    money.velocityX = -4; 
    
     //assign lifetime to the variable
    money.lifetime = 200;
    
    //adjust the depth
    money.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    moneyGroup.add(money);
  }
}
function spawnMoney2 (){
  //write code here to spawn the clouds
  if (frameCount % 150=== 0) {
    var money2 = createSprite(600,100,40,10);
    money2.y = Math.round(random(10,60));
    money2.addImage(money3);
    money2.scale = 0.1;
    money2.velocityX = -3;
    
     //assign lifetime to the variable
    money2.lifetime = 200;
    
    //adjust the depth
    money2.depth = mario.depth;
   mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    money2Group.add(money2);
  }
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(900,600,40,40);    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4:obstacle.addImage(obstacle4);
              break;
      default:break;
    }
        
    obstacle.velocityX = -(6 + 3*points/100);;
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
   
  }

function reset(){
  gameState = PLAY;
  //gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  moneyGroup.destroyEach();
  money2Group.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  if(life===0){
    life =3;
  }
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
   score = 0;
}
