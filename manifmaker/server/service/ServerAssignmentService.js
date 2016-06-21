import {TimeSlotService} from "../../both/service/TimeSlotService"
import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/** @class ServerAssignmentService */
export class ServerAssignmentService {

    /**
     * @memberOf ServerAssignmentService
     * @summary Assignments.after.insert hook. Add TaskAssignment to Task and UserAssignment to User.
     * @locus server
     * @param assignmentId {MongoId}
     * @param assignment {Assignment}
     * @param fieldNames {Array<String>}
     */
    static propagateAssignment(assignmentId, assignment, fieldNames) {
        console.log("propagateAssignment for", assignment);
        var assignment = assignment;
        var user = Users.findOne(assignment.userId),
            task = Tasks.findOne(assignment.taskId);

        var timeSlot = TimeSlotService.getTimeSlot(task, assignment.timeSlotId);

        var userAssignment = {
            taskName: task.name,
            start: timeSlot.start,
            end: timeSlot.end,
            assignmentId: assignment._id
        };
        Users.update(assignment.userId, {
            $push: {assignments: userAssignment}
        });

        var taskAssignment = {
            userName: user.name,
            start: timeSlot.start,
            end: timeSlot.end,
            assignmentId: assignment._id
        };
        Tasks.update(assignment.taskId, {
            $push: {assignments: taskAssignment}
        });
    }


    /**
     * @memberOf ServerAssignmentService
     * @summary Assignments.after.remove hook. Remove TaskAssignment to Task and UserAssignment to User.
     * @locus server
     * @param assignmentId {MongoId}
     * @param assignment {Assignment}
     */
    static removeAssignment(assignmentId, assignment) {
        console.log("removeAssignment for", assignment);
        var assignment = assignment;
        var updateUser = {},
            updateTask = {},
            user = Users.findOne(assignment.userId),//Meteor.users.findOne(review.userId),
            task = Tasks.findOne(assignment.taskId);

        //TODO use $pull
        updateUser.assignments = user.assignments;
        updateUser.assignments.pop(
            user.assignments.indexOf(
                _.findWhere(
                    user.assignments, {assignmentId: assignment._id}
                )
            )
        );
        Users.update(assignment.userId, {$set: updateUser});

        updateTask.assignments = task.assignments;
        updateTask.assignments.pop(
            task.assignments.indexOf(
                _.findWhere(
                    task.assignments, {assignmentId: assignment._id}
                )
            )
        );
        Tasks.update(assignment.taskId, {$set: updateTask});
    }

    /**
     * @summary Assignments.before.update
     * @description
     * - Collection Hooks :  Assignments.before.update
     * - Assignment can not be updated
     */
    static preventUpdate() {
        throw new Meteor.Error(400, "An 'Assignment' can't be update but only created or deleted");
    }

    /**
     * @summary Assignments.before.insert
     * @description
     * - Collection Hooks :  Assignments.before.insert
     * - Needed role : ASSIGNMENTTASKUSER
     */
    static allowInsert(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'assignment');
    }

    /**
     * @summary Assignments.before.update
     * @description
     * - Collection Hooks :  Assignments.before.update
     * - Needed role : ASSIGNMENTTASKUSER
     */
    static allowUpdate(userId, doc, fieldNames, modifier, options) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'assignment');
    }

    /**
     * @summary Assignments.before.remove
     * @description
     * - Collection Hooks :  Assignments.before.remove
     * - Needed role : ASSIGNMENTTASKUSER
     */
    static allowDelete(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'assignment');
    }
}

