class Food{
    constructor(){
        this.image = loadImage("images/Milk.png");
        this.foodStock = 0;
        this.lastFed;
    }
    display(){
        var x= 50,y=50;

        imageMode(CENTER);
        image(this.image,100,400,70,70);

        if(this.foodStock!=0){
            for(var i=0;i<this.foodStock;i++){
                if(i%10==0){
                    x=80;
                    y=y+50;
                }
                image(this.image,x,y,50,50);
                x=x+30;
            }
        }
    }
    getFoodStock(){
      return this.foodStock;
    }
    updateFoodStock(foodStock){
     this.foodStock = foodStock;
    }
    deductFood(){
        if(this.foodStock>0){
            this.foodStock = this.foodStock-1;
        }
    }
    bedroom(){
        background(bedroom);
    }
    garden(){
        background(Garden);
    }
    washroom(){
        background(Washroom);
    }
}