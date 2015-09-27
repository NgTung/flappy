/**
 * Created by tungnt on 26/09/2015.
 */
var Environment = (function() {
    // resource setting
    var resource = [
        {id:ResourceName.RESTART_BUTTON,src: Button.getResourcePath("RESTART")},
        {id:ResourceName.BACK_GROUND,   src: Background.getResourcePath()},
        {id:ResourceName.GROUND,        src: Ground.getResourcePath()},
        {id:ResourceName.BIRD,          src: Bird.getResourcePath()},
        {id:ResourceName.PIPE,          src: Pipe.getResourcePath()}
    ];

    /* Game resource */
    var bird, floor, pipe, pipes, rotationDelta, score, scoreOutline, startX, startY;
    var gameFrame, resourceFactory, frameWidth, frameHeight;

    function _preSetup(){
        gameFrame = new Factory.Stage(ResourceName.GAME_FRAME);
        resourceFactory = new Factory.LoadQueue(false);

        frameWidth = gameFrame.canvas.width;
        frameHeight = gameFrame.canvas.height;

        // Load game resource
        resourceFactory.loadManifest(resource);
    }

    function onEnvironmentCompleted() {
        createBackground();
        createPipes();
        createBird();
        createGround();
        createScoreLabel();
    }

    function createBackground() {
        gameFrame.addChild(Background.create(resourceFactory, frameWidth, frameHeight));
    }

    function createPipes() {
        pipes = Pipe.create();
        gameFrame.addChild(pipes);
    }
    function createBird() {
        bird = Bird.create(resourceFactory, (frameWidth/2), (frameHeight/3));

        gameFrame.addChild(bird);
    }
    function createGround() {
        floor = Ground.create(resourceFactory, frameWidth, frameHeight);
        gameFrame.addChild(floor);
    }
    function createScoreLabel() {
        score = Score.create(Score.Type.TEXT, frameWidth);
        scoreOutline = Score.create(Score.Type.OUTLINE, frameWidth);

        gameFrame.addChild(score, scoreOutline);
    }

    return {
        setup: function() {
            _preSetup();
        },
        getResourceFactory: function () {
            return resourceFactory
        },
        onCompleted: function(){
            onEnvironmentCompleted();
        },
        getGlobalVariables: function(){
            return {
                frame : gameFrame,
                resource : resourceFactory,
                frameWidth : frameWidth,
                frameHeight : frameHeight,
                bird : bird,
                floor : floor,
                pipe : pipe,
                pipes : pipes,
                rotationDelta : rotationDelta,
                score : score,
                scoreOutline : scoreOutline,
                startX:startX,
                startY:startY
            }
        }
    }
}());