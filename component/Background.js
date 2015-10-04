/**
 * Created by tungnt on 26/09/2015.
 */
 'use strict';
 
var Background = (function () {
    var resourcePath = "resource/background.png";

    return {
        getResourcePath: function(){
            return resourcePath;
        },
        create : function(resourceFactory, width, height) {
            var background = new Factory.Shape();
            background.graphics.beginBitmapFill(resourceFactory.getResult(ResourceName.BACK_GROUND, false));
            background.graphics.drawRect(0, 0, width, height);

            return background;
        }
    }
}());