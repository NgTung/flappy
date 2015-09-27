/**
 * Created by tungnt on 27/09/2015.
 */
'use strict';

var Ground = (function (){
    var resourcePath = "resource/ground.png";
    var floor;

    return {
        getResourcePath: function () {
            return resourcePath;
        },
        create : function(resourceFactory, frameWidth, frameHeight) {
            var groundImage = resourceFactory.getResult(ResourceName.GROUND);
            floor = new Factory.Shape();
            floor.graphics.beginBitmapFill(groundImage);
            floor.graphics.drawRect(0, 0, frameWidth + groundImage.width, groundImage.height);
            floor.tileW = groundImage.width;
            floor.y = frameHeight - groundImage.height;

            return floor;
        }
    }
}());