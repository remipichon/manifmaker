class UpdateTaskComponent extends BlazeComponent {

    self() {
        return this;
    }


    template() {
        return "updateTaskComponent";
    }

    onDeleteSuccess() {
        return function () {
            sAlert.info("Task has been successfully deleted");
        }
    }

    onDeleteError() {
        return function (error) {
            sAlert.info(`Something went wrong when deleting Task (${error})`);
            console.error(`Something went wrong when deleting Task (${error})`);
        }
    }

    beforeRemove() {
        return function () {
            //TODO add a better dialog box to confirm deletion
            if(window.confirm("About to delete the task")){
                Router.go("/tasks");
                this.remove();
            }
        }
    }

}

UpdateTaskComponent.register('UpdateTaskComponent');

