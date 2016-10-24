import {Schemas} from './SchemasHelpers'
import {TimeSlotService} from "../../../both/service/TimeSlotService"

import "/both/collection/model/enum/EquipementTargetUsage.js"


Schemas.references = {};
Schemas.references.options = {};

/**
 * @memberOf Route.collectionReference
 * @summary Teams option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.Teams = {
    PLURAL_REFERENCE_URL: "teams",
    REFERENCE_URL: "team",
    REFERENCE_COLLECTION_NAME: "Teams",
    REFERENCE_MONGO_COLLECTION_NAME: "teams",
    REFERENCE_LABEL: "Team"
};
Schemas.references.Teams = new SimpleSchema({
    name: {
        type: String,
        label: "Team Name",
        max: 100
    },
    type: {
        type: String,
        label: "Teams type",
        autoValue: function(){
            return "Teams"
        }
    },
    baseUrl: {
        type: String,
        label: "Team base URL",
        autoValue: function(){
            return "team"
        }
    }
});
/**
 * @memberOf Collection
 * @summary Teams collection
 * @locus Anywhere
 * @instancename collection
 */
Teams = new Mongo.Collection("teams");
Teams.attachSchema(Schemas.references.Teams);

ASSIGNMENTREADYTEAM = "assignmentReadyTeam"; //team de tous les users et toutes les taches prets pour affectation

/**
 * @memberOf Route.collectionReference
 * @summary Places option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.Places = {
    PLURAL_REFERENCE_URL: "places",
    REFERENCE_URL: "place",
    REFERENCE_COLLECTION_NAME: "Places",
    REFERENCE_MONGO_COLLECTION_NAME: "places",
    REFERENCE_LABEL: "Place"
};
Schemas.references.Places = new SimpleSchema({
    name: {
        type: String,
        label: "Place Name",
        max: 100
    },
    type: {   
        type: String,
        label: "Places type",
        autoValue: function(){
            return "Places"
        }
    },
    baseUrl: {  
        type: String,
        label: "Places base URL",
        autoValue: function(){
            return "place"
        }
    }
});
/**
 * @memberOf Collection
 * @summary Places collection
 * @locus Anywhere
 * @instancename collection
 */
Places = new Mongo.Collection("places");
Places.attachSchema(Schemas.references.Places);

/**
 * @memberOf Route.collectionReference
 * @summary Skills option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.Skills = {
    PLURAL_REFERENCE_URL: "skills",
    REFERENCE_URL: "skill",
    REFERENCE_COLLECTION_NAME: "Skills",
    REFERENCE_MONGO_COLLECTION_NAME: "skills",
    REFERENCE_LABEL: "Skill"
};
Schemas.references.Skills = new SimpleSchema({
    key: {
        type: String,
        label: "Skill key",
        max: 38,
        unique: true

    },
    label: {
        type: String,
        label: "Skill Name",
        max: 100
    },
    type: {   
        type: String,
        label: "Skills type",
        autoValue: function(){
            return "Skills"
        }
    },
    baseUrl: {  
        type: String,
        label: "Skills base URL",
        autoValue: function(){
            return "skill"
        }
    }
});
/**
 * @memberOf Collection
 * @summary Skills collection
 * @locus Anywhere
 * @instancename collection
 */
Skills = new Mongo.Collection("skills");
Skills.attachSchema(Schemas.references.Skills);

/**
 * @memberOf Route.collectionReference
 * @summary AssignmentTerms option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.AssignmentTerms = {
    PLURAL_REFERENCE_URL: "assignment-terms",
    REFERENCE_URL: "assignment-term",
    REFERENCE_COLLECTION_NAME: "AssignmentTerms",
    REFERENCE_MONGO_COLLECTION_NAME: "assignment-terms",
    REFERENCE_LABEL: "Assignment Term"
};
AssignmentTermPeriod = new SimpleSchema({
    start: {
        type: Date,
        label: "Assignment Term Period Start Date",
        custom: function () {
            var start, end, currentId, terms;

            terms = _.compact(this.field("assignmentTermPeriods").value);
            end = new moment(this.field(this.key.replace("start", "") + 'end').value);

            if (!currentId)
                currentId = this.field(this.key.replace("start", "") + '_id').value;

            start = new moment(this.value);
            var termStart = this.field("start").value;
            if(new moment(start).isBefore(termStart))
                return "periodStartBeforeTerm";

            if (start.isAfter(end)) {
                return "startAfterEnd";
            }

            if (!TimeSlotService.areTimeSlotOverlappingWithQuery(terms, start, end, currentId))
                return "assignmentTermPeriodsConflictDate";
        },
        autoform: {
            type: "datetime-local",
        }
    },
    end: {
        type: Date,
        label: "Assignment Term Period End Date",
        custom: function () {
            var start, end, currentId, terms;

            terms = _.compact(this.field("assignmentTermPeriods").value);
            start = new moment(this.field(this.key.replace("end", "") + 'start').value);

            if (!currentId)
                currentId = this.field(this.key.replace("end", "") + '_id').value;

            end = new moment(this.value);
            var termEnd = this.field("end").value;
            if(new moment(end).isAfter(termEnd))
                return "periodEndAfterTerm";

            if (end.isBefore(start)) {
                return "endBeforeStart";
            }

            if (!TimeSlotService.areTimeSlotOverlappingWithQuery(terms, start, end, currentId))
                return "assignmentTermPeriodsConflictDate";
        },
        autoform: {
            type: "datetime-local",
        }
    },
    _id: {
        type: SimpleSchema.RegEx.Id,
        label: "TimeSlot _id",
        autoValue: function () {
            if(!this.isSet)
                return new Meteor.Collection.ObjectID()._str;
        },
        autoform: {
            type: "hidden",
        }
        // denyUpdate: true
    }
});
Schemas.references.AssignmentTerms = new SimpleSchema({
    name: {
        type: String,
        label: "Assignment terms Name",
        max: 100
    },
    start: {
        type: Date,
        label: "Assignment terms Start",
        custom: function () {
            var start, end, currentId, terms;

            terms = AssignmentTerms.find().fetch();
            end = new moment(this.field(this.key.replace("start", "") + 'end').value);

            currentId = this.docId;

            start = new moment(this.value);

            if (start.isAfter(end)) {
                return "startAfterEnd";
            }

            if (!TimeSlotService.areTimeSlotOverlappingWithQuery(terms, start, end, currentId))
                return "assignmentTermsConflictDate";
        },
        autoform: {
            type: "datetime-local"
        }
    },
    assignmentTermPeriods: {
        type: [AssignmentTermPeriod],
        label: "Assignment periods",
        defaultValue: [],
        optional: true
    },
    end: {
        type: Date,
        label: "Assignment terms  End (not include)",
        custom: function () {
            var start, end, currentId, terms;

            terms = AssignmentTerms.find().fetch();
            start = new moment(this.field(this.key.replace("end", "") + 'start').value);

            currentId = this.docId;

            end = new moment(this.value);

            if (end.isBefore(start)) {
                return "endBeforeStart";
            }

            if (!TimeSlotService.areTimeSlotOverlappingWithQuery(terms, start, end, currentId))
                return "assignmentTermsConflictDate";
        },
        autoform: {
            type: "datetime-local"
        }
    },
    teams: {
        label: "Assignment Term Teams",
        type: [SimpleSchema.RegEx.Id],
        optional: true,
        custom: function () {
            this.value = _.compact(this.value);
            if(Teams.find({_id:{$in:this.value}}).fetch().length !== this.value.length)
                return "unknownIdOrDuplicateId"
        },
    },
    'teams.$': {
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allTeamsOptions
            }
        }
    },
    type: {   
        type: String,
        label: "Assignment terms type",
        autoValue: function(){
            return "AssignmentTerms"
        }
    },
    baseUrl: {  
        type: String,
        label: "Assignment terms base URL",
        autoValue: function(){
            return "assignment-term";
        }
    }
});
/**
 * @memberOf Collection
 * @summary AssignmentTerms collection
 * @locus Anywhere
 * @instancename collection
 */
AssignmentTerms = new Mongo.Collection("assignment-terms");
AssignmentTerms.attachSchema(Schemas.references.AssignmentTerms);

/**
 * @memberOf Route.collectionReference
 * @summary GroupRoles option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.GroupRoles = {
    PLURAL_REFERENCE_URL: "group-roles",
    REFERENCE_URL: "group-role",
    REFERENCE_COLLECTION_NAME: "GroupRoles",
    REFERENCE_MONGO_COLLECTION_NAME: "group_roles",
    REFERENCE_LABEL: "Group Role"
};
Schemas.references.GroupRoles = new SimpleSchema({
    name: {
        type: String,
        label: "Group role Name",
        max: 100,
        unique: true
    },
    roles: {
        type: [String],
        label: "Group role roles",
        custom: function () {
            Roles.getAllRoles();
            this.value = _.compact(this.value);
            if (_.uniq(this.value).length !== this.value.length)
                return "duplicate"
        },
        autoValue: function () {
            return _.compact(this.value);
        }
    },
    'roles.$': {
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allRolesOptions
            }
        }
    },
    type: {   
        type: String,
        label: "Roles type",
        autoValue: function(){
            return "Roles"
        }
    },
    baseUrl: {  
        type: String,
        label: "Group roles base URL",
        autoValue: function(){
            return "group-role"
        }
    }
});
/**
 * @memberOf Collection
 * @summary Teams collection
 * @locus Anywhere
 * @instancename collection
 */
GroupRoles = new Mongo.Collection("group_roles");
GroupRoles.attachSchema(Schemas.references.GroupRoles);

/**
 * @memberOf Route.collectionReference
 * @summary EquipmentCategories option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.EquipmentCategory = {
    PLURAL_REFERENCE_URL: "equipment-categories",
    REFERENCE_URL: "equipment-category",
    REFERENCE_COLLECTION_NAME: "EquipmentCategories",
    REFERENCE_LABEL: "Equipment Category"
};
Schemas.references.EquipmentCategories = new SimpleSchema({
    name: {
        type: String,
        label: "Equipment Category Name",
        max: 100
    },
    type: {   
        type: String,
        label: "Equipment categories type",
        autoValue: function(){
            return "EquipmentCategories"
        }
    },
    baseUrl: {  
        type: String,
        label: "Equipment Category base URL",
        autoValue: function(){
            return "equipment-category"
        }
    }
});
/**
 * @memberOf Collection
 * @summary EquipmentCategories collection
 * @locus Anywhere
 * @instancename collection
 */
EquipmentCategories = new Mongo.Collection("equipment_categories");
EquipmentCategories.attachSchema(Schemas.references.EquipmentCategories);

/**
 * @memberOf Route.collectionReference
 * @summary Equipments option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.Equipments = {
    PLURAL_REFERENCE_URL: "equipments",
    REFERENCE_URL: "equipment",
    REFERENCE_COLLECTION_NAME: "Equipments",
    REFERENCE_LABEL: "Equipment"
};
Schemas.references.Equipments = new SimpleSchema({
    name: {
        type: String,
        label: "Equipments Name",
        max: 100
    },
    quantity: {
        type: Number,
        label: "Equipment available quantity",
        min: 0
    },
    targetUsage: {
        type: String,
        label: "Equipment target usage",
        autoform: {
            afFieldInput: {
                options: [
                    {
                        label: EquipementTargetUsage.TASK,
                        value: EquipementTargetUsage.TASK
                    },
                    {
                        label: EquipementTargetUsage.ACTIVITY,
                        value: EquipementTargetUsage.ACTIVITY
                    },
                    {
                        label: EquipementTargetUsage.BOTH,
                        value: EquipementTargetUsage.BOTH
                    }
                ]
            }
        }
    },
    EquipmentCategories_Id: {
        type: SimpleSchema.RegEx.Id,
        label: "Equipment Category",
        custom: function () {
            if (!EquipmentCategories.findOne(this.value))
                return "unknownId";
            return 1
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allEquipmentCategoriesOptions
            }
        }
    },
    type: {   
        type: String,
        label: "Equipments type",
        autoValue: function(){
            return "Equipments"
        }
    },
    baseUrl: {  
        type: String,
        label: "Equipments base URL",
        autoValue: function(){
            return "equipment"
        }
    }
});
/**
 * @memberOf Collection
 * @summary Equipments collection
 * @locus Anywhere
 * @instancename collection
 */
Equipments = new Mongo.Collection("equipments");
Equipments.attachSchema(Schemas.references.Equipments);

/**
 * @memberOf Route.collectionReference
 * @summary WaterSupply option to automatically generate routes and forms
 * @description see code to get the value
 */
Schemas.references.options.WaterSupply = {
    PLURAL_REFERENCE_URL: "water-supplies",
    REFERENCE_URL: "water-supply",
    REFERENCE_COLLECTION_NAME: "WaterSupplies",
    REFERENCE_LABEL: "Water supply"
};
Schemas.references.WaterSupplies = new SimpleSchema({
    name: {
        type: String,
        label: "WaterSupply Name",
        max: 100
    },
    type: {   
        type: String,
        label: "WaterSupply type",
        autoValue: function(){
            return "WaterSupplies"
        }
    },
    baseUrl: {  
        type: String,
        label: "WaterSupply base URL",
        autoValue: function(){
            return "water-supply"
        }
    }
});
/**
 * @memberOf Collection
 * @summary WaterSupplies collection
 * @locus Anywhere
 * @instancename collection
 */
WaterSupplies = new Mongo.Collection("water_supplies");
WaterSupplies.attachSchema(Schemas.references.WaterSupplies);

/**
 * @memberOf Route.collectionReference
 * @summary WaterDisposal option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.WaterDisposal = {
    PLURAL_REFERENCE_URL: "water-disposals",
    REFERENCE_URL: "water-disposal",
    REFERENCE_COLLECTION_NAME: "WaterDisposals",
    REFERENCE_LABEL: "Water disposal"
};
Schemas.references.WaterDisposals = new SimpleSchema({
    name: {
        type: String,
        label: "WaterDisposal Name",
        max: 100
    },
    type: {   
        type: String,
        label: "WaterDisposal type",
        autoValue: function(){
            return "WaterDisposals"
        }
    },
    baseUrl: {  
        type: String,
        label: "WaterDisposal base URL",
        autoValue: function(){
            return "water-disposal"
        }
    }
});
/**
 * @memberOf Collection
 * @summary WaterDisposals collection
 * @locus Anywhere
 * @instancename collection
 */
WaterDisposals = new Mongo.Collection("water_disposals");
WaterDisposals.attachSchema(Schemas.references.WaterDisposals);

/**
 * @memberOf Route.collectionReference
 * @summary PowerSupplies option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.PowerSupplies = {
    PLURAL_REFERENCE_URL: "power-supplies",
    REFERENCE_URL: "power-supply",
    REFERENCE_COLLECTION_NAME: "PowerSupplies",
    REFERENCE_LABEL: "Power Supply"
};
Schemas.references.PowerSupplies = new SimpleSchema({
    name: {
        type: String,
        label: "PowerSupply Name",
        max: 100
    },
    type: {   
        type: String,
        label: "PowerSupply type",
        autoValue: function(){
            return "PowerSupplies"
        }
    },
    baseUrl: {  
        type: String,
        label: "PowerSupply base URL",
        autoValue: function(){
            return "power-supply"
        }
    }
});
/**
 * @memberOf Collection
 * @summary PowerSupplies collection
 * @locus Anywhere
 * @instancename collection
 */
PowerSupplies = new Mongo.Collection("power_supplies");
PowerSupplies.attachSchema(Schemas.references.PowerSupplies);

/**
 * @memberOf Route.collectionReference
 * @summary EquipmentStorage option to automatically generate routes and forms
 * @description see code to get the values
 */
Schemas.references.options.EquipmentStorage = {
    PLURAL_REFERENCE_URL: "equipment-storages",
    REFERENCE_URL: "equipment-storage",
    REFERENCE_COLLECTION_NAME: "EquipmentStorages",
    REFERENCE_LABEL: "Equipment Storage"
};
Schemas.references.EquipmentStorages = new SimpleSchema({
    name: {
        type: String,
        label: "EquipmentStorage Name",
        max: 100
    },
    type: {   
        type: String,
        label: "EquipmentStorage type",
        autoValue: function(){
            return "EquipmentStorages"
        }
    },
    baseUrl: {  
        type: String,
        label: "EquipmentStorage base URL",
        autoValue: function(){
            return "equipment-storage"
        }
    }
});
/**
 * @memberOf Collection
 * @summary EquipmentStorages collection
 * @locus Anywhere
 * @instancename collection
 */
EquipmentStorages = new Mongo.Collection("equipment_storages");
EquipmentStorages.attachSchema(Schemas.references.EquipmentStorages);

