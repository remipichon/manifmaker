import {BaseCalendarComponent} from "../common/BaseCalendarComponent"

class EditTimeSlotCalendarComponent extends BaseCalendarComponent {
    peopleNeedOnClick() {
        //to implement
    }

    peopleNeedAssignedOnClick(event) {
        //to implement
    }

    creanOnClick() {
        //to implement
        this.updatedTimeSlotIndex.set(0);
    }

    quartHeureOnClick(event) {
        //to implement
    }


    timeSlot(date, timeHours, idTask) {
        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours);

        var data = {};

        var task = this.data().data;
        if (!task) return [];

        var timeSlotFound = TimeSlotService.getTimeSlotByStart(task.timeSlots, startCalendarTimeSlot);
        var assignmentsFound = AssignmentService.getAssignmentByStart(task.assignments, startCalendarTimeSlot, true);

        if (timeSlotFound === null && assignmentsFound.length === 0) return [];


        var baseOneHourHeight = 40;
        var accuracy = AssignmentCalendarDisplayedAccuracy.findOne().accuracy;

        var data = {}, founded;

        if (timeSlotFound !== null) {
            data.state = "available";
            //data.name = task.name;
            //Template.parentData() doesn't work so we use a trick
            data.taskId = task._id;

            founded = timeSlotFound;

            //people need
            var peopleNeeds = founded.peopleNeeded;
            data.peopleNeeded = peopleNeeds;

        }

        //if (assignmentsFound.length !== 0) { //at least one assignment TODO code couleur d'avancement en fonction des peoples needed
        //    data.name = assignmentsFound[0].taskName; //idem, la meme task
        //    data.state = "in-progress";
        //    data.taskId = task._id;
        //
        //
        //    founded = assignmentsFound[0]; //normalement ils ont tous les memes date, TODO controler ca
        //}


        _.extend(data, founded);
        var end = new moment(founded.end);
        var start = new moment(founded.start);
        var duration = end.diff(start) / (3600 * 1000);

        var height = accuracy * baseOneHourHeight * duration;
        data.height = height + "px";


        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }
}

EditTimeSlotCalendarComponent.register("EditTimeSlotCalendarComponent");