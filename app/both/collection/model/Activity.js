import {Schemas} from './SchemasHelpers'
import {ValidationService} from "../../../both/service/ValidationService"
import "/both/collection/model/T-Validation.js"

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
        custom(){
            this.value = _.compact(this.value);
            if(AccessPoints.find({_id:{$in:this.value}}).fetch().length !== this.value.length)
                return "unknownIdOrDuplicateId"
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allAccessPointsOptions
            }
        }
    },
});

Schemas.Activities = new SimpleSchema({
    name: {
        type: String,
        label: "Task Name",
        max: 100
    },
    description: {
        type: String,
        label: "Task Description",
        optional: true
    },
    teamId: {
        type: SimpleSchema.RegEx.Id,
        label: "Task Team",
        custom: function () {
            if (!Teams.findOne(this.value))
                return "unknownId";
            return 1
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allTeamsOptions
            }
        }
    },
    placeId: {
        type: SimpleSchema.RegEx.Id,
        label: "Task Place",
        custom: function () {
            if (!Places.findOne(this.value))
                return "unknownId";
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
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allUsersOptions
            }
        }
    },
    masterId: {
        type: SimpleSchema.RegEx.Id,
        label: "Task responsible",
        custom: function () {
            if (!Meteor.users.findOne(this.value))
                return "unknownId";
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
        defaultValue: function(){Schemas.Validation.clean({})}(),
        optional: true,
        autoform: {
            type: "hidden",
        }
    },
    equipmentValidation: {
        type: Schemas.Validation,
        label: "Activity equipments validation",
        defaultValue: function(){Schemas.Validation.clean({})}(),
        optional: true,
        autoform: {
            type: "hidden",
        }
    },
    equipments: {
        label: "Activity equipments",
        type: [Schemas.EquipmentAsked],
        custom(){
            if (this.isUpdate) {
                var activity = Activities.findOne(this.docId);
                if(!ValidationService.isUpdateAllowed(activity.equipmentValidation.currentState)){
                    return "updateNotAllowed"
                }
            }
        },
        optional: true,
        autoValue: function () {
            if(this.isInsert){
                //initialize all equipment to 0 quantity
                return _.map(Equipments.find({targetUsage:{$in:[EquipementTargetUsage.BOTH,EquipementTargetUsage.ACTIVITY]}}).fetch(),function(item){return {equipmentId: item._id, quantity: 0};})
            }
        }
    },
    powerSupplyId :{
        label: "Activity power supply",
        type: SimpleSchema.RegEx.Id,
        optional: true,
        defaultValue: null,
        custom(){
            if (this.isUpdate) {
                if(this.value !== null && !PowerSupplies.findOne(this.value)) return "unknownId"
                var activity = Activities.findOne(this.docId);
                if(!ValidationService.isUpdateAllowed(activity.equipmentValidation.currentState)){
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
    waterSupplyId :{
        label: "Activity water supply",
        type: SimpleSchema.RegEx.Id,
        optional: true,
        defaultValue: null,
        custom(){
            if (this.isUpdate) {
                if(this.value !== null && !WaterSupplies.findOne(this.value)) return "unknownId"
                var activity = Activities.findOne(this.docId);
                if(!ValidationService.isUpdateAllowed(activity.equipmentValidation.currentState)){
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
    waterDisposalId :{
        label: "Activity water disposal",
        type: SimpleSchema.RegEx.Id,
        optional: true,
        defaultValue: null,
        custom(){
            if (this.isUpdate) {
                if(this.value !== null && !WaterDisposals.findOne(this.value)) return "unknownId"
                var activity = Activities.findOne(this.docId);
                if(!ValidationService.isUpdateAllowed(activity.equipmentValidation.currentState)){
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
        optional: true
    },

});
