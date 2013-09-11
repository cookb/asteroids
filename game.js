(function (root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});
	// now can generate new asteroids by hitting 'g' key
	// other specials? (shield / intangible, missiles, etc)
	// can implement intangible easily now (just add to intangibleTime / recharge)

	screenWidth = 960;
	screenHeight = 640;

	var Game = Asteroids.Game = function(){
		this.canvas = document.createElement('canvas');
		this.canvas.id = "gameCanvas";
		this.canvas.width = screenWidth;
		this.canvas.height = screenHeight;
		this.gameOver = false;
		this.musicTimer = 0;
		this.lives = 3;
		this.score = 0;
		this.extraLifePoints = 10000;
		this.nextLifeScore = 10000;
		this.warpDisplay = "";
		this.intangibleDisplay = "";

		document.getElementById("gameContent").appendChild(this.canvas);
		this.canvasContext = this.canvas.getContext("2d");

		this.ship = new Asteroids.Ship(this.canvas.width / 2, this.canvas.height / 2, 15);
		this.asteroids = [];
		this.asteroidCount = 1;
		this.maxBullets = 4;
		this.randomAsteroids(this.asteroidCount);
		this.bullets = [];

		// sounds
		this.fireSound = new Howl({ urls: ['./sounds/fire.wav'] });
		this.thrustSound = new Howl({ urls: ['./sounds/thrust.wav'] });
		this.explosionSound = new Howl({ urls: ['./sounds/explosion.wav'] });
		this.beat1Sound = new Howl({ urls: ['./sounds/beat1.wav'] });
		this.beat2Sound = new Howl({ urls: ['./sounds/beat2.wav'] });
		this.warpSound = new Howl({ urls: ['./sounds/warp.wav'] });			
		this.warpChargedSound = new Howl({ urls: ['./sounds/warp_charged.wav'] });
		this.levelSound = new Howl({ urls: ['./sounds/next_level.wav'] });	
		this.loseLifeSound = new Howl({ urls: ['./sounds/game_over.wav'] });
		this.extraLifeSound = new Howl({ urls: ['./sounds/life.wav'] });
	};

	Game.prototype.bindKeys = function () {
		var that = this;
		
		root.key('left', function() { that.ship.rotation -= 10; });
		root.key('right', function() { that.ship.rotation += 10; });
		root.key('down', function() { that.ship.rotation += 180; });
		root.key('up', function() {
			that.ship.velocity["x"] += that.ship.power * Math.sin(that.ship.rotation * Math.PI / 180);
			that.ship.velocity["y"] -= that.ship.power * Math.cos(that.ship.rotation * Math.PI / 180);
			that.thrustSound.play();
		});
		
		root.key('space', function () {
			if (that.bullets.length < that.maxBullets) {
				that.bullets.push(new Asteroids.Bullet(
					that.ship.position["x"], that.ship.position["y"], 
					that.ship.velocity["x"], that.ship.velocity["y"], 
					that.ship.rotation)
				);
				that.fireSound.play();
			}
		});
		
		root.key('enter', function () { 
			if (that.ship.warpCharge > that.ship.warpCharged) {
				that.ship.position["x"] = Math.random() * that.canvas.width;
				that.ship.position["y"] = Math.random() * that.canvas.height;
				that.ship.velocity["x"] = 0; 
				that.ship.velocity["y"] = 0;
				that.ship.warpCharge = 0;
				that.warpDisplay = "";
				that.warpSound.play();
			}	
		});
		
		root.key('g', function () {
			that.randomAsteroids(1);
		});
	};

	Game.prototype.randomAsteroids = function (number) {
		for (var i = 0; i < number; i++) {
			newRoid = new Asteroids.Asteroid(
				Math.random() * this.canvas.width,
				Math.random() * this.canvas.height,
				(Math.random() * 6) - 3,
				(Math.random() * 6) - 3,
				40);
			if (this.ship.isHit(newRoid, 90)) {
				i--;
			}	else {
				this.asteroids.push(newRoid);
			} 
		}
	};
	
	Game.prototype.music = function () {
		this.musicTimer++;
		if (this.musicTimer == 40) {
			this.beat1Sound.play();
		} else if (this.musicTimer == 80) {
			this.beat2Sound.play();
			this.musicTimer = 0;
		}
	};

	Game.prototype.levelTest = function () {
		if (this.asteroids.length <= 0) {
			this.asteroidCount++;
			this.randomAsteroids(this.asteroidCount);
			this.levelSound.play();
		}
	};
	
	Game.prototype.updateAsteroidPositions = function () {
		for (var i = 0, roids = this.asteroids.length; i < roids; i++) {
			this.asteroids[i].update();
		}
	};
	
	Game.prototype.updateBullets = function () {
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			this.bullets[i].update();
			this.bullets[i].lifetime--;
			if(this.bullets[i].isOffScreen() || this.bullets[i].lifetime < 0) {
				this.bullets.splice(i, 1);
				i--;
			}
		}
	};
	
	Game.prototype.updateShip = function () {
		this.ship.update();
		this.ship.limitSpeed();
		
		if (this.ship.warpCharge === this.ship.warpCharged) { 
			this.warpChargedSound.play();
			this.warpDisplay = "W";
			this.ship.warpCharge++;
		} else if (this.ship.warpCharge < this.ship.warpCharged) {
			this.ship.warpCharge++; 
		}
		
		if (this.ship.intangibleTime > 0) { this.ship.intangibleTime--; }

		for (var i = 0, roids = this.asteroids.length; i < roids; i++) {
			if (this.ship.isHit(this.asteroids[i], this.asteroids[i].radius)) {
				this.lives--;
				this.loseLifeSound.play();
				if (this.lives === 0) {
					this.gameOver = true;
				} else {
					this.ship = new Asteroids.Ship(this.canvas.width / 2, this.canvas.height / 2, 15);
					this.ship.intangibleTime = 50;
				}
			}
		}
	};
	
	Game.prototype.updateAsteroidHits = function () {
		for (var i = 0; i < this.asteroids.length; i++) {
			for (var j = 0; j < this.bullets.length; j++) {
				if (this.asteroids[i].isHit(this.bullets[j])) {
					this.score += 2000 / this.asteroids[i].radius;
					this.asteroids[i].fragment(this.asteroids);
					this.explosionSound.play();
					this.asteroids.splice(i, 1);
					this.bullets.splice(j, 1);
					i--;
					j--;
				}
			}
		}
	};

	Game.prototype.updateLives = function () {
		if (this.score > this.nextLifeScore ) {
			this.lives++;
			this.nextLifeScore += this.extraLifePoints;
			this.extraLifeSound.play();
		}
	};

	Game.prototype.update = function () {
		if (!this.gameOver) {
			this.music();
			this.levelTest();
			this.updateAsteroidPositions();
			this.updateBullets();
			this.updateShip();
			this.updateAsteroidHits();
			this.updateLives();
		}
	}

	Game.prototype.draw = function () {
		this.canvasContext.fillStyle = "black";
		this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.canvasContext.fillStyle = "white";
		this.canvasContext.font = "30pt Arial";
		var gameText = this.score + " x" + this.lives + " " + this.warpDisplay;
		this.canvasContext.fillText(gameText, 20, 50);

		for (var i = 0, roids = this.asteroids.length; i < roids; i++) {
			this.asteroids[i].draw(this.canvasContext);
		}
		
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			this.bullets[i].draw(this.canvasContext);
		}
		
		if (this.gameOver) {
			this.canvasContext.fillStyle = "red";
			this.canvasContext.font = "40pt Arial";
			this.canvasContext.fillText("GAME OVER", 325, 300);
			clearInterval(gameLoop);
		} else {
			this.ship.draw(this.canvasContext);
		}
	}
	
	Game.prototype.step = function () {
		this.update();
		this.draw();
	};
})(this);

game = new Asteroids.Game();
game.bindKeys();
gameLoop = setInterval((function() { game.step(); }), 33);