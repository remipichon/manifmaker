class UpdateUserComponent extends BlazeComponent {

    self() {
        return this;
    }


    template() {
        return "updateUserComponent";
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

