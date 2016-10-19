import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {CalendarServiceClient} from "../../../client/service/CalendarServiceClient"

class EditAvailabilitiesCalendarComponent extends BaseCalendarComponent {
    /* available in data
     this.data().parentInstance

     */

    events() {
        return super.events().concat({
            'mousedown .heure, .quart_heure"': this.startSelectAvailability,
            'mouseenter .heure, .quart_heure"': this.selectAvailability,
            'mouseup .heure, .quart_heure"': this.endSelectAvailability,
            'mouseleave .jours': this.resetSelect,
        });
    }

    startSelectAvailability(event){
        var date = new moment($(event.target).parent().attr("hours"));
        this.startDate = date;

    }

    selectAvailability(event){
        if(!this.startDate) return;
        var date = new moment($(event.target).parent().attr("hours"));
        this.hasDragged = true;
        console.log(this.startDate,date);
    }

    endSelectAvailability(event){
        if(!this.startDate || !this.hasDragged) return;
        var date = new moment($(event.target).parent().attr("hours"));
        console.log("end at",this.startDate,date);
        var user = this.parentComponent().parentComponent().data();
        var temp = this.startDate;
        this.startDate = null;
        this.hasDragged = null;
        console.log("add avail",temp,date);
        AvailabilityService.addAvailabilities(user,temp.toDate(),date.toDate())
    }

    resetSelect(){
        this.startDate = null;
        this.hasDragged = null;
        console.log("reset select");
    }

    creanOnClick() {
        //to implement
        console.log("creanOnClick");
    }

    quartHeureOnClick(event) {
        //to implement

        sAlert.info('Add availabilities by selecting slots with your mouse pressed.');
        return;

        //TODO proposer de switcher sur ce mode si besoin, default sur mobile
        var date = new moment($(event.target).parent().attr("hours"));

        if(!this.startDate)
            this.startDate = date;
        else {
            var endDate = date;
            console.log("new availabilties ",this.startDate.toDate(),endDate.toDate());
            var user = this.parentComponent().parentComponent().data();
            AvailabilityService.addAvailabilities(user,this.startDate.toDate(),endDate.toDate())
            this.startDate = null;
        }

    }

    timeSlot(date, timeHours, idTask) {
        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours);
        var user = this.data().user;
        if (!user) return [];

        var data = CalendarServiceClient.computeAvailabilitiesData(user,startCalendarTimeSlot);
        if(!data) return [];
        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }

    constructor() {
        super();

        this.startDate = null;
    }
}

EditAvailabilitiesCalendarComponent.register("EditAvailabilitiesCalendarComponent");