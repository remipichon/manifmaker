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

    defaultLat(){
        return Settings.findOne().defaultActivityMapsLatLng.lat;
    }

    defaultLng(){
        return Settings.findOne().defaultActivityMapsLatLng.lng;
    }
}

ActivityGeneralInformationComponent.register("ActivityGeneralInformationComponent");