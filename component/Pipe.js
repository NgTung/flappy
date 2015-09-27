/**
 * Created by tungnt on 26/09/2015.
 */
var Pipe = (function(){
    var resourcePath = "resource/pipe.png";
    return {
        getResourcePath: function() {
            return resourcePath;
        },
        create : function () {
            return new Factory.Container();
        }
    }
}());