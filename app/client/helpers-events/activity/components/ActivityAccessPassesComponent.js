import {ValidationService} from "../../../../both/service/ValidationService"

class ActivityAccessPassesComponent extends BlazeComponent{

    template(){
        return "activityAccessPasses"
    }

    constructor(isReadOnly){
        super();
        this.isReadOnlyBool = isReadOnly;
    }

    isUpdateAllowed() {
        return ValidationService.isUpdateAllowed(this.data().parentInstance.data().accessPassValidation.currentState);
    }

    isReadOnly() {
        return this.isReadOnlyBool || !this.isUpdateAllowed();
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
}

ActivityAccessPassesComponent.register("ActivityAccessPassesComponent");