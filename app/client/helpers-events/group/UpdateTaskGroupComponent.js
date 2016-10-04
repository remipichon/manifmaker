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
        return function () {
            bootbox.confirm("You are about to delete a task group, are you sure ?", _.bind(function(result){
                if(result){
                    Router.go("/task-groups");
                    this.remove();
                }
            },this));
        }
    }

}

UpdateTaskGroupComponent.register('UpdateTaskGroupComponent');

