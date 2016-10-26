import {UserServiceClient} from "../../../client/service/UserServiceClient"

class UpdateUserComponent extends BlazeComponent {

    self() {
        return this;
    }


    template() {
        return "updateUserComponent";
    }

    events() {
        return [{
            'change .update-skill': this.updateSkill,
            'click #make-user-ready': this.makeUserReady
        }];
    }

    makeUserReady(){
        bootbox.confirm("You are about to validate a user, it can't be undone. Are you sure ?", _.bind(function(result){
            if(result){
                Users.update(this.data()._id,{
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
            Users.update(user._id,{
                $push : {
                    skills: skill._id
                }
            });
        } else {
            //remove skill
            Users.update(user._id,{
                $pull : {
                    skills: skill._id
                }
            });
        }

    }


    updateBirthDate() {
        return _.bind(function (birthDate) {
            Users.update(this.data()._id,{
                $set : {
                    birthDate: birthDate.toDate()
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

