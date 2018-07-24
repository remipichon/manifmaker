import {TimeSlotService} from "./TimeSlotService";

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

  static userHasAssignmentBetweenDates(user, startDate, endDate) {
    var userAssignments = AssignmentService.getAssignmentForUser(user);
    var assignmentsFound = TimeSlotService.getTimeResourcesByStart(userAssignments, startDate);
    if (assignmentsFound.length != 0) {
      return true;
    }
    return false;

  }


}