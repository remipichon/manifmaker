export class UserServiceClient {

    /**
     * @summary redirect to update user form when registering a new user successes
     * @param error
     * @param state ATForm state
     */
    static onSubmitHook(error, state){
        if(!error && state === "signUp"){
            Router.go("/user/"+Users.findOne({loginUserId:Meteor.userId()})._id);
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
            else
                bootbox.alert({
                        title: `You can not delete this user`,
                        message: `The users has already ${assignmentsCount} assignments and can not be deleted. You must first remove each of his assignments`,
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