import {AssignmentServiceClient} from "../client/service/AssignmentServiceClient"
import {AutoForm} from 'meteor/aldeed:autoform'
import {UserServiceClient} from "../client/service/UserServiceClient";
import {GuidedTourServiceClient} from "../client/service/tour/GuidedTourServiceClient";
import {PlayTourServiceClient} from "../client/service/tour/PlayTourServiceClient";
import {TaskScenarioServiceClient} from "../client/service/tour/TaskScenarioServiceClient";
import {Utils} from "../client/service/Utils";


AccountsTemplates.configure({
  hideSignInLink: true,
  hideSignUpLink: true,
  showForgotPasswordLink: true,
  onSubmitHook: UserServiceClient.onSubmitHook,
});

beforeLogginRoute = null;
beforeForbiddenRoute = null;
commonNavBarWrapperIsRendered = false;


Accounts.onEmailVerificationLink(function (token, done) {
  console.info("onEmailVerification with token", token);
  Accounts.verifyEmail(token, function (error) {
    if (error) Utils.onUpdateError(error);
  });

});

Accounts.onLogin(function () {
  if (beforeLogginRoute) {
    Router.go(beforeLogginRoute);
    beforeLogginRoute = null;
  }
});

Meteor.startup(function () {

  Meteor.subscribe("images");
  Meteor.subscribe("skills");
  Meteor.subscribe("users");
  Meteor.subscribe("tasks");
  Meteor.subscribe("activities");
  Meteor.subscribe("places");
  Meteor.subscribe("assignments");
  Meteor.subscribe("teams");
  Meteor.subscribe("task-groups");
  Meteor.subscribe("group-roles");
  Meteor.subscribe("roles");
  Meteor.subscribe("web-categories");
  Meteor.subscribe("android-categories");
  Meteor.subscribe("equipment-categories");
  Meteor.subscribe("equipment-storages");
  Meteor.subscribe("access-points");
  Meteor.subscribe("equipments");
  Meteor.subscribe("water-supplies");
  Meteor.subscribe("water-disposals");
  Meteor.subscribe("power-supplies");
  Meteor.subscribe("settings");
  Meteor.subscribe("export-status");
  Meteor.subscribe("assignment-terms", function () {
    AssignmentServiceClient.setCalendarTerms();
  });

  TempCollection = new Meteor.Collection(null);


  if (Meteor.isDevelopment) SimpleSchema.debug = true;
  AutoForm.addHooks(null, {
    onError: function (name, error, template) {
      Utils.onUpdateError(error.reason)
      console.error("Autoform on error :", error, "name :", name);
    },
    onSuccess: function (formType, result) {
      Utils.onUpdateSuccess();
    }
  });


  AutoForm.addHooks(null, {
    before: {
      update: function (doc) {
        _.each(doc.$set, function (value, setter) {
          if (_.isArray(value)) {
            var newValue = _.compact(value);
            doc.$set[setter] = newValue;
          }
        });
        return doc;
      }
    }
  });

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

  GoogleMaps.load({
    key: 'AIzaSyCFSHZqW6l7IpFjnybMYIfH6_9mdBGmfgE',
  });

  Status.setTemplate('semantic_ui');

});

