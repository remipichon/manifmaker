import {ValidationService} from "../../../../both/service/ValidationService"

class ActivityAccessPassesComponent extends BlazeComponent{

    template(){
        return "activityAccessPasses"
    }

    events() {
        return [
            {
                "click .autoform-remove-item": this.manuallyRemoveAccessPass //because AutoForm doesn't do it
            }
        ]
    }

    constructor(){
        super();
    }

    activityDoc(){
        return this.data().parentInstance.data();
    }

    isUpdateAllowed() {
        return ValidationService.isUpdateAllowed(this.data().parentInstance.data().accessPassValidation.currentState);
    }

    autoFormType(){
        if(this.isReadOnly())
            return "readonly"
        return "update"
    }

    isReadOnly() {
        return !this.isUpdateAllowed();
    }

    accessPasses() {
        return this.data().parentInstance.data().accessPasses;
    }

    isAccessPointNotGranted(accessPoints, indexString){
        var granted = false;
        for(i=0; i<accessPoints.length; i++){
            if(AccessPoints.findOne(accessPoints[i]).name == indexString){
                granted = true;
            }
        }
        return !granted;
    }

    manuallyRemoveAccessPass(event){
        var target = $(event.target);
        var accessPassIndex = parseInt($($($(target[0]).parents(".autoform-array-item")[0]).find("[data-schema-key]")[0]).data("schema-key").split(".")[1])
        console.log("accessPassIndex",accessPassIndex);

        Activities.update(this.parentComponent().data()._id,
            {$unset : {[`accessPasses.${accessPassIndex}`] : 1 }}
        );
        Activities.update(this.parentComponent().data()._id,
            {$pull : {accessPasses : null }}
        );
    }
}

ActivityAccessPassesComponent.register("ActivityAccessPassesComponent");