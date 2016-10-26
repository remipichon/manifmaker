import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

export class BaseCalendarComponent extends BlazeComponent{

    enableAction(){
        //to implement
        return true;
    }

    creanOnClick() {
        //to implement
    }

    quartHeureOnClick(event) {
        //to implement
    }

    quartHeureNoActionOnClick(event) {
            sAlert.info("There is no action at this date, please select another one")
    }

    timeSlot(date, timeHours, idTask) {
        //to implement
    }

    constructor() {
        super();
    }

    template() {
        return "baseCalendarComponent";
    }

    events() {
        return [
            {
                "click  .quart_heure:not(.no-action)": this.quartHeureOnClick,
                "click  .quart_heure.no-action": this.quartHeureNoActionOnClick,
                "click .creneau": this.creanOnClick
            }
        ]
    }

    assignmentType() {
        return AssignmentReactiveVars.CurrentAssignmentType.get();
    }

    days() {
        return AssignmentCalendarDisplayedDays.find({});
    }

    hours() {
        return AssignmentCalendarDisplayedHours.find({});
    }

    quarter() {
        return AssignmentCalendarDisplayedQuarter.find({});
    }

    displayCalendarTitleDate(date) {
        return new moment(date).format("dddd DD/MM");
    }

    hoursDate(date) {
        return this.getCalendarDateHours(date, this.currentData().date);
    }

    quarterDate(date, timeHours) {
        return this.getCalendarDateTime(date, timeHours, this.currentData().quarter);
    }

    //labelSkills() {
    //    return Skills.findOne({_id: this.currentData().toString()}).label;
    //}

    //userName() {
    //    return Users.findOne({_id: this.currentData().userId}).name;
    //}
    //
    //teamName() {
    //    return Teams.findOne({_id: this.currentData().teamId}).name;
    //}
    //


    sideHoursHeight() {
        switch (AssignmentCalendarDisplayedAccuracy.findOne({}).accuracy) {
            case 0.25 :
                return "oneHour";
            case  0.5 :
                return "oneHour";
            case 1:
                return "oneHour";
            case  2:
                return "twoHour"
            case 4:
                return "fourHour"
        }
    }

    quarterHeight() {
        switch (AssignmentCalendarDisplayedAccuracy.findOne({}).accuracy) {
            case 0.25 :
                return "quarterHour";
            case  0.5 :
                return "halfHour";
            case 1:
                return "oneHour";
            case  2:
                return "twoHour"
            case 4:
                return "fourHour"
        }
    }

    //works for .heure et .quart d'heure
    isSelected(date, timeHours) {
        return ""
    }


    getCalendarDateHours(date, timeHours) {
        var date = new moment(date);
        date.hours(timeHours);
        return date;
    }

    getCalendarDateTime(date, timeHours, timeMinutes) {
        var dateWithHours = this.getCalendarDateHours(date, timeHours);
        var date = new moment(dateWithHours);
        date.add(timeMinutes,"minute");
        return date;
    }

}

BaseCalendarComponent.register("BaseCalendarComponent");