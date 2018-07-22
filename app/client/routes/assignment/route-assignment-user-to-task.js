import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

/**
 * @memberOf Route.Assignment
 * @namespace Route.Assignment.userToTask
 */

/**
 * @memberOf Route.Assignment.userToTask
 * @summary Select User to Task mode
 * @locus client
 * @name 'assignment.calendar.userToTask'  /assignment/userToTask
 */
Router.route('/assignment/userToTask', function () {
    console.info("routing", '/assignment/userToTask');

    AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.noneFilter);
    AssignmentReactiveVars.UserIndexFilter.set(AssignmentReactiveVars.noSearchFilter);
    $("#search_user_name").val("");
    AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.defaultFilter);
    AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.USERTOTASK);
    AssignmentReactiveVars.SelectedUser.set(null);
    AssignmentReactiveVars.SelectedDate.set(null);

    AssignmentReactiveVars.isUsersListDeveloped.set(true);
    AssignmentReactiveVars.isTasksListDeveloped.set(false);
  }, {
    controller: 'AssignmentController',
    name: 'assignment.calendar.userToTask'
  }
);

/**
 * @memberOf Route.Assignment.userToTask
 * @summary Display available task/timeslot for a given user around a given date
 * @locus client
 * @name 'assignment.calendar.userToTask.user.date'  /assignment/userToTask/:userId/:selectedDate
 */
Router.route('/assignment/userToTask/:userId/:selectedDate', function () {
    console.info("routing", '/assignment/userToTask/' + this.params.userId + '/' + this.params.selectedDate);

    console.error("Route not implemented !!!")

    //TODO #378 AssignmentCalendarComponent.quartHeureOnClick should be done here, we need to pass two dates

  }, {
    controller: 'AssignmentController',
    name: 'assignment.calendar.userToTask.user.date'
  }
);

/**
 * @memberOf Route.Assignment.userToTask
 * @summary Display user availabilities
 * @locus client
 * @name 'assignment.calendar.userToTask.user'  /assignment/userToTask/:userId/
 */
Router.route('/assignment/userToTask/:userId', function () {
    console.info("routing", '/assignment/userToTask/' + this.params.userId);

    AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.USERTOTASK);
    AssignmentReactiveVars.SelectedUser.set({_id: this.params.userId});
    AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.noneFilter);

    AssignmentReactiveVars.isUsersListDeveloped.set(false);
    AssignmentReactiveVars.isTasksListDeveloped.set(true);

    AssignmentReactiveVars.isSelectedAvailability.set(false);
    AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.defaultFilter);
    //TODO reduire la liste à ses amis

  }, {
    controller: 'AssignmentController',
    name: 'assignment.calendar.userToTask.user'
  }
);