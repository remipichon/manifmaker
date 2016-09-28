class UpdateTaskComponent extends BlazeComponent {

    self() {
        return this;
    }


    template() {
        return "updateTaskComponent";
    }

    onDeleteSuccess() {
        return function () {
            //TODO message de deletion success
            console.log("TODO message de deletion success")
        }
    }

    onDeleteError() {
        return function () {
            //TODO message de deletion success
            console.log("TODO message de deletion error")
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

