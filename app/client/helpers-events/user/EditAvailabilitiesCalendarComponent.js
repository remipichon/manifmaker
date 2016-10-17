import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
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
            var availability = {
                start: this.startDate.toDate(),
                end: endDate.toDate()
            };
            Users.update(user._id,{
                $push : {
                    availabilities: availability
                }
            });
            this.startDate = null;
        }

    }

    constructor() {
        super();

        this.startDate = null;
    }
}

EditAvailabilitiesCalendarComponent.register("EditAvailabilitiesCalendarComponent");