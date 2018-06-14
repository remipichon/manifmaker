class TaskGeneralInformationComponent extends BlazeComponent {
  template() {
    return "taskGeneralInformation";
  }

  linkedActivity() {
    if (this.currentData().activityId)
      return Activities.findOne(this.currentData().activityId);
  }
}

TaskGeneralInformationComponent.register("TaskGeneralInformationComponent");