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
}

ActivityAccessPassesComponent.register("ActivityAccessPassesComponent");