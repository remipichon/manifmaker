class UpdateActivityComponent extends BlazeComponent {

    self() {
        return this;
    }


    template() {
        return "updateActivityComponent";
    }

    onDeleteSuccess() {
        return function () {
            sAlert.info("Activity has been successfully deleted");
        }
    }

    onDeleteError() {
        return function (error) {
            sAlert.info(`Something went wrong when deleting Activity (${error})`);
            console.error(`Something went wrong when deleting Activity (${error})`);
        }
    }

    beforeRemove() {
        return function () {
            bootbox.confirm("You are about to delete an activity, are you sure ?", _.bind(function(result){
                if(result){
                    Router.go("/activities");
                    this.remove();
                }
            },this));
        }
    }

}

UpdateActivityComponent.register('UpdateActivityComponent');

