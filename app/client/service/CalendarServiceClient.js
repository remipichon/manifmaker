import {TimeSlotService} from "../../both/service/TimeSlotService";
import {UserServiceClient} from "../../client/service/UserServiceClient";
import {AssignmentService} from "../../both/service/AssignmentService";
import {AssignmentReactiveVars} from "../../client/helpers-events/assignment/AssignmentReactiveVars";

/** @class CalendarServiceClient*/
export class CalendarServiceClient {

  static computeAvailabilitiesAssignmentsData(user, startCalendarTimeSlot) {
    let startPlusOneMinute = new moment(startCalendarTimeSlot);
    startPlusOneMinute.add(1, "minute"); //this way, no risk to get a term that would end exactly when this one start
    let term = TimeSlotService.timeSlotWithinAssignmentTerm(startCalendarTimeSlot, startPlusOneMinute); //to read .isStrictMode

    if (!term) {
      console.log("skip, no term for", startCalendarTimeSlot.toString())
      return [];
    }

    let chosenCalendarAccuracy = AssignmentReactiveVars.CurrentSelectedAccuracy.get();

    let availabilitiesFound, assignmentsFound;
    let userAssignments = AssignmentService.getAssignmentForUser(user);
    if (term.isStrictMode) {
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
      avail.state = "dispo";
      avail.assigned = false;
      avail.charisma = UserServiceClient.computeCharismaBetweenDate(new moment(avail.start), new moment(avail.end));

    });
    assignmentsFound.forEach(assi => {
      assi.name = assi.taskName;
      assi.state = "affecte";
      assi.assigned = true;
      assi.charisma = UserServiceClient.computeCharismaBetweenDate(new moment(assi.start), new moment(assi.end));
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
    let startPlusOneMinute = new moment(startCalendarTimeSlot);
    startPlusOneMinute.add(1, "minute"); //this way, no risk to get a term that would end exactly when this one start
    let term = TimeSlotService.timeSlotWithinAssignmentTerm(startCalendarTimeSlot, startPlusOneMinute); //to read .isStrictMode

    if (!term) {
      console.log("skip, no term for", startCalendarTimeSlot.toString())
      return [];
    }

    let chosenCalendarAccuracy = AssignmentReactiveVars.CurrentSelectedAccuracy.get();

    let timeSlotsFound;
    if (term.isStrictMode) {
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
    let offset;
    if (startDate.hour() === 0) {//midnight
      offset = 0;
    } else {
      offset = timeSlotStart.diff(startDate) / (3600 * 1000);
    }
    marginTop = offset * baseOneHourHeight;

    if (previousTimeSlots.length != 0) { //because it's margin top from the previous
      previousTimeSlots.forEach(timeSlot => {
        marginTop = marginTop - timeSlot.height - timeSlot.marginTop;
      });
    }

    return marginTop;
  }
}