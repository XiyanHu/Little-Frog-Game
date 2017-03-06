// Draw the enemy and player objects on the screen
var currentScore = document.getElementById("score");
var life = document.getElementById("life");
var PLAYER_START_LOCX = 200;
var PLAYER_START_LOCY = 400;
var ENEMY_START_LOCX = -10;
var MIN_SPEED = 200;
var SPEED_RANGE = 100;

//var winner = "N.A";

Object.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


//var now=new Date()
//document.write(1900+now.getYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()) 


var time=[];
time[0] = new Date();


//Reset player to beginning position
Object.prototype.reset = function () {
  player.x = PLAYER_START_LOCX;
  player.y = PLAYER_START_LOCY;
}

/*
    Enemy Objects
*/

// Enemies the player must avoid
var Enemy = function(x,y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = Math.round(MIN_SPEED*Math.random()+SPEED_RANGE);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    //when the enemy crosses the screen, reset its position and speed,else keep running.
    if(this.x <= ctx.canvas.width){
        this.x += this.speed * dt;
    }else{
        this.x = ENEMY_START_LOCX;
        this.speed = Math.round(MIN_SPEED*Math.random()+SPEED_RANGE+parseInt(currentScore.innerHTML)/5);
    }
    if (localStorage.highestscore==null) localStorage.highestscore=0;
    //If the player get close to enemies, reset the game and life -1;
    if(player.x>=this.x-80&&player.x<=this.x+80){
        if(player.y>=this.y-50&&player.y<=this.y+50){
            life.innerHTML = parseInt(life.innerHTML)-1;
            if (parseInt(life.innerHTML)==0){
                if (parseInt(currentScore.innerHTML)>localStorage.highestscore){
                    var spout = "Congratulations! You scored "+parseInt(currentScore.innerHTML)+" !!!A new Record!!!"
                    var str=prompt(spout,"Your name is ");
                    localStorage.highestscore = parseInt(currentScore.innerHTML);
                    if (str){
                        localStorage.winner=str;
                    }
                }
                else {
                    var output = "Game Over! You scored is "+parseInt(currentScore.innerHTML)+" !\n";
                    if (localStorage.highestscore==0){
                        output = output + "No records!";    
                    }
                    else{
                        output = output + "The record is "+localStorage.highestscore+" by "+localStorage.winner;    
                    }
                    alert(output);
                }
              //  alert("Game Over! You scored "+parseInt(currentScore.innerHTML)+" !");
                life.innerHTML = 3;
                currentScore.innerHTML = 0;
            }
            this.reset();
        }
    }
}

/*
    Player Object
*/

// Player class and initial x and y coordinates
var Player = function(x,y){
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
}

//Update player position
Player.prototype.update = function(){
  if (this.y < 0||this.y>ctx.canvas.height||this.x<0||this.x>ctx.canvas.width){
      
      time[1] = new Date();
      var timeScore = time[1].getSeconds()-time[0].getSeconds();
      time[0] =  time[1];
      currentScore.innerHTML = parseInt(currentScore.innerHTML)+50-timeScore;
      this.reset();
    }
}

//Input handler for player
Player.prototype.handleInput = function(key){
    if (key == 'left'&&player.x - 80 > 0){
        this.x -= 100;    
    }    
    else if (key == 'right'&&ctx.canvas.width - player.x > 200){
        this.x += 100;    
    }
    else if (key == 'up'){
        this.y -= 90;    
    }
    else if (key == 'down'&&ctx.canvas.height - player.y > 220 ){
        this.y += 90;    
    }      
}


// Instantiate enemies and player objects
var allEnemies = [];
for(var i=50;i<=220;i=i+85) {
    var enemy = new Enemy(-50, i);
    allEnemies.push(enemy);
}

var player = new Player(PLAYER_START_LOCX,PLAYER_START_LOCY); 


// listens for key presses and sends the keys to 
// Player.handleInput() method.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

$("#howtoplay").click(function(){
    if($("#introduction").css("display")=="none"){
        $("#introduction").css("display","block");
    }
    else {
        $("#introduction").css("display","none");
    }
});

$("#cross").click(function(){
    $("#introduction").css("display","none");
});

