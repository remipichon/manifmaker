import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {TimeSlotCalendarServiceClient} from "../../../client/service/TimeSlotCalendarServiceClient"

class EditAvailabilitiesCalendarComponent extends BaseCalendarComponent {
    /* available in data
     this.data().parentInstance

     */

    creanOnClick() {
        //to implement
        console.log("creanOnClick");
    }

    quartHeureOnClick(event) {
        //to implement
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

        var data = TimeSlotCalendarServiceClient.computeAvailabilitiesData(user,startCalendarTimeSlot);
        if(!data) return [];
        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }

    constructor() {
        super();

        this.startDate = null;
    }
}

EditAvailabilitiesCalendarComponent.register("EditAvailabilitiesCalendarComponent");