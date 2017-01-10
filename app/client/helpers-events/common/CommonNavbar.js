import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

class CommonNavbar extends BlazeComponent {

    constructor() {
        super();
        this.self = this;
        this.timedUpdate();
    }

    lastUpdateDate() {
        var updateInfo = UpdateInfo.find({}).fetch();
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
        var iconTurn = 2;
        var rotationStep = iconTurn * 360 / numberOfSteps
        var rot = 0;

        var highlightEffect = setInterval(_.bind(function () {
            opacity = opacity - step;
            rot += rotationStep;
            this.$(".lastUpdate").css("background", `rgba(57, 241, 44, ${opacity})`);

            var icon = this.$(".lastUpdate .mdi");

            icon.css("-webkit-transform", `rotate(${rot}deg)`);
            icon.css("-moz-transform", `rotate(${rot}deg)`);
            icon.css("-ms-transform", `rotate(${rot}deg)`);
            icon.css("-o-transform", `rotate(${rot}deg)`);
            icon.css("transform", `rotate(${rot}deg)`);


            if (opacity <= 0) {
                clearInterval(highlightEffect);
            }

        }, this), delay);


        return lastDate.toDate();
    }


    updateClock() {
        var now = moment(),
            second = now.seconds() * 6,
            minute = now.minutes() * 6 + second / 60,
            hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;

        self.$('#hour').css("transform", "rotate(" + hour + "deg)");
        self.$('#minute').css("transform", "rotate(" + minute + "deg)");
        self.$('#second').css("transform", "rotate(" + second + "deg)");
    }

    timedUpdate() {
        this.updateClock();
        setTimeout(_.bind(this.timedUpdate, this), 1000);
    }


}

CommonNavbar.register("CommonNavbar");

