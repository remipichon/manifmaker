import {TimeSlotService} from "../../both/service/TimeSlotService"

/** @class TimeSlotCalendarServiceClient*/
export class TimeSlotCalendarServiceClient {


    static computeAvailabilitiesData(user, startCalendarTimeSlot){
        var data = {},baseOneHourHeight,accuracy,end,start,duration,height,founded;

        var availabilitiesFound = TimeSlotService.getTimeSlotByStart(user.availabilities, startCalendarTimeSlot);
        if (availabilitiesFound === null) return null;

        if (availabilitiesFound !== null) {
            //Template.parentData() doesn't work so we use a trick
            data.userId = user._id;

        }

        _.extend(data, availabilitiesFound);

        data.height = this.computeTimeSlotAvailabilityHeight(availabilitiesFound,startCalendarTimeSlot) + "px";

        return data;
    }

    static computeTimeSlotData(task, startCalendarTimeSlot){
        var data = {},baseOneHourHeight,accuracy,end,start,duration,height,founded;

        var timeSlotFound = TimeSlotService.getTimeSlotByStart(task.timeSlots, startCalendarTimeSlot);
        if (timeSlotFound === null) return null;

        if (timeSlotFound !== null) {
            data.state = "available";
            //data.name = task.name;
            //Template.parentData() doesn't work so we use a trick
            data.taskId = task._id;

            //people need
            data.peopleNeeded = timeSlotFound.peopleNeeded;;
        }

        //var assignmentsFound = AssignmentService.getAssignmentByStart(task.assignments, startCalendarTimeSlot, true);
        //if (assignmentsFound.length !== 0) { //at least one assignment TODO code couleur d'avancement en fonction des peoples needed
        //    data.name = assignmentsFound[0].taskName; //idem, la meme task
        //    data.state = "in-progress";
        //    data.taskId = task._id;
        //
        //
        //    founded = assignmentsFound[0]; //normalement ils ont tous les memes date, TODO controler ca
        //}


        _.extend(data, timeSlotFound);

        data.height = this.computeTimeSlotAvailabilityHeight(timeSlotFound,startCalendarTimeSlot) + "px";

        return data;
    }

    static computeTimeSlotAvailabilityHeight(timeSlotAvailability,startCalendarTimeSlot){
        var baseOneHourHeight = 40, start, end, duration;
        var accuracy = AssignmentCalendarDisplayedAccuracy.findOne().accuracy;
        var startDate = new moment(new Date(startCalendarTimeSlot));
        if(startDate.hour() === 0){//midnight
            start = startDate;
            end = new moment(timeSlotAvailability.end);
        } else {
            end = new moment(timeSlotAvailability.end);
            start = new moment(timeSlotAvailability.start);
        }
        duration = end.diff(start) / (3600 * 1000);

        return accuracy * baseOneHourHeight * duration;
    }
}