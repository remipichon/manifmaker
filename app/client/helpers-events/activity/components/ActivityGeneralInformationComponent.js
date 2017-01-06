import {ValidationService} from "../../../../both/service/ValidationService"

class ActivityGeneralInformationComponent extends BlazeComponent{

    template(){
        return "activityGeneralInformation"
    }

    constructor(){
        super();
    }

    isUpdateAllowed() {
        return ValidationService.isUpdateAllowed(this.data().parentInstance.data().generalInformationValidation.currentState);
    }

    activityDoc(){
        return this.data().parentInstance.data();
    }


    autoFormType(){
        if(this.isReadOnly())
            return "readonly"
        return "update"
    }

    isReadOnly() {
        return !this.isUpdateAllowed();
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
            Activities.update(this._id,{
                $set:{
                    start: _time.toDate()
                }
            })
        },this.activityDoc());
    }


    updateDateCallbackEndDate(date){
        return _.bind(function(newOption) {
            var _time = new moment(newOption);
            Activities.update(this._id,{
                $set:{
                    end: _time.toDate()
                }
            })
        },this.activityDoc());
    }
}

ActivityGeneralInformationComponent.register("ActivityGeneralInformationComponent");