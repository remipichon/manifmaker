import {Schemas} from './SchemasHelpers'

Schemas.Settings = new SimpleSchema({
    one:{
      label: "one",
        type: String
    },
    createAccountDefaultTeam:{
        label: "Default team newly created user will be added to",
        type: SimpleSchema.RegEx.Id,
        optional: true,
        defaultValue: null,
        custom: function () {
            if(!this.value) return 1;
            if (!Teams.findOne(this.value))
                return "unknownId";

            if(this.isInsert)
                if(Settings.findOne())
                    return "moreThanOneSettings";

            return 1
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allTeamsOptions
            }
        }
    },
    defaultGroupRoles:{
        label: "Default group roles created user will be added to",
        type: SimpleSchema.RegEx.Id,
        optional: true,
        custom: function () {
            if(!this.value) return 1;
            if (!GroupRoles.findOne(this.value))
                return "unknownId";

            if(this.isInsert)
                if(Settings.findOne())
                    return "moreThanOneSettings";

            return 1
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allGroupRolesOptionsWithoutRoles
            }
        }
    },
    defaultActivityMapsLatLng: {
        label: "Default Activity Maps Geoloc",
        type: Object,
        optional: true,
        autoform: {
            type: 'map',
        }
    },
    'defaultActivityMapsLatLng.lat': {
        type: String
    },
    'defaultActivityMapsLatLng.lng': {
        type: String
    }
});
