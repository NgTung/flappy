'use strict';
var Factory = createjs;

var FlappyBird = (function() {
    var game, restartBtn;

    var started = false;
    var startJump = false;
    var scoreShow = false;
    var dead = false;

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
            game.rotationDelta = game.bird.rotation < 0 ? (-game.bird.rotation - 20) / 5 : (game.bird.rotation + 20) / 5;

            Factory.Tween.get(game.bird)
                .to({y:game.bird.y - game.rotationDelta, rotation: - 20}, game.rotationDelta, Factory.Ease.linear) //rotate to jump position and jump bird
                .to({y:game.bird.y - JUMP_AMOUNT, rotation: - 20}, JUMP_TIME - game.rotationDelta, Factory.Ease.quadOut) //rotate to jump position and jump bird
                .to({y:game.bird.y}, JUMP_TIME, Factory.Ease.quadIn) //reverse jump for smooth arch
                .to({y:game.bird.y + 200, rotation: 90}, (DURATION)/1.5, Factory.Ease.linear) //rotate back
                .call(Bird.dive, [], {}) // change bird to diving position
                .to({y:game.floor.y - 30}, (game.frameHeight - (game.bird.y+200))/1.5, Factory.Ease.linear); //drop to the bedrock
        }

        if (started && !dead) {
            // environment.floor scroll animation
            game.floor.x = (game.floor.x - scrollAnimationSpeed) % game.floor.tileW;

            if (PIPE_DISTANCE === 0) {
                game.pipe = new Factory.Bitmap(game.resource.getResult(ResourceName.PIPE));
                game.pipe.x = game.frameWidth + 600;
                game.pipe.y = (game.floor.y - GAP * 2) * Math.random() + GAP * 1.5;
                game.pipes.addChild(game.pipe);

                var pipeReverse = new Factory.Bitmap(game.resource.getResult(ResourceName.PIPE));
                pipeReverse.scaleX = -1;
                pipeReverse.rotation = 180; // rotate 180
                pipeReverse.x = game.pipe.x;
                pipeReverse.y = game.pipe.y - GAP;
                game.pipes.addChild(pipeReverse);

                PIPE_DISTANCE = MASTER_PIPE_DISTANCE;
            } else {
                PIPE_DISTANCE--;
            }

            for (var pIndex = 0; pIndex < pipesChildNum; pIndex++) {
                game.pipe = game.pipes.getChildAt(pIndex);
                if (!game.pipe) {
                    continue;
                }

                // validator of collision
                var collision = ndgmr.checkRectCollision(game.pipe, game.bird);
                if (collision && (!(collision.width < 8 || collision.height < 8))) { // if environment.bird hit on pipe
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
        Factory.Tween.removeTweens(game.bird);

        // Set bird dropped on the floor
        Factory.Tween.get(game.bird)
            .to({y:game.bird.y + 200, rotation: 90}, (DURATION)/1.5, Factory.Ease.linear) //rotate back
            .call(Bird.dive, [], {}) // change bird to diving position
            .to({y:game.floor.y - 30}, (game.frameHeight - (game.bird.y + 200))/1.5, Factory.Ease.linear); //drop to the environment.floor
        // Flash the screen
        Factory.Tween.get(game.frame)
            .to({alpha:0}, 100, Factory.Ease.linear)
            .to({alpha:1}, 100, Factory.Ease.linear);

        // Create and show restart button
        restartBtn = new Factory.Bitmap(game.resource.getResult(ResourceName.RESTART_BUTTON));
        restartBtn.alpha = 0;
        restartBtn.x = (game.frameWidth/2) - (restartBtn.image.width/2);
        restartBtn.y = (game.frameHeight/2) - (restartBtn.image.height/2) - 150;

        game.frame.addChild(restartBtn);
        Factory.Tween.get(restartBtn)
            .to({alpha:1, y: restartBtn.y + 50}, 400, createjs.Ease.sineIn)
            .call(restartClickListener, [], {});
    }
    function restart() {
        // reset screen
        game.pipes.removeAllChildren();

        Factory.Tween.get(restartBtn)
            .to({y:restartBtn.y + 10}, 50, Factory.Ease.sineIn)
            .call(removeStart, [], {});

        game.score.text = 0;
        game.score.alpha = 0;
        game.scoreOutline.text = 0;
        game.scoreOutline.alpha = 0;

        scoreShow = false;
        PIPE_DISTANCE = MASTER_PIPE_DISTANCE;
        dead = false;
        started = false;
        startJump = false;

        var startX = game.frameWidth / 2;
        var startY = game.frameHeight / 2;

        Factory.Tween.removeTweens(game.bird);
        game.bird.x = startX;
        game.bird.y = startY;
        game.bird.rotation = 0;

        Factory.Tween.get(game.bird, {loop:true})
            .to({y:startY + WIGGLE}, DURATION, Factory.Ease.sineInOut)
            .to({y:startY}, DURATION, Factory.Ease.sineInOut);
    }
    function removeStart() {
        game.frame.removeChild(restartBtn);
    }
    function restartClickListener() {
        restartBtn.addEventListener(Event.CLICK, restart);
    }

    return {
        init : function () {
            init();
        }
    };
}());