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

    updateDateCallbackStartDate(newOption) {
        return _.bind(function(newOption) {
            var _time = new moment(newOption);
            Activities.update(this.data()._id,{
                $set:{
                    start: _time.toDate()
                }
            })
        },this);
    }


    updateDateCallbackEndDate(date){
        return _.bind(function(newOption) {
            var _time = new moment(newOption);
            Activities.update(this.data()._id,{
                $set:{
                    end: _time.toDate()
                }
            })
        },this);
    }
}

ActivityGeneralInformationComponent.register("ActivityGeneralInformationComponent");