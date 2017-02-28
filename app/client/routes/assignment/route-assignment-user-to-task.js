import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"
import {ManifMakerRouterController} from "../ManifMakerRouterController"

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

        //TODO this is never used !!!
        var selectedDate = parseInt(this.params.selectedDate);
        selectedDate = new moment(selectedDate);
        var userId = AssignmentReactiveVars.SelectedUser.get()._id;
        var user = Meteor.users.findOne({_id: userId});
        var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);

        if (typeof availability === "undefined") {
            console.error("Template.assignmentCalendar.events.click .heure, .quart_heure", "User can't normally click on this kind of element when in userToTask");
            return;
        }

        AssignmentReactiveVars.SelectedDate.set(selectedDate);
        AssignmentReactiveVars.SelectedAvailability.set(availability);

        AssignmentReactiveVars.isUsersListDeveloped.set(false);
        AssignmentReactiveVars.isTasksListDeveloped.set(true);

        /*
         Task whose have at least one timeSlot (to begin, just one) as

         user.Dispocorrespante.start <= task.timeslot.start <= selectedDate and
         selectedDate <=  task.timeslot.end <=  user.Dispocorrespante.end

         */

        var newFilter = {
            timeSlots: {
                $elemMatch: {
                    start: {$gte: availability.start, $lte: selectedDate.toDate()},
                    end: {$gt: selectedDate.toDate(), $lte: availability.end}
                }
            }
        };

        AssignmentReactiveVars.TaskFilter.set(newFilter);

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

        AssignmentReactiveVars.SelectedAvailability.set(null);
        AssignmentReactiveVars.UserFilter.set(AssignmentReactiveVars.defaultFilter);
        //TODO reduire la liste à ses amis

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.userToTask.user'
    }
);