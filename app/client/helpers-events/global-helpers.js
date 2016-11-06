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
    "displayDateTime", function (date) {
        return new moment(date).format("ddd DD MMM HH[h]mm");
    }
);
Template.registerHelper(
    "skillLabel", function () {
        return Skills.findOne({_id: this.toString()}).label;
    }
);



Template.registerHelper(
    "allTeams", function () {
        return Teams.find();
    }
);

Template.registerHelper('equals', function (a, b) {
    return a === b;
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
        var userTeams = Meteor.users.findOne({_id:userId}).teams;
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

Template.registerHelper("displayValidationState",function(state){
        return DisplayedValidationState[state];
});

Template.registerHelper("RolesEnum",function(){
    return RolesEnum;
});


Template.registerHelper(
    "currentUserId", function () {
        return Meteor.users.findOne({_id: Meteor.userId()})._id;
    }
);

Template.registerHelper(
    "isCurrentUserTheOneLogged", function(currentUserId){
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

Template.registerHelper(
    "currentUserTeamId", function () {
        return Meteor.users.findOne({_id: Meteor.userId()}).teams[0]; //TODO which team to choose ?
    }
);

Template.registerHelper("cursorLength", function (array) {
        return array.fetch().length;
    }
);