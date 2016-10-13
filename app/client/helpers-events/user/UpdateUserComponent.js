class UpdateUserComponent extends BlazeComponent {

    self() {
        return this;
    }


    template() {
        return "updateUserComponent";
    }

    events() {
        return [{
            'change .update-skill': this.updateSkill
        }];
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

}

UpdateUserComponent.register('UpdateUserComponent');

