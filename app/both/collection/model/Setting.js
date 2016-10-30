import {Schemas} from './SchemasHelpers'

Schemas.Settings = new SimpleSchema({
    createAccountDefaultTeam:{
        label: "Default team newly created user will be added to",
        type: SimpleSchema.RegEx.Id,
        custom: function () {
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
    }
});
