/**
 * Created by tungnt on 27/09/2015.
 */
var Score = (function () {
    var type = {
        TEXT : "text",
        OUTLINE : "outline"
    };

    return {
        Type : type,
        create : function (scoreType, frameWidth) {
            switch (scoreType) {
                case type.TEXT:
                    var score = new Factory.Text(0, TEXT_FORMAT, WHITE);

                    score.textAlign = CENTER;
                    score.x = frameWidth / 2;
                    score.y = 100;
                    score.alpha = 1;
                    break;
                case type.OUTLINE:
                    var score = new Factory.Text(0, TEXT_FORMAT, BLACK);

                    score.outline = 5;
                    score.textAlign = CENTER;
                    score.x = frameWidth / 2;
                    score.y = 100;
                    score.alpha = 1;
                    break;
                default:
                    break;
            }

            return score;
        }
    }
}());