import {TaskGroupServiceClient} from '../../service/TaskGroupServiceClient'

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
        return _.bind(function () {
            TaskGroupServiceClient.beforeRemove(this);
        },this);
    }

}

UpdateTaskGroupComponent.register('UpdateTaskGroupComponent');

