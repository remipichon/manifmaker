import {TimeSlotService} from "../../both/service/TimeSlotService"
import {UserServiceClient} from "../../client/service/UserServiceClient"
import {AssignmentService} from "../../both/service/AssignmentService"

/** @class CalendarServiceClient*/
export class CalendarServiceClient {

  //TODO #378 maybe we can merge getCalendarSlotData and computeTimeSlotData and getCalendarSlotData


  /**
   * @summary Given a user and a specific time, retrieve an assignment or and availability and add calendar related data
   * @param userId
   * @param userAvailabilitiesOrAssignments array of assignments or array of availabilities
   * @param startCalendarTimeSlot
   * @param isAssigned
   * @description
   * return : calendar data {userId, assigned, charisma, css height}
   */
  //TODO #378 this is for user avail only and should deal with non accuray fit assigment/avail
  //TODO #378 what to do with smaller than accurcy avail ?
  static getCalendarSlotData(userId, userAvailabilitiesOrAssignments, startCalendarTimeSlot, isAssigned) {
    var data = {};

    //TODO #378 will have to support an array
    var availabityOrAssignmentFound = TimeSlotService.getTimeResourcesByStart(userAvailabilitiesOrAssignments, startCalendarTimeSlot);
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

    data.height = this.computeTimeResourceHeight(availabityOrAssignmentFound, startCalendarTimeSlot) + "px";

    //TODO #378 will return an array
    return data;
  }

  //this is for assigment only
  //TODO #378 refactor filter task list when click on avail (use betweenDate instead of start), list should display all timeslot for all task in between, with exact matching timeslot in title
  //TODO #378 refactor click to remove assignment, make sure it falls on the righ avail or assign
  static computeAvailabilitiesAssignmentsData(user, startCalendarTimeSlot){
    //TODO #378 what happens when we get the eventual previous term that end just before the current one ?
    let term = TimeSlotService.timeSlotWithinAssignmentTerm(startCalendarTimeSlot, startCalendarTimeSlot); //to read .isStrictMode

    if (!term) {
      console.log("skip, no term for",startCalendarTimeSlot.toString())
      return [];
    }

    let chosenCalendarAccuracy = AssignmentCalendarDisplayedAccuracy.findOne().accuracy;

    let availabilitiesFound, assignmentsFound;
    let userAssignments = AssignmentService.getAssignmentForUser(user);
    if(term.isStrictMode){
      availabilitiesFound = TimeSlotService.getTimeResourcesByStart(user.availabilities, startCalendarTimeSlot);
      assignmentsFound = TimeSlotService.getTimeResourcesByStart(userAssignments, startCalendarTimeSlot);
    } else {
      let nextTimeSlotStartDate = new moment(startCalendarTimeSlot).add("hours", chosenCalendarAccuracy);
      availabilitiesFound = TimeSlotService.getTimeResourcesStartingBetween(user.availabilities, startCalendarTimeSlot, nextTimeSlotStartDate);
      assignmentsFound = TimeSlotService.getTimeResourcesStartingBetween(userAssignments, startCalendarTimeSlot, nextTimeSlotStartDate);
    }

    if (availabilitiesFound.length == 0 && assignmentsFound == 0) return [];

    availabilitiesFound.forEach(avail => {
      avail.name = user.username;
    });
    assignmentsFound.forEach(assi => {
      assi.name = assi.taskName;
      assi.state = "affecte";
    });

    let availabilitiesAndAssignments = assignmentsFound.concat(availabilitiesFound);

    let result = [];
    availabilitiesAndAssignments.sort((a, b) => {
      if (new moment(a.start).isBefore(new moment(b.start)))
        return -1;
      return 1;
    });
    let previousTimeSlots = [];
    availabilitiesAndAssignments.forEach(availOrAssign => {
      availOrAssign.height = this.computeTimeResourceHeight(availOrAssign, startCalendarTimeSlot);
      availOrAssign.marginTop = this.computeTimeResourceMarginTop(availOrAssign, startCalendarTimeSlot, previousTimeSlots)
      result.push(availOrAssign);
      previousTimeSlots.push(availOrAssign);
    });
    return result;
  }

  static computeTimeSlotsData(task, startCalendarTimeSlot) {
    //TODO #378 what happens when we get the eventual previous term that end just before the current one ?
    let term = TimeSlotService.timeSlotWithinAssignmentTerm(startCalendarTimeSlot, startCalendarTimeSlot); //to read .isStrictMode

    if (!term) {
      console.log("skip, no term for",startCalendarTimeSlot.toString())
      return [];
    }

    //TODO #378 we need to read the calendarAccuracy from whatever is used on the UI
    let chosenCalendarAccuracy = AssignmentCalendarDisplayedAccuracy.findOne().accuracy;

    let timeSlotsFound;
    if(term.isStrictMode){
      timeSlotsFound = TimeSlotService.getTimeResourcesByStart(task.timeSlots, startCalendarTimeSlot);
    } else {
      let nextTimeSlotStartDate = new moment(startCalendarTimeSlot).add("hours", chosenCalendarAccuracy);
      timeSlotsFound = TimeSlotService.getTimeResourcesStartingBetween(task.timeSlots, startCalendarTimeSlot, nextTimeSlotStartDate);
    }
    if (timeSlotsFound.length == 0) return [];

    let result = [];
    timeSlotsFound.sort((a, b) => {
      if (new moment(a.start).isBefore(new moment(b.start)))
        return -1;
      return 1;
    });
    let previousTimeSlots = [];
    timeSlotsFound.forEach(timeSlotFound => {
      // timeSlotFound.taskName = task.name;
      // timeSlotFound.taskId = task._id;

      timeSlotFound.height = this.computeTimeResourceHeight(timeSlotFound, startCalendarTimeSlot);
      timeSlotFound.marginTop = this.computeTimeResourceMarginTop(timeSlotFound, startCalendarTimeSlot, previousTimeSlots)
      result.push(timeSlotFound);
      previousTimeSlots.push(timeSlotFound);
    });
    return result;
  }

  static computeTimeResourceHeight(timeSlotAvailability, startCalendarTimeSlot) {
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

  static computeTimeResourceMarginTop(timeSlotAvailability, startCalendarTimeSlot, previousTimeSlots) {
    let baseOneHourHeight = 40, start, end, duration, marginTop;
    let startDate = new moment(new Date(startCalendarTimeSlot));
    let timeSlotStart = new moment(timeSlotAvailability.start);

    //TODO #378 is the midnight thing working ?
    // if (startDate.hour() === 0) {//midnight
    //   start = startDate;
    //   end = new moment(timeSlotAvailability.end);
    // } else {
    //   end = new moment(timeSlotAvailability.end);
    //   start = new moment(timeSlotAvailability.start);
    // }

    let offset = timeSlotStart.diff(startDate) / (3600 * 1000);
    marginTop = offset * baseOneHourHeight;

    if(previousTimeSlots.length != 0) { //because it's margin top from the previous
      previousTimeSlots.forEach(timeSlot => {
        marginTop = marginTop - timeSlot.height - timeSlot.marginTop;
      });
    }

    return marginTop;
  }
}