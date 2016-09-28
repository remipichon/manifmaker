import {ValidationService} from "../../../../both/service/ValidationService"
import {SecurityServiceClient} from "../../../../client/service/SecurityServiceClient"

class TaskValidationComponent extends BlazeComponent{
    events() {
        return [{
            "click .toggle-equipment-validation-comments-list": this.switchEquipmentListDeveloped,
            "click .toggle-time-slots-validation-comments-list": this.switchTimeSlotsListDeveloped,
            "click .askforvalidation-button,.refuse-button,.close-button": this.changeState,
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

    /**
     * This function states if the comment input has to be displayed or not
     * @param validationType 'EQUIPMENTVALIDATION' or 'ASSIGNMENTVALIDATION'
     * @param state 'TOBEVALIDATED' or 'OPEN' or 'READY' or 'REFUSED'
     * @returns {boolean}
     */
    displayTextArea(validationType, state) {
        if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
            (state === "TOBEVALIDATED" || state === "READY"))
            return false;
        return true;
    }

    /**
     * @summary Update validation state for one the task part
     * @locus client
     * @param event
     */
    changeState(event){
        var _id= $(event.target).data('_id');
        var validationType = $(event.target).data('type');
        var state = $(event.target).data('state');

         if (state === "to-be-validated") {
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKWRITE);
         } else {
         if (validationType === "time-slot")
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ASSIGNMENTVALIDATION, "time slot validation");
         if (validationType === "access-pass")
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ACCESSPASSVALIDATION, "access pass validation");
         if (validationType === "equipment")
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.EQUIPMENTVALIDATION, "equipment validation");
         }

         var comment = $("#" + validationType + "-validation-new-comment").val();
         $("#" + validationType + "-validation-new-comment").val("");

         ValidationService.updateValidation(_id, ValidationStateUrl[state], ValidationTypeUrl[validationType], comment);
    }

}

TaskValidationComponent.register("TaskValidationComponent");
