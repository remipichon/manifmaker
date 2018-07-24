import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

/**
 * @memberOf Route.Assignment
 * @namespace Route.Assignment.taskToUser
 */

/**
 * @memberOf Route.Assignment.taskToUser
 * @summary Select Task to User mode
 * @locus client
 * @name 'assignment.calendar.taskToUser'  /assignment/taskToUser
 */
Router.route('/assignment/taskToUser', function () {
    console.info("routing", '/assignment/taskToUser');

    AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.defaultFilter);
    AssignmentReactiveVars.TaskIndexFilter.set(AssignmentReactiveVars.noSearchFilter);
    $("#search_task_name").val("");
    AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.noneFilter);
    AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    AssignmentReactiveVars.SelectedUser.set(null);
    AssignmentReactiveVars.SelectedTask.set(null);
    AssignmentReactiveVars.RelevantSelectedDates.set({
      start: null,
      end: null
    });

    AssignmentReactiveVars.isUsersListDeveloped.set(false);
    AssignmentReactiveVars.isTasksListDeveloped.set(true);

  }, {
    controller: 'AssignmentController',
    name: 'assignment.calendar.taskToUser'
  }
);

/**
 * @memberOf Route.Assignment.taskToUser
 * @summary Display available users for a given task at a given timeslot
 * @locus client
 * @name 'assignment.calendar.taskToUser.task.timeSlot'  assignment/taskToUser/:taskId/:timeSlotId
 */
Router.route('/assignment/taskToUser/:taskId/:timeSlotId', function () {
    console.info("routing", '/assignment/taskToUser/' + this.params.taskId + '/' + this.params.timeSlotId);

    AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    AssignmentReactiveVars.SelectedTask.set({_id: this.params.taskId});
    AssignmentReactiveVars.SelectedTimeSlot.set({_id: this.params.timeSlotId});
    AssignmentReactiveVars.isUsersListDeveloped.set(true);
    AssignmentReactiveVars.isTasksListDeveloped.set(false);
    AssignmentReactiveVars.IsPopOverOpened.set(true);

    var task = Tasks.findOne({_id: this.params.taskId});
    var timeSlot = TimeSlotService.getTimeSlot(task, this.params.timeSlotId);

    var newFilter = {
      availabilities: {
        $elemMatch: {
          start: {$lte: timeSlot.start},
          end: {$gte: timeSlot.end}
        }
      }
    };

    AssignmentReactiveVars.UserFilter.set(newFilter);

  }, {
    controller: 'AssignmentController',
    name: 'assignment.calendar.taskToUser.task.timeSlot'
  }
);

/**
 * @memberOf Route.Assignment.taskToUser
 * @summary Display task time slots
 * @locus client
 * @name 'assignment.calendar.taskToUser.task'  /assignment/taskToUser/:taskId
 */
Router.route('/assignment/taskToUser/:taskId', function () {
    console.info("routing", '/assignment/taskToUser/' + this.params.taskId);

    AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    AssignmentReactiveVars.SelectedTask.set({_id: this.params.taskId});
    AssignmentReactiveVars.SelectedTimeSlot.set(null);
    AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.noneFilter);
    AssignmentReactiveVars.isUsersListDeveloped.set(false);
    AssignmentReactiveVars.isTasksListDeveloped.set(true);


  }, {
    controller: 'AssignmentController',
    name: 'assignment.calendar.taskToUser.task'
  }
);

