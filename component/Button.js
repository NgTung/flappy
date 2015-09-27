/**
 * Created by tungnt on 27/09/2015.
 */
var Button = (function (){
    var resourcePaths = {
        RESTART : 'resource/restart.png'
    }

    return {
        getResourcePath: function (type){
            if(typeof resourcePaths[type] != 'undefined') {
                return resourcePaths[type];
            }

            return "";
        }
    }
}());