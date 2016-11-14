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

    static getCharismaFromDateTime(dateTime) {
        var term = AssignmentTerms.findOne({
            start: {$lte: dateTime.toDate()},
            end: {$gte: dateTime.toDate()}
        });

        if(term.assignmentTermPeriods.length === 0)
            return term.charisma;

        var charismaOverride = 0;
        term.assignmentTermPeriods.forEach(period => {
            if ( (new moment(period.start).isBefore(dateTime) || new moment(period.start).isSame(dateTime) ) &&
                new moment(period.end).isAfter(dateTime) ) {
                if (period.charisma !== 0)
                    charismaOverride = period.charisma
            }
        });

        return charismaOverride;
    }
}