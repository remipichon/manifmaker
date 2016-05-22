import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {AssignmentReactiveVars} from "../../../client/helpers-events/assignment/AssignmentReactiveVars"

Router.route('/assignment/userToTask', function () {
        console.info("routing", '/assignment/userToTask');

        AssignmentReactiveVars.TaskFilter.set(noneFilter);
        AssignmentReactiveVars.UserIndexFilter.set(noSearchFilter);
        $("#search_user_name").val("");
        AssignmentReactiveVars.UserFilter.set(defaultFilter);
        AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.USERTOTASK);
        AssignmentReactiveVars.SelectedUser.set(null);
        AssignmentReactiveVars.SelectedDate.set(null);
    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.userToTask'
    }
);

Router.route('/assignment/userToTask/:userId/:selectedDate', function () {
        console.info("routing", '/assignment/userToTask/' + this.params.userId + '/' + this.params.selectedDate);

        var selectedDate = parseInt(this.params.selectedDate);
        selectedDate = new moment(selectedDate);
        var userId = AssignmentReactiveVars.SelectedUser.get()._id;
        var user = Users.findOne({_id: userId});
        var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);

        if (typeof availability === "undefined") {
            console.error("Template.assignmentCalendar.events.click .heure, .quart_heure", "User can't normally click on this kind of element when in userToTask");
            return;
        }

        AssignmentReactiveVars.SelectedDate.set(selectedDate);
        AssignmentReactiveVars.SelectedAvailability.set(availability);

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

Router.route('/assignment/userToTask/:userId', function () {
        console.info("routing", '/assignment/userToTask/' + this.params.userId);

        AssignmentReactiveVars.CurrentAssignmentType.set(AssignmentType.USERTOTASK);
        AssignmentReactiveVars.SelectedUser.set({_id: this.params.userId});
        AssignmentReactiveVars.TaskFilter.set(noneFilter);

        AssignmentReactiveVars.SelectedAvailability.set(null);
        AssignmentReactiveVars.UserFilter.set(defaultFilter);
        //TODO reduire la liste à ses amis

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.userToTask.user'
    }
);