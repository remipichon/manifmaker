import {ValidationService} from "../../../../both/service/ValidationService"

class ActivityAccessPassesComponent extends BlazeComponent{

    template(){
        return "activityAccessPasses"
    }

    constructor(isReadOnly){
        super();
        this.isReadOnly = isReadOnly;
    }

    isAccessPassesUpdateAllowed() {
        return ValidationService.isUpdateAllowed(this.data().parentInstance.data().accessPassValidation.currentState);
    }

    isEquipmentsReadOnly() {
        return this.isReadOnly || !this.isAccessPassesUpdateAllowed();
    }
}

ActivityAccessPassesComponent.register("ActivityAccessPassesComponent");