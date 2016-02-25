/**
 * @memberOf Route
 * @summary References collections URL
 *
 * Collection Name => URL
 *
 * Teams => team
 *
 * Places => place
 *
 * Skills => skill
 *
 * AssignmentTerms => assignment-term
 *
 * GroupRoles => group-role
 *
 * @locus client
 * @name Collection References
 */
var forDocOnly = {};
Schemas.references = {};
Schemas.references.options = {};


Schemas.references.options.Teams = {
    PLURAL_REFERENCE_URL: "teams",
    REFERENCE_URL: "team",
    REFERENCE_COLLECTION_NAME: "Teams",
    REFERENCE_MONGO_COLLECTION_NAME: "teams",
    REFERENCE_LABEL: "Team",
};
Schemas.references.Teams = new SimpleSchema({
    name: {
        type: String,
        label: "Team Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Teams type",
        defaultValue: "Teams"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Team base URL",
        defaultValue: "team"
    }
});
/**
 * @memberOf Models
 * @summary Teams collection
 * @locus Anywhere
 * @instancename collection
 */
Teams = new Mongo.Collection("teams");
Teams.attachSchema(Schemas.references.Teams);

Schemas.references.options.Places = {
    PLURAL_REFERENCE_URL: "places",
    REFERENCE_URL: "place",
    REFERENCE_COLLECTION_NAME: "Places",
    REFERENCE_MONGO_COLLECTION_NAME: "places",
    REFERENCE_LABEL: "Place",
};
Schemas.references.Places = new SimpleSchema({
    name: {
        type: String,
        label: "Place Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Places type",
        defaultValue: "Places",
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Places base URL",
        defaultValue: "place",
    }
});
/**
 * @memberOf Models
 * @summary Places collection
 * @locus Anywhere
 * @instancename collection
 */
Places = new Mongo.Collection("places");
Places.attachSchema(Schemas.references.Places);

Schemas.references.options.Skills = {
    PLURAL_REFERENCE_URL: "skills",
    REFERENCE_URL: "skill",
    REFERENCE_COLLECTION_NAME: "Skills",
    REFERENCE_MONGO_COLLECTION_NAME: "skills",
    REFERENCE_LABEL: "Skill",
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
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Skills type",
        defaultValue: "Skills"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Skills base URL",
        defaultValue: "skill"
    }
});
/**
 * @memberOf Models
 * @summary Skills collection
 * @locus Anywhere
 * @instancename collection
 */
Skills = new Mongo.Collection("skills");
Skills.attachSchema(Schemas.references.Skills);

//TODO les assignments terms ne peuvent pas se chevaucher
Schemas.references.options.AssignmentTerms = {
    PLURAL_REFERENCE_URL: "assignment-terms",
    REFERENCE_URL: "assignment-term",
    REFERENCE_COLLECTION_NAME: "AssignmentTerms",
    REFERENCE_MONGO_COLLECTION_NAME: "assignment-terms",
    REFERENCE_LABEL: "Assignment Term",
};
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
            if (new moment(this.value).isAfter(new moment(this.key.replace("start", "") + this.field('end').value))) {
                return "startAfterEnd";
            }
        },
        autoform: {
            type: "datetime-local"
        }
    },
    end: {
        type: Date,
        label: "Assignment terms  End (not include)",
        autoform: {
            type: "datetime-local"
        },
        custom: function () {
            if (new moment(this.value).isBefore(new moment(this.field(this.key.replace("end", "") + 'start').value))) {
                return "endBeforeStart";
            }
        }
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Assignment terms type",
        defaultValue: "AssignmentTerms"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Assignment terms base URL",
        defaultValue: "assignment-term"
    }
});
/**
 * @memberOf Models
 * @summary AssignmentTerms collection
 * @locus Anywhere
 * @instancename collection
 */
AssignmentTerms = new Mongo.Collection("assignment-terms");
AssignmentTerms.attachSchema(Schemas.references.AssignmentTerms);

Schemas.references.options.GroupRoles = {
    PLURAL_REFERENCE_URL: "group-roles",
    REFERENCE_URL: "group-role",
    REFERENCE_COLLECTION_NAME: "GroupRoles",
    REFERENCE_MONGO_COLLECTION_NAME: "group_roles",
    REFERENCE_LABEL: "Group Role",
};
Schemas.references.GroupRoles = new SimpleSchema({
    name: {
        type: String,
        label: "Group role Name",
        max: 100
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
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Roles type",
        defaultValue: "Roles"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Group roles base URL",
        defaultValue: "group-role"
    }
});
/**
 * @memberOf Models
 * @summary Teams collection
 * @locus Anywhere
 * @instancename collection
 */
GroupRoles = new Mongo.Collection("group_roles");
GroupRoles.attachSchema(Schemas.references.GroupRoles);


Schemas.references.options.EquipmentCategory = {
    PLURAL_REFERENCE_URL: "equipment-categories",
    REFERENCE_URL: "equipment-category",
    REFERENCE_COLLECTION_NAME: "EquipmentCategories",
    REFERENCE_MONGO_COLLECTION_NAME: "equipment_categories", //TODO remove for all references
    REFERENCE_LABEL: "Equipment Category",
};
Schemas.references.EquipmentCategories = new SimpleSchema({
    name: {
        type: String,
        label: "Equipment Category Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Equipment categories type",
        defaultValue: "EquipmentCategories"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Equipment Category base URL",
        defaultValue: "equipment-category"
    }
});
/**
 * @memberOf Models
 * @summary EquipmentCategories collection
 * @locus Anywhere
 * @instancename collection
 */
EquipmentCategories = new Mongo.Collection("equipment_categories");
EquipmentCategories.attachSchema(Schemas.references.EquipmentCategories);


Schemas.references.options.Equipments = {
    PLURAL_REFERENCE_URL: "equipments",
    REFERENCE_URL: "equipment",
    REFERENCE_COLLECTION_NAME: "Equipments",
    REFERENCE_MONGO_COLLECTION_NAME: "equipments", //TODO remove for all references
    REFERENCE_LABEL: "Equipment",
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
        min: 0,
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
        },
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Equipments type",
        defaultValue: "Equipments"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "Equipments base URL",
        defaultValue: "equipment"
    }
});
/**
 * @memberOf Models
 * @summary Equipments collection
 * @locus Anywhere
 * @instancename collection
 */
Equipments = new Mongo.Collection("equipments");
Equipments.attachSchema(Schemas.references.Equipments);

Schemas.references.options.WaterSupply = {
    PLURAL_REFERENCE_URL: "water-supplies",
    REFERENCE_URL: "water-supply",
    REFERENCE_COLLECTION_NAME: "WaterSupplies",
    REFERENCE_MONGO_COLLECTION_NAME: "water_supplies", //TODO remove for all references
    REFERENCE_LABEL: "Water supply",
};
Schemas.references.WaterSupplies = new SimpleSchema({
    name: {
        type: String,
        label: "WaterSupply Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "WaterSupply type",
        defaultValue: "WaterSupplies"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "WaterSupply base URL",
        defaultValue: "water-supply"
    }
});
/**
 * @memberOf Models
 * @summary WaterSupplies collection
 * @locus Anywhere
 * @instancename collection
 */
WaterSupplies = new Mongo.Collection("water_supplies");
WaterSupplies.attachSchema(Schemas.references.WaterSupplies);


Schemas.references.options.WaterDisposal = {
    PLURAL_REFERENCE_URL: "water-disposals",
    REFERENCE_URL: "water-disposal",
    REFERENCE_COLLECTION_NAME: "WaterDisposals",
    REFERENCE_MONGO_COLLECTION_NAME: "water_disposals", //TODO remove for all references
    REFERENCE_LABEL: "Water disposal",
};
Schemas.references.WaterDisposals = new SimpleSchema({
    name: {
        type: String,
        label: "WaterDisposal Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "WaterDisposal type",
        defaultValue: "WaterDisposals"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "WaterDisposal base URL",
        defaultValue: "water-disposal"
    }
});
/**
 * @memberOf Models
 * @summary WaterDisposals collection
 * @locus Anywhere
 * @instancename collection
 */
WaterDisposals = new Mongo.Collection("water_disposals");
WaterDisposals.attachSchema(Schemas.references.WaterDisposals);


Schemas.references.options.PowerSupplies = {
    PLURAL_REFERENCE_URL: "power-supplies",
    REFERENCE_URL: "power-supply",
    REFERENCE_COLLECTION_NAME: "PowerSupplies",
    REFERENCE_MONGO_COLLECTION_NAME: "power_supplies", //TODO remove for all references
    REFERENCE_LABEL: "Power Supply",
};
Schemas.references.PowerSupplies = new SimpleSchema({
    name: {
        type: String,
        label: "PowerSupply Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "PowerSupply type",
        defaultValue: "PowerSupplies"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "PowerSupply base URL",
        defaultValue: "power-supply"
    }
});
/**
 * @memberOf Models
 * @summary PowerSupplies collection
 * @locus Anywhere
 * @instancename collection
 */
PowerSupplies = new Mongo.Collection("power_supplies");
PowerSupplies.attachSchema(Schemas.references.PowerSupplies);


Schemas.references.options.EquipmentStorage = {
    PLURAL_REFERENCE_URL: "equipment-storages",
    REFERENCE_URL: "equipment-storage",
    REFERENCE_COLLECTION_NAME: "EquipmentStorages",
    REFERENCE_MONGO_COLLECTION_NAME: "equipment_storages", //TODO remove for all references
    REFERENCE_LABEL: "Equipment Storage",
};
Schemas.references.EquipmentStorages = new SimpleSchema({
    name: {
        type: String,
        label: "EquipmentStorage Name",
        max: 100
    },
    type: {  //TODO pas possible d'etre saisie par le user
        type: String,
        label: "EquipmentStorage type",
        defaultValue: "EquipmentStorages"
    },
    baseUrl: { //TODO pas possible d'etre saisie par le user
        type: String,
        label: "EquipmentStorage base URL",
        defaultValue: "equipment-storage"
    }
});
/**
 * @memberOf Models
 * @summary EquipmentStorages collection
 * @locus Anywhere
 * @instancename collection
 */
EquipmentStorages = new Mongo.Collection("equipment_storages");
EquipmentStorages.attachSchema(Schemas.references.EquipmentStorages);

