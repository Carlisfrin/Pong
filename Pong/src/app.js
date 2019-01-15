scorePlayer=0;
scoreCPU=0;
var difficulty_level = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};
difficulty = difficulty_level.EASY;


var MenuLayer = cc.LayerColor.extend({

    init:function(){

        // Creates the buttons
        var resumeButton = new cc.MenuItemFont("RESUME", this.pressResume, this);
        var easyButton = new cc.MenuItemFont("CHANGE TO EASY MODE", this.pressEasy, this);
        var mediumButton = new cc.MenuItemFont("CHANGE TO MEDIUM MODE", this.pressMedium, this);
        var hardButton = new cc.MenuItemFont("CHANGE TO HARD MODE", this.pressHard, this);

        // Sets the position of the buttons
        resumeButton.setPosition(cc.winSize.width/2,cc.winSize.height/2+75);
        easyButton.setPosition(cc.winSize.width/2,cc.winSize.height/2+25);
        mediumButton.setPosition(cc.winSize.width/2,cc.winSize.height/2-25);
        hardButton.setPosition(cc.winSize.width/2,cc.winSize.height/2-75);

        // Creates the menu
        var menu = new cc.Menu(resumeButton, easyButton, mediumButton, hardButton);
        menu.setPosition(0,0);
        this.addChild(menu);

        return this;
    },
    pressResume:function () {
        // Resumes the game
        this.removeFromParent();
    },
    pressEasy:function () {
        // Changes difficulty to easy
        scorePlayer=0;
        scoreCPU=0;
        difficulty = difficulty_level.EASY;
        this.removeFromParent();
    },
    pressMedium:function () {
        // Changes difficulty to medium
        scorePlayer=0;
        scoreCPU=0;
        difficulty = difficulty_level.MEDIUM;
        this.removeFromParent();
    },
    pressHard:function () {
        // Changes difficulty to hard
        scorePlayer=0;
        scoreCPU=0;
        difficulty = difficulty_level.HARD;
        this.removeFromParent();
    }
});

var GameLayer = cc.Layer.extend({
    spriteBall:null,
    spritePlayer:null,
    spriteCPU:null,
    speedPlayer:null,
    speedBallX:null,
    speedBallY:null,
    upperBound:null,
    lowerBound:null,
    speedCPU:null,
    ctor:function () {

        this._super();

        // Creates ball sprite
        this.spriteBall = cc.Sprite.create( res.ball_png );
        this.spriteBall.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild( this.spriteBall );

        // Creates player paddle sprite
        this.spritePlayer = cc.Sprite.create( res.paddle_png );
        this.spritePlayer.setPosition(cc.winSize.width/20,cc.winSize.height/2);
        this.addChild( this.spritePlayer );

        // Creates CPU paddle sprite
        this.spriteCPU = cc.Sprite.create( res.paddle_png );
        this.spriteCPU.setPosition(cc.winSize.width*19/20,cc.winSize.height/2);
        this.addChild( this.spriteCPU );

        // Initialize variables
        this.speedPlayer = 0;
        this.speedCPU = 0;
        this.speedBallX = 4;
        this.speedBallY = 4;

        // Sets the position of the boundaries
        this.upperBound = cc.winSize.height - this.spritePlayer.height;
        this.lowerBound = this.spritePlayer.height;

        // Listener for keyboard
        cc.eventManager.addListener({
              event: cc.EventListener.KEYBOARD,
              onKeyPressed: this.keyDown,
              onKeyReleased: this.keyUp
        }, this)

        this.scheduleUpdate();

        return true;
    },



    keyDown: function ( keyCode, event ) {
        // Resume the game in case it was paused
        cc.director.resume();
        if (keyCode==38){
            // Up key
            event.getCurrentTarget().speedPlayer = 8;
        }
        if (keyCode==40){
            // Down key
            event.getCurrentTarget().speedPlayer = -8;
        }
        if (keyCode==27){
            // Escape key, pauses the game and shows the menu
            cc.director.pause();
            var layerMenu = new MenuLayer();
            layerMenu.init();
            cc.director.getRunningScene().addChild(layerMenu);
        }
    },

    keyUp: function ( keyCode, event ) {
        // When the user stops pressing an arrow, the player paddle stops moving
        if (keyCode==38 || keyCode==40){
            event.getCurrentTarget().speedPlayer = 0;
        }
    },

    score: function (){
        if (this.spriteBall.x > this.spriteCPU.x){
            // Player scores
            this.spriteBall.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            scorePlayer = scorePlayer + 1;
            if (difficulty==difficulty_level.EASY){
                this.spriteCPU.y = cc.winSize.height/2;
                this.speedBallY = 4;
            }
        } else if (this.spriteBall.x < this.spritePlayer.x){
            // CPU scores
            this.spriteBall.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            scoreCPU = scoreCPU + 1;
            if (difficulty==difficulty_level.EASY){
                this.spriteCPU.y = cc.winSize.height/2;
                this.speedBallY = 4;
            }
        }
    },



    update: function (){

        // Player movement
        if (((this.spritePlayer.y + this.speedPlayer + this.spritePlayer.height/2) < this.upperBound) && ((this.spritePlayer.y + this.speedPlayer - this.spritePlayer.height/2) > this.lowerBound)) {
            this.spritePlayer.y = this.spritePlayer.y + this.speedPlayer;
        }

        // CPU movement depends on difficulty
        switch (difficulty){
            case difficulty_level.EASY:
                // CPU moves the same direction that the ball is moving
                if (this.speedBallX<0){
                    this.speedCPU = 0;
                } else if (this.speedBallY>0){
                    this.speedCPU = 3;
                } else if (this.speedBallY<0){
                    this.speedCPU = -3;
                } else {
                    this.speedCPU = 0;
                }
                break;
            case difficulty_level.MEDIUM:
                // CPU moves to the place where the ball is
                if (this.speedBallX<0){
                    this.speedCPU = 0;
                } else if (this.spriteBall.y>this.spriteCPU.y){
                    this.speedCPU = 4;
                } else if (this.spriteBall.y<this.spriteCPU.y){
                    this.speedCPU = -4;
                } else {
                    this.speedCPU = 0;
                }
                break;
            case difficulty_level.HARD:
                // CPU moves like in medium but tries to hit the ball with the side
                console.log(this.spriteCPU.x+" "+this.spriteBall.x);
                if (this.speedBallX<0){
                    this.speedCPU = 0;
                } else if (this.spriteBall.y>this.spriteCPU.y){
                    this.speedCPU = 4;
                } else if (this.spriteBall.y<this.spriteCPU.y){
                    this.speedCPU = -4;
                } else if (this.spriteCPU.x-this.spriteBall.x<4) {
                    this.speedCPU = -2;
                } else {
                    this.speedCPU = 0;
                }
                break;
        }
        if (((this.spriteCPU.y + this.speedCPU + this.spriteCPU.height/2) < this.upperBound) && ((this.spriteCPU.y + this.speedCPU - this.spriteCPU.height/2) > this.lowerBound)) {
            this.spriteCPU.y = this.spriteCPU.y + this.speedCPU;
        }


        // Collision between ball and wall
        if (((this.spriteBall.y + this.speedBallY + this.spriteBall.height/2) > this.upperBound) || ((this.spriteBall.y + this.speedBallY - this.spriteBall.height/2) < this.lowerBound)) {
            this.speedBallY = -1 * this.speedBallY;
        }

        // Collision between ball and paddles
        var areaBall = this.spriteBall.getBoundingBox();
        var areaPlayer = this.spritePlayer.getBoundingBox();
        var areaCPU = this.spriteCPU.getBoundingBox();
        if( cc.rectIntersectsRect(areaBall, areaPlayer)){
            this.speedBallY = ( this.spriteBall.y - this.spritePlayer.y ) / 5;
            this.speedBallX =  -1 * this.speedBallX;
        } else if (cc.rectIntersectsRect(areaBall, areaCPU)) {
            this.speedBallY = ( this.spriteBall.y - this.spriteCPU.y ) / 5;
            this.speedBallX =  -1 * this.speedBallX;
        }

        // Ball movement
        this.spriteBall.x = this.spriteBall.x + this.speedBallX;
        this.spriteBall.y = this.spriteBall.y + this.speedBallY;

        // Score detection
        this.score();

    }
});


var BackLayer = cc.Layer.extend({
    scoreBoard:null,
    ctor:function () {
        this._super();

        // Background sprite
        var spriteBack = cc.Sprite.create( res.pongbg_png );
        spriteBack.setScale(cc.winSize.width/spriteBack.width, cc.winSize.height/spriteBack.height);
        spriteBack.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild( spriteBack );

        // Scoreboard sprite
        this.scoreBoard = cc.LabelTTF.create("", res.font_ttf, 60, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        this.scoreBoard.setPosition(cc.winSize.width/2,cc.winSize.height*4/5);
        this.addChild(this.scoreBoard);

        this.scheduleUpdate();

        return true;
    },

    update:function(){
        // Scoreboard update
        this.scoreBoard.setString(scorePlayer + "          " + scoreCPU);
    }
});


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layerBack = new BackLayer();
        var layer = new GameLayer();
        this.addChild(layerBack);
        this.addChild(layer);
    }
});

