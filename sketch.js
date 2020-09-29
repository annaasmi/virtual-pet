var dog,happyDog,database,foodS,foodStock,dogImg;
var lastfed,feed,addFood,fedTime,foodObj;
var ChangeGameState, ReadGameState,gameState;
var bedroom,Garden,Washroom,sadDog;

function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/happydog.png");
  sadDog = loadImage("images/deadDog.png");
  bedroom = loadImage("images/Bed Room.png");
  Garden = loadImage("images/Garden.png");
}

function setup() {
  createCanvas(500, 500);

  foodObj = new Food();
  
  feed = createButton("feed the dog");
  feed.position(300,30);
  feed.mousePressed(feedDog);
   
  addFood = createButton("add food");
  addFood.position(400,30);
  addFood.mousePressed(addFoods);
  
  dog = createSprite(250,400,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  lastFed = 0;
  gameState = 0;

  ReadGameState = database.ref('gameState');
  ReadGameState.on("value",function(data){
    gameState=data.val();
  })
  
}


function draw() { 
  textSize(20);
  fill("white");
  background(46,139,87);

  foodObj.display();
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  }) 

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    dog.addImage(sadDog);
    text("Last Fed : "+lastFed%12 + "PM",50,30);
  }else if(lastFed==0){
    text("Last Fed : 12 AM",350,30);
  }else{
    text("Last Fed : "+ lastFed + "AM",0,30);
  }

  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }

  if(gameState!=="hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
  drawSprites();

  


}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
   if(x<=0){
  x = 0; 
} else{
x=x-1;
 } 
 database.ref('/').update({ 
   Food:x 
  }) 
}

function feedDog(){
  dog.addImage(happyDog);
  update("playing");

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
async function hour(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Tokyo"); 
  var responseJSON = await response.json(); 
  var dateTime = responseJSON.datetime;
  var hours = dateTime.slice(11,13);
  return hours;
 

}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}



