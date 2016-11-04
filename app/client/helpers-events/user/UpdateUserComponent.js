import {UserServiceClient} from "../../../client/service/UserServiceClient"

class UpdateUserComponent extends BlazeComponent {

    self() {
        return this;
    }

    constructor(){
        super();
        this.userNameErrorVar = new ReactiveVar("");
        this.userEmailErrorVar = new ReactiveVar("");
        this.updateUserContext = Meteor.users.simpleSchema().namedContext("updateUser");
    }


    template() {
        return "updateUserComponent";
    }

    events() {
        return [{
            'change .update-skill': this.updateSkill,
            'click #make-user-ready': this.makeUserReady,
            'change #username': this.updateUserName,
            'change #useremail': this.updateUserEmail
        }];
    }

    userEmail(){
        return this.currentData().emails[0].address;
    }

    updateUserEmail(event){
        var  newUserEmail = $(event.target).val().trim();
        var userId = this.currentData()._id;
        //check if email is valid

        var isValid = Meteor.users.simpleSchema().namedContext("updateUser").validate({
            $set: {
                "emails.1.address": newUserEmail
            }
        }, {modifier: true});

        //managing error
        if (!isValid) {
            var ik = this.updateUserContext.invalidKeys(); //it's reactive ! whouhou
            ik = _.map(ik, _.bind(function (o) {
                return _.extend({message: this.updateUserContext.keyErrorMessage(o.name)}, o);
            }, this));

            this.userEmailErrorVar.set(ik[0].message);
        } else {
            this.userEmailErrorVar.set("");

            Meteor.call("updateUserEmail",userId,newUserEmail,_.bind(function(error, result){
                if(error){
                    this.userEmailErrorVar.set(error.reason);
                } else {
                    this.userEmailErrorVar.set("");
                }
            },this));
        }
    }

    userEmailError(){
        return this.userEmailErrorVar.get();
    }

    updateUserName(event){
        var  newUsername = $(event.target).val();
        var userId = this.currentData()._id;
        Meteor.call("updateUserName",userId,newUsername,_.bind(function(error, result){
            if(error){
                this.userNameErrorVar.set(error.reason);
            } else {
                this.userNameErrorVar.set("");
            }
        },this));
    }

    userNameError(){
        return this.userNameErrorVar.get();
    }

    makeUserReady(){
        bootbox.confirm("You are about to validate a user, it can't be undone. Are you sure ?", _.bind(function(result){
            if(result){
                Meteor.users.update(this.data()._id,{
                    $set: {
                        isReadyForAssignment: true
                    }
                })
            }
        },this));
    }

    updateSkill(event) {
        var skill = this.currentData();
        var user = this.data();
        if ($(event.target).prop('checked')) {
           //add skill
            Meteor.users.update(user._id,{
                $push : {
                    skills: skill._id
                }
            });
        } else {
            //remove skill
            Meteor.users.update(user._id,{
                $pull : {
                    skills: skill._id
                }
            });
        }

    }


    updateBirthDate() {
        return _.bind(function (birthday) {
            Meteor.users.update(this.data()._id,{
                $set : {
                    birthday: birthday.toDate()
                }
            });
        }, this);
    }

    isChecked(skillId){
        if(_.contains(this.data().skills,skillId))
            return "checked"
    }

    onDeleteSuccess() {
        return function () {
            sAlert.info("User has been successfully deleted");
        }
    }

    onDeleteError() {
        return function (error) {
            sAlert.info(`Something went wrong when deleting User (${error})`);
            console.error(`Something went wrong when deleting User (${error})`);
        }
    }

    beforeRemove() {
        var user = this.currentData();
        return function () {
            UserServiceClient.beforeRemoveHook(user);
        }
    }

}

UpdateUserComponent.register('UpdateUserComponent');

