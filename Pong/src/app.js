scorePlayer=0;
scoreCPU=0;
/*var difficulty_level = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};
difficulty = difficulty_level.EASY;*/

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

        this.spriteBall = cc.Sprite.create( res.ball_png );
        this.spriteBall.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild( this.spriteBall );

        this.spritePlayer = cc.Sprite.create( res.paddle_png );
        this.spritePlayer.setPosition(cc.winSize.width/20,cc.winSize.height/2);
        this.addChild( this.spritePlayer );

        this.spriteCPU = cc.Sprite.create( res.paddle_png );
        this.spriteCPU.setPosition(cc.winSize.width*19/20,cc.winSize.height/2);
        this.addChild( this.spriteCPU );

        this.speedPlayer = 0;
        this.speedCPU = 0;
        this.speedBallX = 4;
        this.speedBallY = 4;

        this.upperBound = cc.winSize.height - this.spritePlayer.height;
        this.lowerBound = this.spritePlayer.height;

        cc.eventManager.addListener({
              event: cc.EventListener.KEYBOARD,
              onKeyPressed: this.teclaPulsada,
              onKeyReleased: this.teclaLevantada
        }, this)

        this.scheduleUpdate();

        return true;
    },



    teclaPulsada: function ( keyCode, event ) {

        cc.director.resume();
        if (keyCode==38){
            event.getCurrentTarget().speedPlayer = 8;
        }
        if (keyCode==40){
            event.getCurrentTarget().speedPlayer = -8;
        }
        if (keyCode==27){
            cc.director.pause();
        }
    },

    teclaLevantada: function ( keyCode, event ) {
     
        if (keyCode==38 || keyCode==40){
            event.getCurrentTarget().speedPlayer = 0;
        }
    },

    score: function (){
        if (this.spriteBall.x > this.spriteCPU.x){
            this.spriteBall.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            scorePlayer = scorePlayer + 1;
        } else if (this.spriteBall.x < this.spritePlayer.x){
            this.spriteBall.setPosition(cc.winSize.width/2,cc.winSize.height/2);
            scoreCPU = scoreCPU + 1;
        }
    },



    update: function (){

        // Movimiento jugador
        if (((this.spritePlayer.y + this.speedPlayer + this.spritePlayer.height/2) < this.upperBound) && ((this.spritePlayer.y + this.speedPlayer - this.spritePlayer.height/2) > this.lowerBound)) {
            this.spritePlayer.y = this.spritePlayer.y + this.speedPlayer;
        }

        // Movimiento CPU
        if (this.speedBallX<0){
            this.speedCPU = 0;
        } else if (this.speedBallY+this.spriteBall.y>this.spriteCPU.y+this.spriteCPU.height/2){
            console.log("up: "+this.speedBallY+" "+this.spriteBall.y+" "+this.spriteCPU.y+" "+this.spriteCPU.height/2);
            this.speedCPU = 4;
        } else if (this.speedBallY+this.spriteBall.y<this.spriteCPU.y-this.spriteCPU.height/2){
            console.log("down: "+this.speedBallY+" "+this.spriteBall.y+" "+this.spriteCPU.y+" "+this.spriteCPU.height/2);
            this.speedCPU = -4;
        } else {
            this.speedCPU = 0;
        }
        if (((this.spriteCPU.y + this.speedCPU + this.spriteCPU.height/2) < this.upperBound) && ((this.spriteCPU.y + this.speedCPU - this.spriteCPU.height/2) > this.lowerBound)) {
            this.spriteCPU.y = this.spriteCPU.y + this.speedCPU;
        }


        // Colisión pelota-pared
        if (((this.spriteBall.y + this.speedBallY + this.spriteBall.height/2) > this.upperBound) || ((this.spriteBall.y + this.speedBallY - this.spriteBall.height/2) < this.lowerBound)) {
            this.speedBallY = -1 * this.speedBallY;
        }

        // Colisión pelota-barra
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

        // Movimiento pelota
        this.spriteBall.x = this.spriteBall.x + this.speedBallX;
        this.spriteBall.y = this.spriteBall.y + this.speedBallY;

        // Punto
        this.score();

    }
});


var BackLayer = cc.Layer.extend({
    spriteBack:null,
    scoreBoard:null,
    ctor:function () {
        this._super();

        this.spriteBack = cc.Sprite.create( res.pongbg_png );
        this.spriteBack.setScale(cc.winSize.width/this.spriteBack.width, cc.winSize.height/this.spriteBack.height);
        this.spriteBack.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild( this.spriteBack );

        this.scoreBoard = cc.LabelTTF.create("", res.font_ttf, 60, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        this.scoreBoard.setPosition(cc.winSize.width/2,cc.winSize.height*4/5);
        this.scoreBoard.retain();
        this.addChild(this.scoreBoard);

        this.scheduleUpdate();

        return true;
    },

    update:function(){
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

