import {Schemas} from "./SchemasHelpers";

Schemas.TaskGroups = new SimpleSchema({
  name: {
    type: String,
    label: "Task Group Name",
    max: 100
  },
  description: {
    type: String,
    label: "Task Group Description",
    optional: true
  },
  teamId: {
    type: SimpleSchema.RegEx.Id,
    label: "Task Group Team",
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
  }
});

