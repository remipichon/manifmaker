class TaskValidationComponent extends BlazeComponent{
    template(){
        return "taskValidation"
    }


    displayTextArea(validationType, state) {
        if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
            (state === "TOBEVALIDATED" || state === "READY"))
            return false;
        return true;
    }
}

TaskValidationComponent.register("TaskValidationComponent");
