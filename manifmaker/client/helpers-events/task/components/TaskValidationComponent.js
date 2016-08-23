class TaskValidationComponent extends BlazeComponent{
    events() {
        return [{
            "click .toggle-equipment-validation-comments-list": this.switchEquipmentListDeveloped,
            "click .toggle-time-slots-validation-comments-list": this.switchTimeSlotsListDeveloped,
        }];
    }

    template(){
        return "taskValidation"
    }

    onCreated() {
        this.EquipmentCommentsListDeveloped = new ReactiveVar(false);
        this.TimeSlotsCommentsListDeveloped = new ReactiveVar(false);
    }

    /**
     * this var is used to determine which icon should be displayed (to expand/collapse). The collapsing itself in made in bootstrap
     */
    isEquipmentCommentsListDeveloped(){
        return this.EquipmentCommentsListDeveloped.get();
    }

    switchEquipmentListDeveloped(event){
        this.EquipmentCommentsListDeveloped.set(!this.EquipmentCommentsListDeveloped.get());
    }
    /**
     * this var is used to determine which icon should be displayed (to expand/collapse). The collapsing itself in made in bootstrap
     */
    isTimeSlotsCommentsListDeveloped(){
        return this.TimeSlotsCommentsListDeveloped.get();
    }

    switchTimeSlotsListDeveloped(event){
        this.TimeSlotsCommentsListDeveloped.set(!this.TimeSlotsCommentsListDeveloped.get());
    }

    displayTextArea(validationType, state) {
        if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
            (state === "TOBEVALIDATED" || state === "READY"))
            return false;
        return true;
    }


}

TaskValidationComponent.register("TaskValidationComponent");
