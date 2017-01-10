import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

class CommonNavbar extends BlazeComponent {

    lastUpdateDate() {
        var updateInfo =  UpdateInfo.find({}).fetch();
        var lastInfo = updateInfo[updateInfo.length - 1];
        var lastDate = new moment(lastInfo.date);
        var now = new moment();

        //highlight effect
        var startOpacity = 0.6;
        var opacity = startOpacity;
        var duration = 3000; //miliseconds
        var delay, step;
        var step = 0.01;
        var numberOfSteps = 0.6 / step;
        var delay = duration / numberOfSteps;

        var highlightEffect = setInterval(_.bind(function(){
            opacity = opacity - step;
            this.$(".lastUpdate").css("background",`rgba(57, 241, 44, ${opacity})`)
            if(opacity <= 0){
                clearInterval(highlightEffect);
            }

        },this), delay);



        return lastDate.toDate();
    }




}

CommonNavbar.register("CommonNavbar");

