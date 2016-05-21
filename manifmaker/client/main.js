import {AssignmentServiceClient} from "../client/service/AssignmentServiceClient"

defaultFilter = {};
noSearchFilter = "";
noneFilter = {none: "none"};

//TODO don't user global var
UserFilter = new ReactiveVar(defaultFilter);
UserIndexFilter = new ReactiveVar(noSearchFilter);
UserTeamFilter = new ReactiveVar(defaultFilter);
UserSkillsFilter = new ReactiveVar(defaultFilter);
TaskFilter = new ReactiveVar(defaultFilter);
TaskIndexFilter = new ReactiveVar(noSearchFilter);
TaskTeamFilter = new ReactiveVar(defaultFilter);
DisplayAssignedTask = new ReactiveVar(false);
CurrentAssignmentType = new ReactiveVar(AssignmentType.ALL);
TaskSkillsFilter = new ReactiveVar(null);
TaskNeededTeamFilter = new ReactiveVar(null);


//

SelectedUser = new ReactiveVar(null);
SelectedTask = new ReactiveVar(null);
SelectedTaskBreadCrumb = new ReactiveVar(null); //TODO voir si on peut la merger avec SelectedTask
SelectedTimeSlot = new ReactiveVar(null);
SelectedDate = new ReactiveVar(null);

SelectedAvailability = new ReactiveVar(null);
SelectedPeopleNeed = new ReactiveVar(null);

AssignmentFilter = new ReactiveVar(defaultFilter);
IsUnassignment = new ReactiveVar(false);

TaskListTeamFilter = new ReactiveVar(defaultFilter);


Meteor.startup(function () {
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.subscribe("skills");
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("places");
    Meteor.subscribe("assignments");
    Meteor.subscribe("teams");
    Meteor.subscribe("groups");
    Meteor.subscribe("group-roles");
    Meteor.subscribe("roles");
    Meteor.subscribe("equipment-categories");
    Meteor.subscribe("equipment-storages");
    Meteor.subscribe("equipments");
    Meteor.subscribe("water-supplies");
    Meteor.subscribe("water-disposals");
    Meteor.subscribe("power-supplies");
    Meteor.subscribe("assignment-terms", function () {
        AssignmentServiceClient.setCalendarTerms();
    });

    TempCollection = new Meteor.Collection(null)


    SimpleSchema.debug = true;
    AutoForm.addHooks(null, {
        onError: function (name, error, template) {
            console.log("AutoForm.addHooks : "+name + " error:", error);
        }
    });

    var accuracy = CalendarAccuracyEnum["1"];
    AssignmentServiceClient.setCalendarAccuracy(accuracy);


    //hide custom select popover when click outside popover
    $('body').on('click', function (e) {
        $('.custom-select-label-wrapper[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
});

