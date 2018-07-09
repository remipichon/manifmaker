import {TimeSlotService} from "../../both/service/TimeSlotService"
import {UserServiceClient} from "../../client/service/UserServiceClient"

/** @class CalendarServiceClient*/
export class CalendarServiceClient {

  /**
   * @summary Given a user and a specific time, retrieve an assignment or and availability and add calendar related data
   * @param userId
   * @param userAvailabilitiesOrAssignments array of assignments or array of availabilities
   * @param startCalendarTimeSlot
   * @param isAssigned
   * @description
   * return : calendar data {userId, assigned, charisma, css height}
   */
  static getCalendarSlotData(userId, userAvailabilitiesOrAssignments, startCalendarTimeSlot, isAssigned) {
    var data = {};

    //TODO 378 will have to support an array
    var availabityOrAssignmentFound = TimeSlotService.getTimeSlotByStart(userAvailabilitiesOrAssignments, startCalendarTimeSlot);
    if (availabityOrAssignmentFound === null) return null;

    if (availabityOrAssignmentFound !== null) {
      //Template.parentData() doesn't work so we use a trick
      data.userId = userId;
      data.assigned = isAssigned;

      var start = new moment(availabityOrAssignmentFound.start);
      var end = new moment(availabityOrAssignmentFound.end);

      //TODO I guess this should be added to computeTimeSlotData as well, no ?
      //(it's when availability start before the day )
      if (!start.isSame(startCalendarTimeSlot, "day")) {
        start = startCalendarTimeSlot
      }

      //TODO I guess this should be added to computeTimeSlotData as well, no ?
      //(it's when availability end after the day)
      if (!end.isSame(startCalendarTimeSlot, "day")) {
        end = new moment(startCalendarTimeSlot); //until the end of the day
        end.minute(0);
        end.hour(0);
        end.add(1, 'day');
      }

      data.charisma = UserServiceClient.computeCharismaBetweenDate(start, end);
    }

    _.extend(data, availabityOrAssignmentFound);

    //TODO #378 here data.height should adapt itself
    //TODO #378 compute margin-top relative to parent (the 'creneau' if first timeslot found, on the previous timeslot else)

    data.height = this.computeTimeSlotAvailabilityHeight(availabityOrAssignmentFound, startCalendarTimeSlot) + "px";

    //TODO #378 will return an array
    return data;
  }


  static computeTimeSlotData(task, startCalendarTimeSlot) {
    var data = {}, baseOneHourHeight, accuracy, end, start, duration, height, founded;

    //TODO 378 will have to support an array
    var timeSlotFound = TimeSlotService.getTimeSlotByStart(task.timeSlots, startCalendarTimeSlot);
    if (timeSlotFound === null) return null;

    if (timeSlotFound !== null) {
      data.state = "available";
      data.taskName = task.name;
      //Template.parentData() doesn't work so we use a trick
      data.taskId = task._id;

      //people need
      data.peopleNeeded = timeSlotFound.peopleNeeded;
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

    //TODO #378 here data.height should adapt itself
    //TODO #378 compute margin-top relative to parent (the 'creneau' if first timeslot found, on the previous timeslot else)

    data.height = this.computeTimeSlotAvailabilityHeight(timeSlotFound, startCalendarTimeSlot) + "px";

    //TODO #378 will return an array
    return data;
  }

  static computeTimeSlotAvailabilityHeight(timeSlotAvailability, startCalendarTimeSlot) {
    var baseOneHourHeight = 40, start, end, duration;
    var startDate = new moment(new Date(startCalendarTimeSlot));
    if (startDate.hour() === 0) {//midnight
      start = startDate;
      end = new moment(timeSlotAvailability.end);
    } else {
      end = new moment(timeSlotAvailability.end);
      start = new moment(timeSlotAvailability.start);
    }
    duration = end.diff(start) / (3600 * 1000);

    return baseOneHourHeight * duration;
  }
}