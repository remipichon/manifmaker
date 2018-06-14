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
      bootbox.confirm("You are about to delete a task, are you sure ?", _.bind(function (result) {
        if (result) {
          Router.go("/tasks");
          this.remove();
        }
      }, this));
    }
  }

}

UpdateTaskComponent.register('UpdateTaskComponent');

