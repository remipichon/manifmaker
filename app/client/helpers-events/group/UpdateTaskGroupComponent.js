class UpdateTaskGroupComponent extends BlazeComponent {

    self() {
        return this;
    }


    template() {
        return "updateTaskGroupComponent";
    }

    onDeleteSuccess() {
        return function () {
            sAlert.info("Task Group has been successfully deleted");
        }
    }

    onDeleteError() {
        return function (error) {
            sAlert.info(`Something went wrong when deleting Task Group (${error})`);
            console.error(`Something went wrong when deleting Task Group (${error})`);
        }
    }

    beforeRemove() {
        var groupId = this.currentData()._id;
        return function () {
            var taskInGroup = Tasks.find({groupId: groupId}).fetch();
            var taskCount = taskInGroup.length;
            bootbox.confirm({
                    title: "You are about to delete a task group, are you sure ?",
                    message: "The "+taskCount+" tasks linked to this group will not be deleted.",
                    buttons: {
                        cancel: {
                            label: '<i class="fa fa-times"></i> Cancel'
                        },
                        confirm: {
                            label: '<i class="fa fa-check"></i> Confirm'
                        }
                    },
                    callback: _.bind(function (result) {
                        if (result) {
                            Router.go("/task-groups");
                            this.remove();
                        }
                    }, this)
                }
            );
        }
    }

}

UpdateTaskGroupComponent.register('UpdateTaskGroupComponent');

