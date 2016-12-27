import {ValidationService} from "../../../../both/service/ValidationService"

class ActivityGeneralInformationComponent extends BlazeComponent{

    template(){
        return "activityGeneralInformation"
    }

    constructor(isReadOnly){
        super();
        this.isReadOnlyBool = isReadOnly;
    }

    isUpdateAllowed() {
        return ValidationService.isUpdateAllowed(this.data().parentInstance.data().generalInformationValidation.currentState);
    }

    isReadOnly() {
        return this.isReadOnlyBool || !this.isUpdateAllowed();
    }
}

ActivityGeneralInformationComponent.register("ActivityGeneralInformationComponent");