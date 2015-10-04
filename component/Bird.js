/**
 * Created by tungnt on 26/09/2015.
 */
'use strict';

var Bird = (function () {
    var resourcePath = "resource/bird.png";
    var bird;

    return {
        getResourcePath : function (){
            return resourcePath;
        },
        create : function (resourceFactory, positionX, positionY) {
            var birdSetting = new Factory.SpriteSheet({
                "images": [resourceFactory.getResult(ResourceName.BIRD)],
                "frames": {"width": 92, "height": 64, "regX": 46, "regY": 32, "count": 3},
                "animations": {
                    "fly": [0, 2, Animations.FLY, 0.21],
                    "dive": [1, 1, Animations.DIVE, 1]
                }
            });
            bird = new Factory.Sprite(birdSetting, Animations.FLY);

            // Set initial position and scale 1 to 1
            bird.setTransform(positionX, positionY, 1, 1);
            bird.framerate = FRAME_RATE_ON_START;

            // Use a tween to wiggle the bird up and down using a sineInOut Ease
            Factory.Tween.get(bird, {loop: true})
                .to({y: positionX + WIGGLE}, DURATION, Factory.Ease.sineInOut)
                .to({y: positionY}, DURATION, Factory.Ease.sineInOut);

            return bird;
        },
        dive: function () {
            bird.gotoAndPlay(Animations.DIVE);
        },
        fly: function () {
            bird.framerate = FRAME_RATE_ON_PLAY;
            bird.gotoAndPlay(Animations.FLY);
        },
        jump: function (game) {
        	game.rotationDelta = bird.rotation < 0 ? (-bird.rotation - 20) / 5 : (bird.rotation + 20) / 5;

            Factory.Tween.get(bird)
                .to({y:bird.y - game.rotationDelta, rotation: - 20}, game.rotationDelta, Factory.Ease.linear) //rotate to jump position and jump bird
                .to({y:bird.y - JUMP_AMOUNT, rotation: - 20}, JUMP_TIME - game.rotationDelta, Factory.Ease.quadOut) //rotate to jump position and jump bird
                .to({y:bird.y}, JUMP_TIME, Factory.Ease.quadIn) //reverse jump for smooth arch
                .to({y:bird.y + 200, rotation: 90}, (DURATION)/1.5, Factory.Ease.linear) //rotate back
                .call(Bird.dive, [], {}) // change bird to diving position
                .to({y:game.floor.y - 30}, (game.frameHeight - (game.bird.y+200))/1.5, Factory.Ease.linear); //drop to the bedrock
        },
        dead: function(){
			Factory.Tween.removeTweens(bird);

	        // Set bird dropped on the floor
	        Factory.Tween.get(bird)
	            .to({y:bird.y + 200, rotation: 90}, (DURATION)/1.5, Factory.Ease.linear) //rotate back
	            .call(Bird.dive, [], {}) // change bird to diving position
	            .to({y:game.floor.y - 30}, (game.frameHeight - (bird.y + 200))/1.5, Factory.Ease.linear); //drop to the environment.floor
        
        },
        reset: function(frameWidth, frameHeight) {
        	Factory.Tween.removeTweens(bird);
	        bird.x = frameWidth / 2;
	        bird.y = frameHeight / 2;
	        bird.rotation = 0;

	        Factory.Tween.get(bird, {loop:true})
	            .to({y:(frameHeight / 2) + WIGGLE}, DURATION, Factory.Ease.sineInOut)
	            .to({y:(frameHeight / 2)}, DURATION, Factory.Ease.sineInOut);
        }
    }
}());