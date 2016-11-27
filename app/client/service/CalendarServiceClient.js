import {TimeSlotService} from "../../both/service/TimeSlotService"
import {UserServiceClient} from "../../client/service/UserServiceClient"

/** @class CalendarServiceClient*/
export class CalendarServiceClient {


    static computeAvailabilitiesData(user, startCalendarTimeSlot){
        var data = {},baseOneHourHeight,accuracy,end,start,duration,height,founded;

        var availabilitiesFound = TimeSlotService.getTimeSlotByStart(user.availabilities, startCalendarTimeSlot);
        if (availabilitiesFound === null) return null;

        if (availabilitiesFound !== null) {
            //Template.parentData() doesn't work so we use a trick
            data.userId = user._id;


            var availStart = new moment(availabilitiesFound.start);
            var availEnd = new moment(availabilitiesFound.end);

            if(!availStart.isSame(startCalendarTimeSlot,"day")){
                availStart = startCalendarTimeSlot
            }

            if(!availEnd.isSame(startCalendarTimeSlot,"day")){
                availEnd = new moment(startCalendarTimeSlot); //until the end of the day
                availEnd.minute(0);
                availEnd.hour(0);
                availEnd.add(1,'day');
            }

            data.charisma = UserServiceClient.computeCharismaBetweenDate(availStart,availEnd);
        }

        _.extend(data, availabilitiesFound);

        data.height = this.computeTimeSlotAvailabilityHeight(availabilitiesFound,startCalendarTimeSlot) + "px";

        return data;
    }

    static computeAssignmentData(user, startCalendarTimeSlot){
        var data = {},baseOneHourHeight,accuracy,end,start,duration,height,founded;

        var assignmentsFound = TimeSlotService.getTimeSlotByStart(user.assignments, startCalendarTimeSlot);
        if (assignmentsFound === null) return null;

        if (assignmentsFound !== null) {
            //Template.parentData() doesn't work so we use a trick
            data.userId = user._id;
            data.assigned = true;

            var availStart = new moment(availabilitiesFound.start);
            var availEnd = new moment(availabilitiesFound.end);

            if(!availStart.isSame(startCalendarTimeSlot,"day")){
                availStart = startCalendarTimeSlot
            }

            if(!availEnd.isSame(startCalendarTimeSlot,"day")){
                availEnd = new moment(startCalendarTimeSlot); //until the end of the day
                availEnd.minute(0);
                availEnd.hour(0);
                availEnd.add(1,'day');
            }

            data.charisma = UserServiceClient.computeCharismaBetweenDate(availStart,availEnd);
        }

        _.extend(data, assignmentsFound);

        data.height = this.computeTimeSlotAvailabilityHeight(assignmentsFound,startCalendarTimeSlot) + "px";

        return data;
    }


    static computeTimeSlotData(task, startCalendarTimeSlot){
        var data = {},baseOneHourHeight,accuracy,end,start,duration,height,founded;

        var timeSlotFound = TimeSlotService.getTimeSlotByStart(task.timeSlots, startCalendarTimeSlot);
        if (timeSlotFound === null) return null;

        if (timeSlotFound !== null) {
            data.state = "available";
            data.taskName = task.name;
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
        var startDate = new moment(new Date(startCalendarTimeSlot));
        if(startDate.hour() === 0){//midnight
            start = startDate;
            end = new moment(timeSlotAvailability.end);
        } else {
            end = new moment(timeSlotAvailability.end);
            start = new moment(timeSlotAvailability.start);
        }
        duration = end.diff(start) / (3600 * 1000);

        return  baseOneHourHeight * duration;
    }
}