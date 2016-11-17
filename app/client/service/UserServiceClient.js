import {TimeSlotService} from "../../both/service/TimeSlotService"
export class UserServiceClient {

    /**
     * @summary redirect to update user form when registering a new user successes
     * @param error
     * @param state ATForm state
     */
    static onSubmitHook(error, state){
        if(!error && state === "signUp"){
            Router.go("/user/"+Meteor.users.findOne({_id:Meteor.userId()})._id);
        }
    }

    /**
     * @summary display a popover to warn if user is already assigned
     * @param user : user to delete
     */
    static beforeRemoveHook(user){
            var assignmentsCount = user.assignments.length;
            if (assignmentsCount === 0)
                bootbox.confirm("You are about to delete a user, are you sure ?",_.bind(function (result) {
                        if (result) {
                            Router.go("/users");
                            this.remove();
                        }
                    }, this)
                );
            else {
                var _id = Meteor.userId();
                var hasAssignmentRole = Roles.userIsInRole(_id, RolesEnum.ASSIGNMENTTASKUSER);

                var linkMessage = `<a href="/assignment/userToTask/${user._id}">Access assignment page to remove assignment</a>`;

                bootbox.alert({
                        title: `You can not delete this user`,
                        message: `<p>The users has already ${assignmentsCount} assignments and can not be deleted. You must first remove each of his assignments</p>
                        <p>${(hasAssignmentRole)? linkMessage: "You do not have access right to remove assignments. User can not be deleted."}</p>`,
                        callback: _.bind(function (result) {
                            if (result) {
                                Router.go("/users");
                                this.remove();
                            }
                        }, this)
                    }
                );
            }
    }

    static getCharismaCount(user){
        var charismaTot = 0;
        user.availabilities.forEach(availability =>{
            var start = new moment(availability.start);
            var end = new moment(availability.end);

            charismaTot += UserServiceClient.computeCharismaBetweenDate(start,end);
        });

        return charismaTot;
    }

    static getAvailableCharismaCountForUser(user){
        var charismaTot = 0;

        var terms = AssignmentTerms.find({
            teams: {$in: user.teams}
        }).fetch();

        terms.forEach(term => {
            charismaTot += UserServiceClient.computeCharismaBetweenDate(new moment(term.start), new moment(term.end));
        });

        return charismaTot;
    }

    static computeCharismaBetweenDate(start,end){
        var term = AssignmentTerms.findOne({
            start: {$lte: start.toDate()},
            end: {$gte: end.toDate()}
        });

        var accuracy = term.calendarAccuracy;
        var charismaTot;

        if(term.assignmentTermPeriods.length === 0){
            var duration = end.diff(start) / (3600 * 1000);
            charismaTot = duration / accuracy * term.charisma;
            return charismaTot;
        } else {
            charismaTot = 0;
            term.assignmentTermPeriods.forEach(period => {
                var charisma = period.charisma || term.charisma;
                var duration = 0; //d = f(start,end,period.start, period.end)

                var periodStart = new moment(period.start);
                var periodEnd = new moment(period.end);

                var startDuration;
                var endDuration;

                if(TimeSlotService.isOverlapping(start,end,periodStart,periodEnd)){
                    //duration will not be 0
                    if(start.isBefore(periodStart)){
                        startDuration = periodStart
                    } else {
                        startDuration = start;
                    }

                    if(end.isAfter(periodEnd)){
                        endDuration = periodEnd
                    } else {
                        endDuration = end;
                    }

                    duration = endDuration.diff(startDuration) / (3600 * 1000);

                    var charismaPeriod = duration / accuracy * charisma;
                    charismaTot += charismaPeriod;
                }

            });

            return charismaTot;
        }

    }

    static getCharismaFromDateTime(dateTime) {
        var term = AssignmentTerms.findOne({
            start: {$lte: dateTime.toDate()},
            end: {$gte: dateTime.toDate()}
        });

        if(term.assignmentTermPeriods.length === 0)
            return term.charisma;

        var charismaOverride = null;
        term.assignmentTermPeriods.forEach(period => {
            if ( (new moment(period.start).isBefore(dateTime) || new moment(period.start).isSame(dateTime) ) &&
                new moment(period.end).isAfter(dateTime) ) {
                if (period.charisma !== 0){
                    charismaOverride = period.charisma
                } else {
                    charismaOverride = term.charisma;
                }
            }
        });

        return charismaOverride;
    }
}