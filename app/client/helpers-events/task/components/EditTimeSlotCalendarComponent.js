import {BaseCalendarComponent} from "../../common/BaseCalendarComponent"
import {AssignmentService} from "../../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../../both/service/TimeSlotService"
import {TimeSlotCalendarServiceClient} from "../../../../client/service/TimeSlotCalendarServiceClient"

class EditTimeSlotCalendarComponent extends BaseCalendarComponent {
    /* available in data
     this.data().parentInstance

     */

    peopleNeedOnClick() {
        //to implement
    }

    peopleNeedAssignedOnClick(event) {
        //to implement
    }

    creanOnClick(e) {
        //to implement
        var _id = $(e.currentTarget).data("timeslotdid");
        this.data().parentInstance.updatedTimeSlotId.set(_id);
        this.data().parentInstance.isTimeSlotUpdated.set(true);
    }

    quartHeureOnClick(event) {
        //to implement
    }


    timeSlot(date, timeHours, idTask) {
        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours);
        var task = this.data().task;
        if (!task) return [];

        var data = TimeSlotCalendarServiceClient.computeTimeSlotData(task,startCalendarTimeSlot);
        if(!data) return [];
        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }

    getPeopleNeededMerged(timeSlotId){
        return this.data().parentInstance.getPeopleNeededMerged(timeSlotId);
    }

    getAlreadyAssignedPeopleNeedCount(timeSlotId){
        return this.data().parentInstance.getAlreadyAssignedPeopleNeedCount(timeSlotId);
    }

    currentTimeSlot() {
        return this.data().parentInstance.currentTimeSlot();
    }
}

EditTimeSlotCalendarComponent.register("EditTimeSlotCalendarComponent");