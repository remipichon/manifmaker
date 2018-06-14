import {ValidationService} from "../../../../both/service/ValidationService"
import {Utils} from "../../../../client/service/Utils"

class ActivityGeneralInformationComponent extends BlazeComponent {

  constructor() {
    super();
  }

  template() {
    return "activityGeneralInformation"
  }

  isUpdateAllowed() {
    return ValidationService.isUpdateAllowed(this.data().parentInstance.data().generalInformationValidation.currentState);
  }

  activityDoc() {
    return this.data().parentInstance.data();
  }


  autoFormType() {
    if (this.isReadOnly())
      return "readonly"
    return "update"
  }

  isReadOnly() {
    return !this.isUpdateAllowed();
  }

  defaultLat() {
    return Settings.findOne().defaultActivityMapsLatLng.lat;
  }

  defaultLng() {
    return Settings.findOne().defaultActivityMapsLatLng.lng;
  }

  googleMapOption() {
    var options = {};
    if (this.isReadOnly()) {
      options.disableDefaultUI = true;
      options.draggable = false;
    }
    options.clickableIcons = false;
    return options;
  }


  updateDateCallbackStartDate(newOption) {
    return _.bind(function (newOption) {
      var _time = new moment(newOption);
      Activities.update(this._id, {
        $set: {
          start: _time.toDate()
        }
      }, Utils.onUpdateCollectionResult)
    }, this.activityDoc());
  }


  updateDateCallbackEndDate(date) {
    return _.bind(function (newOption) {
      var _time = new moment(newOption);
      Activities.update(this._id, {
        $set: {
          end: _time.toDate()
        }
      }, Utils.onUpdateCollectionResult)
    }, this.activityDoc());
  }

  startActivitiesEnclosingDate() {
    return Settings.findOne().activitiesEnclosingDate.start;
  }

  endActivitiesEnclosingDate() {
    return Settings.findOne().activitiesEnclosingDate.end;
  }
}

ActivityGeneralInformationComponent.register("ActivityGeneralInformationComponent");