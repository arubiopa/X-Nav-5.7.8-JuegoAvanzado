// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

//monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";
// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var arrMonster = [];
var numMonster = 3;
var princess = {};
var stone = {};
var arrStone = [];
var numStone = 4;
var princessesCaught = 0;

princessesCaught = localStorage.getItem('princessesCaught');
numStone = localStorage.getItem('numStone');
arrStone = localStorage.getItem('arrStone');
numMonster = localStorage.getItem('numMonster');
arrMonster = localStorage.getItem('arrMonster');

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 100));
	princess.y = 32 + (Math.random() * (canvas.height - 100));

	monster.x = 32 + (Math.random() * (canvas.width - 100));
	monster.y = 32 + (Math.random() * (canvas.height - 100));

	arrMonster=[];
	var pushMonster = 0;
	while(pushMonster < numMonster){
			monster= {}
			monster.x = 32 + (Math.random() * (canvas.width - 80));
			monster.y = 32 + (Math.random() * (canvas.height - 80));
			pushMonster++;

			if(hero.x <= (monster.x + 16)
			&& monster.x <= (hero.x + 16)
			&& hero.y <= (monster.y + 16)
			&& monster.y <= (hero.y + 32) || monster.x <= (princess.x + 16)
			&& princess.x <= (monster.x + 16)
			&& monster.y <= (princess.y + 16)
			&& princess.y <= (monster.y + 32)){
				pushMonster--;
			}else{
				arrMonster.push(monster);
			}
	}

	arrStone=[];
	var pushStone = 0;
	while(pushStone < numStone){
			stone= {}
			stone.x = 32 + (Math.random() * (canvas.width - 80));
			stone.y = 32 + (Math.random() * (canvas.height - 80));
			pushStone++;

			if(hero.x <= (stone.x + 32)
			&& stone.x <= (hero.x + 32)
			&& hero.y <= (stone.y + 32)
			&& stone.y <= (hero.y + 32) || stone.x <= (princess.x + 32)
			&& princess.x <= (stone.x + 32)
			&& stone.y <= (princess.y + 32)
			&& princess.y <= (stone.y + 32)){
				pushStone--;
			}else{
				arrStone.push(stone);
			}
	}

};

var touchStone = function(heroAux){
	for (var i = 0; i < arrStone.length; i++) {
			if (arrStone[i].x <= (heroAux.x + 32)
			&& heroAux.x <= (arrStone[i].x + 32)
			&& arrStone[i].y <= (heroAux.y + 32)
			&& heroAux.y <= (arrStone[i].y + 32)){
				return true
			}
	}
	return false
}
// Update game objects
var update = function (modifier) {
	var heroAux = {}
	if (38 in keysDown) { // Player holding up
		heroAux.y = hero.y - hero.speed * modifier;
		heroAux.x = hero.x;
		if(heroAux.y<=34 ||touchStone(heroAux)){
				hero.y = hero.y;
		}else{
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		heroAux.y = hero.y + hero.speed * modifier;
		heroAux.x = hero.x;
		if(heroAux.y >=415 || touchStone(heroAux)){
				hero.y = hero.y;
		}else{
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		heroAux.x = hero.x - hero.speed * modifier;
		heroAux.y = hero.y;
		if(heroAux.x<=32 || touchStone(heroAux)){
				hero.x = hero.x;
		}else{
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		heroAux.x = hero.x + hero.speed * modifier;
		heroAux.y = hero.y;
		if(heroAux.x>=455 || touchStone(heroAux)){
				hero.x = hero.x;
		}else{
			hero.x += hero.speed * modifier;
		}
	}


	for (var i = 0; i < arrMonster.length; i++) {
		if(hero.x <= (arrMonster[i].x + 16)
		&& arrMonster[i].x <= (hero.x + 16)
		&& hero.y <= (arrMonster[i].y + 16)
		&& arrMonster[i].y <= (hero.y + 32)){
			alert("perdiste");
			localStorage.setItem('princessesCaught',0);
			localStorage.setItem('numStonestone',0);
			localStorage.setItem('arrStonestone',[]);
			localStorage.setItem('numMonster',0);
			localStorage.setItem('arrMonster',[]);
			location.reload();
		}
	}


	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		localStorage.setItem('princessesCaught',princessesCaught);
		localStorage.setItem('numStonestone',numStonestone);
		localStorage.setItem('arrStonestone',arrStonestone);
		localStorage.setItem('numMonster',numMonster);
		localStorage.setItem('arrMonster',arrMonster);
	{
		if (princessesCaught <= 3){
		 		numStone= 4;
			}else if (princessesCaught > 3 && princessesCaught <= 8) {
				numStone = 8;
				numMonster = 6
			}else if (princessesCaught > 8 && princessesCaught <= 12){
				numStone = 12;
				numMonster = 10;
			}else{
				numStone = 15;
			}
		}
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		for (var i = 0; i < arrStone.length; i++) {
			ctx.drawImage(stoneImage,arrStone[i].x, arrStone[i].y);
		}

	}

	if (monsterReady) {
		for (var i = 0; i < arrMonster.length; i++) {
			ctx.drawImage(monsterImage,arrMonster[i].x, arrMonster[i].y);
		}

	}
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
