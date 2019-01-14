
var BackLayer = cc.Layer.extend({
    spriteBack:null,
    ctor:function () {
        this._super();

        this.spriteBack = cc.Sprite.create( res.pongbg_png );
        this.spriteBack.setScale(cc.winSize.width/this.spriteBack.width, cc.winSize.height/this.spriteBack.height);
        this.spriteBack.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild( this.spriteBack );

        return true;
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
        this.speedBallX = 1;
        this.speedBallY = 1;

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
            event.getCurrentTarget().speedPlayer = 4;
        }
        if (keyCode==40){
            event.getCurrentTarget().speedPlayer = -4;
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



    update: function (){

        // Colisión jugador-pared
        if (((this.spritePlayer.y + this.speedPlayer + this.spritePlayer.height/2) < this.upperBound) && ((this.spritePlayer.y + this.speedPlayer - this.spritePlayer.height/2) > this.lowerBound)) {
            this.spritePlayer.y = this.spritePlayer.y + this.speedPlayer;
        }
        // Colisión pelota-pared
        if (((this.spriteBall.y + this.speedBallY + this.spriteBall.height/2) > this.upperBound) || ((this.spriteBall.y + this.speedBallY - this.spriteBall.height/2) < this.lowerBound)) {
            this.speedBallY = -1 * this.speedBallY;
        }
        // Movimiento pelota
        this.spriteBall.x = this.spriteBall.x + this.speedBallX;
        this.spriteBall.y = this.spriteBall.y + this.speedBallY;

        // Punto


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

