import {Schemas} from "./SchemasHelpers";
import {ValidationService} from "../../../both/service/ValidationService";
import "/both/collection/model/T-Validation.js";
import {Match} from "meteor/check";
import {ApiResourceActionService} from "../../../both/service/ApiResourceActionService.js";

SimpleSchema.extendOptions({
  jsonExport: Match.Optional(Boolean)
});

Schemas.AccessPass = new SimpleSchema({
  start: {
    type: Date,
    label: "Access Pass Start Date",
    custom: function () {
      var start, end;

      end = new moment(this.field(this.key.replace("start", "") + 'end').value);

      start = new moment(this.value);

      if (start.isAfter(end)) {
        return "startAfterEnd";
      }

    },
    autoform: {
      type: "datetime-local",
    }
  },
  end: {
    type: Date,
    label: "Access Pass End Date",
    custom: function () {
      var start, end;

      start = new moment(this.field(this.key.replace("end", "") + 'start').value);

      end = new moment(this.value);

      if (end.isBefore(start)) {
        return "endBeforeStart";
      }
    },
    autoform: {
      type: "datetime-local",
    }
  },
  recipientName: {
    type: String,
    label: "Beneficiaries"
  },
  recipientPhoneNumber: {
    type: String,
    label: "recipientPhoneNumber"
  },
  accessPointGranted: {
    label: "Access Pass Access Point Granted",
    type: [SimpleSchema.RegEx.Id],
    custom() {
      this.value = _.compact(this.value);
      if (AccessPoints.find({_id: {$in: this.value}}).fetch().length !== this.value.length)
        return "unknownIdOrDuplicateId"
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allAccessPointsOptions
      }
    }
  },
  _id: {
    type: SimpleSchema.RegEx.Id,
    label: "Access Pass _id",
    autoValue: function () {
      if (!this.isSet)
        return new Meteor.Collection.ObjectID()._str;
    },
    autoform: {
      type: "hidden",
    }
    // denyUpdate: true
  }
});

Schemas.ServiceProvider = new SimpleSchema({
  name: {
    label: "Service provider name",
    type: String,
    optional: true,
  },
  phoneNumber: {
    type: String,//SimpleSchema.RegEx.Phone,
    label: "Service Provider phone",
    optional: true,
    defaultValue: null,
    regEx: /^0{1}\d{10}$/,
  },
  email: {
    label: "Service Provider Email",
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  commentListDeveloped: {
    label: "Comments about the service provider",
    type: String,
    optional: true,
  },
  willBeThere: {
    label: "Service Provider will be there during the event ?",
    type: Boolean,
    optional: true,
    defaultValue: false
  }

});

Schemas.Activities = new SimpleSchema({
  name: {
    jsonExport: true,
    type: String,
    label: "Activity Name",
    max: 100,
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  description: {
    jsonExport: true,
    type: String,
    label: "Activity Description",
    optional: true,
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  limitToTeam: {
    label: "Is the Activity private to the responsible team ?",
    type: Boolean,
    defaultValue: false,
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  teamId: {
    jsonExport: true,
    jsonExportCustom: function (value) {
      return {
        newValue: ApiResourceActionService.readData(Schemas.references.Teams, Teams, {_id: value})[0],
        newKey: "team"
      }
    },
    type: SimpleSchema.RegEx.Id,
    label: "Activity Team",
    custom: function () {
      if (!Teams.findOne(this.value))
        return "unknownId";
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
      return 1
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allTeamsOptions
      }
    }
  },
  privilegedTeamId: {
    type: SimpleSchema.RegEx.Id,
    label: "Activity Privileged Team (if set, only users with the team will be able so see it)",
    optional: true,
    defaultValue: null,
    custom: function () {
      if (this.value && !Teams.findOne(this.value))
        return "unknownId";
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
      return 1
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allTeamsOptions
      }
    }
  },
  placeId: {
    jsonExport: true,
    jsonExportCustom: function (value) {
      return {
        newValue: ApiResourceActionService.readData(Schemas.references.Places, Places, {_id: value})[0],
        newKey: "place"
      }
    },
    type: SimpleSchema.RegEx.Id,
    label: "Activity Place",
    custom: function () {
      if (!Places.findOne(this.value))
        return "unknownId";
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
      return 1
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allPlacesOptions
      }
    }

  },
  liveEventMasterId: {
    type: SimpleSchema.RegEx.Id,
    label: "Task Live event responsible",
    custom: function () {
      if (!Meteor.users.findOne(this.value))
        return "unknownId";
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allUsersOptions
      }
    }
  },
  start: {
    jsonExport: true,
    type: Date,
    label: "Activity Start Date",
    optional: true,
    defaultValue: null,
    autoform: {
      type: "datetime-local",
    },
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  end: {
    jsonExport: true,
    type: Date,
    label: "Activity End Date",
    optional: true,
    defaultValue: null,
    autoform: {
      type: "datetime-local",
    },
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  location: {
    jsonExport: true,
    type: String,
    optional: true,
    autoform: {
      type: 'map',
      afFieldInput: {
        zoom: 16
      }
    },
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  applicationData: {
    type: Object,
    label: "Application Data",
    optional: true,
    defaultValue: {},
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  'applicationData.description': {
    jsonExport: true,
    type: String,
    label: "Application Data Description",
    optional: true
  },
  'applicationData.categoryId': {
    jsonExport: true,
    jsonExportCustom: function (value) {
      return {
        newValue: ApiResourceActionService.readData(Schemas.references.AndroidCategories, AndroidCategories, {_id: value})[0],
        newKey: "applicationData.category"
      }
    },
    type: SimpleSchema.RegEx.Id,
    label: "Application Data Category",
    optional: true, //TODO should be mandatory but can't make it work
    custom: function () {
      if (this.value)
        if (!AndroidCategories.findOne(this.value))
          return "unknownId";
      return 1
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allAndroidCategoriesOptions
      }
    }
  },
  'applicationData.picture': {
    jsonExport: true,
    jsonExportCustom: function (value) {
      return `${Meteor.manifmakerEndpoint}/cfs/files/images/${value}/${value}.JPG`;
    },
    type: String,
    label: "Application Data Principal Picture",
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        label: 'Choose file'//optional
      }
    },
  },
  'applicationData.pictures': {
    jsonExport: true,
    jsonExportCustom: function (values) {
      let result = [];
      values.forEach(value => {
        result.push(`${Meteor.manifmakerEndpoint}/cfs/files/images/${value}/${value}.JPG`)
      });
      return result;
    },
    type: [String],
    optional: true,
    label: "Add some other pictures"
  },
  'applicationData.pictures.$': {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        label: 'Choose file'//optional
      }
    },
  },
  webData: {
    type: Object,
    label: "Web Data",
    optional: true,
    defaultValue: {},
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  'webData.description': {
    jsonExport: true,
    type: String,
    optional: true,
    label: "Web Data Description",
  },
  'webData.categoryId': {
    jsonExport: true,
    jsonExportCustom: function (value) {
      return {
        newValue: ApiResourceActionService.readData(Schemas.references.WebCategories, WebCategories, {_id: value})[0],
        newKey: "webData.category"
      }
    },
    type: SimpleSchema.RegEx.Id,
    label: "Web Data Category",
    optional: true, //TODO should be mandatory but can't make it work
    custom: function () {
      if (this.value)
        if (!WebCategories.findOne(this.value))
          return "unknownId";
      return 1
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allWebCategoriesOptions
      }
    }
  },
  'webData.picture': {
    jsonExport: true,
    jsonExportCustom: function (value) {
      return `${Meteor.manifmakerEndpoint}/cfs/files/images/${value}/${value}.JPG`;
    },
    type: String,
    optional: true,
    label: "Web Data Picture",
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        label: 'Choose file'//optional
      }
    },
  },
  serviceProvider: {
    label: "Activity Service Provider",
    type: Schemas.ServiceProvider,
    optional: true,
    custom: function () {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    }
  },
  masterId: {
    type: SimpleSchema.RegEx.Id,
    label: "Task responsible",
    custom: function () {
      if (!Meteor.users.findOne(this.value))
        return "unknownId";
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.generalInformationValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allUsersOptions
      }
    }
  },
  accessPassValidation: {
    type: Schemas.Validation,
    label: "Activity access pass validation",
    defaultValue: function () {
      Schemas.Validation.clean({})
    }(),
    optional: true,
    autoform: {
      type: "hidden",
    }
  },
  equipmentValidation: {
    type: Schemas.Validation,
    label: "Activity equipments validation",
    defaultValue: function () {
      Schemas.Validation.clean({})
    }(),
    optional: true,
    autoform: {
      type: "hidden",
    }
  },
  generalInformationValidation: {
    type: Schemas.Validation,
    label: "Activity general information validation",
    defaultValue: function () {
      Schemas.Validation.clean({})
    }(),
    optional: true,
    autoform: {
      type: "hidden",
    }
  },
  equipments: {
    label: "Activity equipments",
    type: [Schemas.EquipmentAsked],
    custom() {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.equipmentValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        //initialize all equipment to 0 quantity
        return _.map(Equipments.find({targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.ACTIVITY]}}).fetch(), function (item) {
          return {equipmentId: item._id, quantity: 0};
        })
      }
    }
  },
  powerSupplyId: {
    label: "Activity power supply",
    type: SimpleSchema.RegEx.Id,
    optional: true,
    defaultValue: null,
    custom() {
      if (this.isUpdate) {
        if (this.value !== null && !PowerSupplies.findOne(this.value)) return "unknownId"
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.equipmentValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allPowerSuppliesOptions
      }
    }
  },
  waterSupplyId: {
    label: "Activity water supply",
    type: SimpleSchema.RegEx.Id,
    optional: true,
    defaultValue: null,
    custom() {
      if (this.isUpdate) {
        if (this.value !== null && !WaterSupplies.findOne(this.value)) return "unknownId"
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.equipmentValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allWaterSuppliesOptions
      }
    }
  },
  waterDisposalId: {
    label: "Activity water disposal",
    type: SimpleSchema.RegEx.Id,
    optional: true,
    defaultValue: null,
    custom() {
      if (this.isUpdate) {
        if (this.value !== null && !WaterDisposals.findOne(this.value)) return "unknownId"
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.equipmentValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allWaterDisposalsOptions
      }
    }
  },
  accessPasses: {
    label: "Activities Access Passes",
    type: [Schemas.AccessPass],
    optional: true,
    custom() {
      if (this.isUpdate) {
        var activity = Activities.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(activity.accessPassValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
  },
  specificSecurityMeasures: {
    type: String,
    label: "Activity Specific Security Measures",
    optional: true
  },

});
