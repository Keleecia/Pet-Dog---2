var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var changingGameState;
var readingGameState;
var bedroomIMG, gardenIMG,washroomIMG;
var currentTime;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happydog.png");

bedroomIMG = loadImage("virtual pet images/Bed Room.png");
gardenIMG = loadImage("virtual pet images/Garden.png ");
washroomIMG = loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(550,800);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(270,600,150,150);
  dog.addImage(sadDog);
  dog.scale=0.19;
  
  feed=createButton("Feed the dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })




}

function draw() {
  background(46,139,87);
  //46,139,87
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed %12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }  
 
   currentTime = hour();

   if(currentTime === (lastFed))
   {
     update("Playing");
     garden();
   }
   else if (currentTime === (lastFed + 2))
   {
      update("Sleeping");
      bedroom();
   }
   else if(currentTime>(lastFed+2) && currentTime<= (lastFed+4))
   {
     update("Bathing");
     washroom();
   }   
   else
  {
    update("Hungry")
    foodObj.display();
  }

  if(gameState != "Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else
  {
    feed.show();
    addFood.show()
    dog.addImage(sadDog);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function bedroom()
{
  //background(bedroomIMG);
  image(bedroomIMG,275,400,550,800);
}

function garden()
{
  //background(gardenIMG,550,800);
  image(gardenIMG,275,400,550,800);
}

function washroom()
{
  image(washroomIMG,275,400,550,800);
  //background(washroomIMG);
} 

function update(state)
{
database.ref('/').update({
  gameState:state
})
}