'use strict';

var Factory = createjs;

var FlappyBird = (function() {
    var game, restartBtn;

    var started = false;
    var startJump = false;
    var scoreShow = false;
    var dead = false;
    var pipeDistance = PIPE_DISTANCE;

    function init() {
        Environment.setup();

        Environment.getResourceFactory().addEventListener(Event.COMPLETE, completeCallback);
    }
    function completeCallback(){
        Environment.onCompleted();

        game = Environment.getGlobalVariables();

        Factory.Ticker.timingMode = Factory.Ticker.RAF;
        Factory.Ticker.addEventListener(Event.TICK, tickListener);
        game.frame.addEventListener(Event.MOUSE_DOWN, handleJumpStart);
        document.onkeydown = handleKeyDown;
    }

    function handleKeyDown(e) {
        switch(e.keyCode) {
            case SPACE_KEY: handleJumpStart(); break;
            case ENTER:
                if(dead) restart();
                break;
        }
    }
    function handleJumpStart() {
        if (dead) return;

        Factory.Tween.removeTweens(game.bird);
        startJump = true;
        if (!started) {
            started = true;
            scoreShow = true;
        }
    }

    function tickListener(event) {
        var scrollAnimationSpeed = event.delta / 1000 * 300; // animation speed
        var pipesChildNum = game.pipes.numChildren;

        if (game.bird.y > (game.floor.y - 40)) {
            if (!dead) die();

            if (game.bird.y > (game.floor.y - 30)) {
                Factory.Tween.removeTweens(game.bird);
            }
        }

        if (startJump) {
            startJump = false;
            Bird.fly();
            Bird.jump(game);
        }

        if (started && !dead) {
            // environment.floor scroll animation
            game.floor.x = (game.floor.x - scrollAnimationSpeed) % game.floor.tileW;

            if (pipeDistance === 0) {
                game.pipe = new Factory.Bitmap(game.resource.getResult(ResourceName.PIPE));
                game.pipe.x = game.frameWidth + 600;
                game.pipe.y = (game.floor.y - GAP * 2) * Math.random() + GAP * 1.5;
                game.pipes.addChild(game.pipe);

                var pipeRotated = new Factory.Bitmap(game.resource.getResult(ResourceName.PIPE));
                pipeRotated.scaleX = -1;
                pipeRotated.rotation = 180; // rotate 180
                pipeRotated.x = game.pipe.x;
                pipeRotated.y = game.pipe.y - GAP;
                game.pipes.addChild(pipeRotated);

                pipeDistance = MASTER_PIPE_DISTANCE;
            } else {
                pipeDistance--;
            }

            for (var pIndex = 0; pIndex < pipesChildNum; pIndex++) {
                game.pipe = game.pipes.getChildAt(pIndex);
                if (!game.pipe) {
                    continue;
                }

                // validator of collision
                var collision = ndgmr.checkRectCollision(game.pipe, game.bird);
                if (collision && (!(collision.width < 8 || collision.height < 8))) { // if bird hit on pipe
                    die();
                }

                game.pipe.x = (game.pipe.x - scrollAnimationSpeed);
                // if bird pass the pipe, increase score
                if (game.pipe.x <= (338 - 138) && game.pipe.rotation == 0 && !game.pipe.isPassed) {
                    game.pipe.isPassed = true;
                    game.score.text = game.scoreOutline.text = parseInt(game.score.text) + 1;
                }

                // remove pipe that get out of screen
                if (game.pipe.x + game.pipe.image.width <= -game.pipe.w) {
                    game.pipes.removeChild(game.pipe);
                }
            }
            if (scoreShow) {
                game.score.alpha = 1;
                game.scoreOutline.alpha = 1;
                scoreShow = false;
            }
        }

        game.frame.update(event);
    }

    function die() {
        // set die status
        dead = true;

        Bird.dive();
        Bird.dead();
        
        // Flash the screen
        Factory.Tween.get(game.frame)
            .to({alpha:0}, 100, Factory.Ease.linear) // set screen to white in 0.1 second
            .to({alpha:1}, 100, Factory.Ease.linear); // reset screen to normal

        // Create and show restart button
        restartBtn = new Factory.Bitmap(game.resource.getResult(ResourceName.RESTART_BUTTON));
        restartBtn.alpha = 0;
        restartBtn.x = (game.frameWidth/2) - (restartBtn.image.width/2);
        restartBtn.y = (game.frameHeight/2) - (restartBtn.image.height/2) - 150;

        game.frame.addChild(restartBtn);
        Factory.Tween.get(restartBtn)
            .to({alpha:1, y: restartBtn.y + 50}, 400, createjs.Ease.sineIn)
            .call(function(){ restartBtn.addEventListener(Event.CLICK, restart); }, [], {});
    }
    function restart() {
        // reset screen
        Factory.Tween.get(restartBtn)
            .to({y:restartBtn.y + 10}, 50, Factory.Ease.sineIn)
            .call(function(){ game.frame.removeChild(restartBtn); }, [], {});

        scoreShow = false;
        pipeDistance = MASTER_PIPE_DISTANCE;
        dead = false;
        started = false;
        startJump = false;

        Pipe.reset(game);
        Score.reset(game);
        Bird.reset(game.frameWidth, game.frameHeight);
    }

    return {
        init : function () {
            init();
        }
    };
}());