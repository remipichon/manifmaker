import {AssignmentServiceClient} from "../client/service/AssignmentServiceClient"
import { AutoForm } from 'meteor/aldeed:autoform'
import {UserServiceClient} from "../client/service/UserServiceClient";


AccountsTemplates.configure({
    hideSignInLink: true,
    onSubmitHook: UserServiceClient.onSubmitHook,
});

beforeLogginRoute = null;

Meteor.startup(function () {

    Meteor.subscribe("skills");
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("places");
    Meteor.subscribe("assignments");
    Meteor.subscribe("teams");
    Meteor.subscribe("task-groups");
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
    //TODO autoform addHooks doesnt' seem to work
    AutoForm.addHooks(null, {
        onError: function (name, error, template) {
            console.log("AutoForm.addHooks : "+name + " error:", error);
        },
        onSuccess: function(formType, result) {
            if(beforeLogginRoute){
                Router.go(beforeLogginRoute);
                beforeLogginRoute = null;
            }
        }
    });


    AutoForm.addHooks(null, {
        before: {
            update: function(doc) {
                _.each(doc.$set, function(value, setter) {
                    if (_.isArray(value)) {
                        var newValue = _.compact(value);
                        doc.$set[setter] = newValue;
                    }
                });
                return doc;
            }
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

     sAlert.config({
        effect: 'stackslide',
        position: 'top',
        timeout: 2500,
        html: false,
        onRouteClose: true,
        stack: {
            spacing: 10, // in px
            limit: 3 // when fourth alert appears all previous ones are cleared
        },
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        onClose: _.noop 
    });

});

