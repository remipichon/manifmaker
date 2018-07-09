import {TimeSlotService} from "./TimeSlotService"

export class AssignmentService {

  /**
   * @memberOf AssignmentService
   * @summary Get time slot by _id from a task
   * @locus Anywhere
   * @param task
   * @param timeSlotId
   * @returns {timeSlot|null}
   */
  static getTimeSlot(task, timeSlotId) {
    for (var timeSlot in task.timeSlots) {
      if (timeSlot._id === timeSlotId) {
        return timeSlot;
      }
    }
    return null;
  }

  /**
   * @memberOf AssignmentService
   * @summary Proxy for TimeSlotService.getTimeSlotByStart
   * @locus Anywhere
   * @param assignment
   * @param start
   * @returns {timeSlot|null}
   */
  static getAssignmentByStart(assignment, start) {
    //TODO 378 need a strict byStart
    return TimeSlotService.getTimeSlotByStart(assignment, start);
  }

  /**
   * @memberOf AssignmentService
   * @locus Anywhere
   * @summary return assignment with start/end date, taskName
   * @param user
   * @returns {[assignments]|null}
   */
  static getAssignmentForUser(user) {
    var assigments = Assignments.find({userId: user._id}).fetch();
    var res = [];
    assigments.forEach(assigment => {
      var task = Tasks.findOne(assigment.taskId);
      var taskTimeSlot = TimeSlotService.getTimeSlotById(assigment.timeSlotId)
      res.push({
        start: taskTimeSlot.timeSlot.start,
        end: taskTimeSlot.timeSlot.end,
        taskName: task.name,
        userId: assigment.userId,
        taskId: assigment.taskId,
        timeSlotId: assigment.timeSlotId,
        peopleNeedId: assigment.peopleNeedId,
      });
    });


    return res;
  }

  //TODO use also end date
  static userHasAssignmentBetweenDates(user, startDate, endDate) {
    var userAssignments = AssignmentService.getAssignmentForUser(user);
    var assignmentFound = AssignmentService.getAssignmentByStart(userAssignments, startDate);
    if (assignmentFound) {
      return true;
    }
    return false;

  }


}