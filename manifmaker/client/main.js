import {AssignmentServiceClient} from "../client/service/AssignmentServiceClient"



//AssignmentReactiveVars = {
//    UserFilter: new ReactiveVar(defaultFilter), //route and service
//    UserIndexFilter: new ReactiveVar(noSearchFilter), //route and service
//    TaskFilter: new ReactiveVar(defaultFilter), //route and calendar component
//    TaskIndexFilter: new ReactiveVar(noSearchFilter), //route
//    CurrentAssignmentType: new ReactiveVar(AssignmentType.ALL), //service and route
//    SelectedUser : new ReactiveVar(null), //route and menu
//    SelectedTask: new ReactiveVar(null),//route and menu
//    SelectedTaskBreadCrumb: new ReactiveVar(null), //TODO voir si on peut la merger avec AssignmentReactiveVars.SelectedTask
//    SelectedTimeSlot: new ReactiveVar(null), //route and menu
//    SelectedDate: new ReactiveVar(null),//rpute and menu
//    SelectedAvailability: new ReactiveVar(null), //rpute and menu
//    SelectedPeopleNeed: new ReactiveVar(null), //service and cmponentn
//    IsUnassignment: new ReactiveVar(false) //menu and service
//};



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

