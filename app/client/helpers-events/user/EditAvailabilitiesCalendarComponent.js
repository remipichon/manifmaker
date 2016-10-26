import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {CalendarServiceClient} from "../../../client/service/CalendarServiceClient"
import {ReadAvailabilitiesCalendarComponent} from "./ReadAvailabilitiesCalendarComponent"

class EditAvailabilitiesCalendarComponent extends ReadAvailabilitiesCalendarComponent {
    /* available in data
     this.data().parentInstance

     */

    events() {
        return super.events().concat({
            'mousedown .quart_heure:not(.no-action)': this.startSelectAvailability,
            'mouseenter .quart_heure': this.selectAvailability,
            'mouseup .quart_heure': this.endSelectAvailability,
            'mouseleave .jours': this.resetSelect,
            'dblclick .quart_heure': this.removeAvailability,
        });
    }

    startSelectAvailability(event){
        event.stopPropagation();
        var date = new moment($(event.target).attr("quarter"));
        this.startDate.set(date);
        //this.hasDragged = true;
        this.tempEndDate.set(date);
        console.log("start",this.startDate.get().toDate(),this.tempEndDate.get().toDate());

    }

    selectAvailability(event){
        event.stopPropagation();
        if(!this.startDate.get()) return;
        var date = new moment($(event.target).attr("quarter")).add(this.addHourAccordingToAccuracy(),"hour");
        this.hasDragged = true;
        this.tempEndDate.set(date);
        console.log("select",this.startDate.get().toDate(),this.tempEndDate.get().toDate());
    }

    endSelectAvailability(event){
        event.stopPropagation();
        if(!this.startDate.get() || !this.hasDragged) return;
        var date;
        if($(event.target).hasClass("creneau")) //user end selecting on an existing availabilities
            date = new moment($(event.target).parent().attr("quarter"));
        else
            date = new moment($(event.target).attr("quarter")).add(this.addHourAccordingToAccuracy(),"hour");;
        var user = this.parentComponent().parentComponent().data();
        var temp = this.startDate.get();
        this.resetSelect();
        AvailabilityService.addAvailabilities(user,temp.toDate(),date.toDate())
    }

    resetSelect(){
        this.startDate.set(null);
        this.hasDragged = false;
        this.tempEndDate.set(null);
    }

    removeAvailability(event){
        this.resetSelect();
        sAlert.closeAll();
        event.stopPropagation();
        var start = new moment($(event.target).attr("quarter"));
        var user = this.parentComponent().parentComponent().data();
        var end = new moment(start).add(this.addHourAccordingToAccuracy(),"hour");
        AvailabilityService.removeAvailabilities(user,start.toDate(),end.toDate());
    }

    addHourAccordingToAccuracy(){
        return AssignmentCalendarDisplayedAccuracy.findOne().accuracy
    }

    creanOnClick() {
        //to implement
    }

    quartHeureOnClick(event) {
        //to implement

        sAlert.info('Add availabilities by selecting slots with your mouse pressed or double click to remove one slot.');
        return;

        //TODO proposer de switcher sur ce mode si besoin, default sur mobile
        var date = new moment($(event.target).attr("quarter"));

        if(!this.startDate.get())
            this.startDate.set(date);
        else {
            var endDate = date;
            var user = this.parentComponent().parentComponent().data();
            AvailabilityService.addAvailabilities(user,this.startDate.get().toDate(),endDate.toDate())
            this.startDate.set(null);
        }
    }

    //works for .heure et .quart d'heure
    isSelected(date, timeHours) {
        if(!this.startDate.get() || !this.tempEndDate.get()) return;

        var quarter = this.currentData().quarter;
        var current = this.getCalendarDateTime(date, timeHours, quarter);
        var start = this.startDate.get();
        var end = this.tempEndDate.get();
        if(current.isBetween(start,end) || current.isSame(start))
            return "selected";
        return ""
    }


    timeSlot(date, timeHours, idTask) {
        var quarter = this.currentData().quarter;

        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours,quarter);
        var user = this.data().user;
        if (!user) return [];

        var data = CalendarServiceClient.computeAvailabilitiesData(user,startCalendarTimeSlot);
        if(!data) return [];
        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }

    constructor() {
        super();

        this.startDate = new ReactiveVar(null);
        this.tempEndDate = new ReactiveVar(null);
    }
}

EditAvailabilitiesCalendarComponent.register("EditAvailabilitiesCalendarComponent");