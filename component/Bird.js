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
        }
    }
}());