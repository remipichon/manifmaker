import {Schemas} from './SchemasHelpers'
import "/both/collection/model/T-Validation.js"

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
                return _.map(Equipments.find({targetUsage:{$in:[EquipementTargetUsage.BOTH,EquipementTargetUsage.TASK]}}).fetch(),function(item){return {equipmentId: item._id, quantity: 0};})
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
    }

});
