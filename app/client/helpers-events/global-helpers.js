import {Utils} from "../service/Utils";

Template.registerHelper(
  "displayHours", function (date) {
    return new moment(date).format("H[h]");
  }
);
Template.registerHelper(
  "displayHoursMinute", function (date) {
    return new moment(date).format("H[h]mm");
  }
);
Template.registerHelper(
  "displayHoursMinuteSeconde", function (date) {
    return new moment(date).format("H[h]mm ss[sec]");
  }
);
Template.registerHelper(
  "displayDateTime", function (date) {
    return new moment(date).format("ddd DD MMM HH[h]mm");
  }
);
Template.registerHelper(
  "displayDay", function (date) {
    return new moment(date).format("DD MMM");
  }
);
Template.registerHelper(
  "skillLabel", function () {
    return Skills.findOne({_id: this.toString()}).label;
  }
);

Template.registerHelper(
  "onUpdateError", function (error) {
    return function (error) {
      Utils.onUpdateError(error.reason)
    }
  });

Template.registerHelper(
  "onUpdateSuccess", function (message) {
    return function (message) {
      Utils.onUpdateSuccess(message);
    }
  });

Template.registerHelper(
  "onDeleteError", function (error) {
    return function (error) {
      Utils.onUpdateError(error.reason)
    }
  });

Template.registerHelper(
  "onDeleteSuccess", function (message) {
    return function (message) {
      Utils.onUpdateSuccess(message);
    }
  });


Template.registerHelper(
  "allTeams", function () {
    return Teams.find();
  }
);

Template.registerHelper('equals', function (a, b) {
  return a === b;
});
Template.registerHelper('adds', function (a, b) {
  return a + b;
});


Template.registerHelper(
  "allOptionsTeams", function () {
    return Teams.find({
      name: {
        $ne: ASSIGNMENTREADYTEAM
      }
    });
  }
);

Template.registerHelper(
  "allSkills", function (userId) {
    var userTeams = Meteor.users.findOne({_id: userId}).teams;
    return Skills.find({
      teams: {
        $in: userTeams
      }
    });
  }
);


Template.registerHelper('ifNotEmpty', function (item, options) {
  if (item) {
    if (item instanceof Array) {
      if (item.length > 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      if (item.fetch().length > 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  } else {
    return options.inverse(this);
  }
});

Template.registerHelper("equals", function (a, b) {
    return a === b;
  }
);
Template.registerHelper("isMore", function (a, b) {
    return a > b;
  }
);

Template.registerHelper("displayValidationState", function (state) {
  return DisplayedValidationState[state];
});

Template.registerHelper("RolesEnum", function () {
  return RolesEnum;
});


Template.registerHelper(
  "currentUserId", function () {
    return Meteor.users.findOne({_id: Meteor.userId()})._id;
  }
);

Template.registerHelper(
  "isCurrentUserTheOneLogged", function (currentUserId) {
    return currentUserId === Meteor.users.findOne({_id: Meteor.userId()})._id;
  }
)

Template.registerHelper(
  "currentUserIdObject", function () {
    return {
      _id: Meteor.users.findOne({_id: Meteor.userId()})._id
    }
  }
);


Template.registerHelper("cursorLength", function (array) {
    return array.fetch().length;
  }
);