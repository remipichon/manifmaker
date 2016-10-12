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
}