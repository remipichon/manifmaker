import {ManifMakerRouterController} from "./ManifMakerRouterController"
import {PlayTourServiceClient} from "../service/tour/PlayTourServiceClient"

/**
 * @namespace Route
 */


//hide topNavBar to each expect assignment
Router.onAfterAction(function () {
    assignmentCalendarIsRendered = false;
  },
  {
    except: [
      'assignment.calendar',
      'assignment.calendar.user',
      'assignment.calendar.userToTask',
      'assignment.calendar.userToTask.user',
      'assignment.calendar.userToTask.user.date',

      'assignment.calendar.taskToUser',
      'assignment.calendar.taskToUser.task',
      'assignment.calendar.taskToUser.task.timeSlot',
    ]
  }
);


/**
 * @memberOf Route
 * @namespace Route.common
 */

/**
 * @memberOf Route.common
 * @summary Home
 * @locus client
 * @name 'home'  /
 */
Router.route('/', function () {

    this.render('home', {to: 'mainContent'})


  },
  {
    data: {currentTab: 'Home'},
    name: 'home',
    controller: ManifMakerRouterController
  }
);

/**
 * @memberOf Route.common
 * @summary Tour
 * @locus client
 * @name 'home'  /
 */
Router.route('/tour', function () {

    alert("about to inject data for your tour, click ok");
    Meteor.call("injectGuidedTourData", function (error, result) {
      if (error) {
        alert(error);
      } else {
        alert("inject happened without error, the tour will start, click ok");
        PlayTourServiceClient.playScenarii(2, result);
        Router.go("/");
      }
    });

    this.render('home', {to: 'mainContent'})
  },
  {
    data: {currentTab: 'Home'},
    name: 'tour',
    // controller: ManifMakerRouterController
  }
);

/**
 * @memberOf Route.common
 * @summary token access
 * @locus client
 * @name 'home'  /jwt/:token
 */
Router.route('/jwt/:token', function () {

    var token = this.params.token;
    Meteor.call('verifyExportUrl', token, _.bind(function (error, result) {
      Meteor.loginWithToken(result.token);
      var payload = result.payload;
      Router.go(payload.target)
    }, this));

    this.render('home', {to: 'mainContent'})


  },
  {
    data: {currentTab: 'Home'},
    name: 'token'
  }
);

/**
 * @memberOf Route.common
 * @summary Login
 * @locus client
 * @name 'login'  /login
 */
Router.route('/login', function () {
    this.render('login', {to: 'mainContent'})
  },
  {
    name: 'login',
  }
);

/**
 * @memberOf Route.common
 * @summary Login
 * @locus client
 * @name 'forbidden'  /login
 */
beforeBeforeForbiddenRoute = null;

Router.route('/forbidden', function () {

    this.wait(Meteor.subscribe("users")); //wait for user data before any attempt

    this.render("forbidden", {
      data: {
        message: "You don't have permission to access this component."
      },
      to: 'mainContent'
    });

    if (this.ready()) {
      if (beforeForbiddenRoute && beforeBeforeForbiddenRoute !== beforeForbiddenRoute) {
        beforeBeforeForbiddenRoute = beforeForbiddenRoute;
        console.info(`retrying beforeForbiddenRoute ${beforeForbiddenRoute}`);
        Router.go(beforeForbiddenRoute);

      }
    }
  },
  {
    name: 'forbidden',
  }
);


/**
 * @memberOf Route.common
 * @summary Demo du custom select
 * @locus client
 * @name 'demo-select'  /demo-select
 */
Router.route('/demo-select', function () {
    this.wait(Meteor.subscribe('users'));
    this.wait(Meteor.subscribe('tasks'));
    this.wait(Meteor.subscribe('teams'));
    this.wait(Meteor.subscribe('skills'));
    this.wait(Meteor.subscribe('power-supplies'));

    if (this.ready()) {
      this.render('demoSelect', {
        to: 'mainContent',
        data: {
          user1Id: Meteor.users.findOne({username: "user1"})._id,
          user2Id: Meteor.users.findOne({username: "user2"})._id,
          task2Id: Tasks.findOne({name: "task 2"})._id,
          team1Id: Teams.findOne({name: "team1"})._id,
          team1Idteam2Id: [Teams.findOne({name: "team1"})._id, Teams.findOne({name: "team2"})._id],
          skill1Idskill2Id: [Skills.findOne({"label": "Responsable tache 1"})._id, Skills.findOne({"label": "Responsable tache 2"})._id],
          powersupply1: PowerSupplies.findOne({name: "powerSupply1"})._id,
          updateCallbackDisplayArgs: function () {
            return function () {
              console.info("updateCallbackDisplayArgs", arguments[0], arguments[1], arguments[2]);
            }
          },
          optionQueryteamsWithoutAlreadyAssigned: {
            name: {
              $not: ASSIGNMENTREADYTEAM
            }
          },
          optionCollectionAsArray: [
            {
              label: "First option",
              value: "ONE"
            },
            {
              label: "Second cat",
              value: "TWO"
            },
            {
              label: "Cypress",
              value: "THREE"
            }
          ]
        }
      });
    } else {
      console.info("Route /demo-select : waiting data");
    }


  },
  {name: 'demo-select'}
);

/**
 * @memberOf Route.common
 * @summary Inject Dada (remove all before)
 * @locus client
 * @name 'inject-data'  /inject-data
 */
Router.route('/inject-data', function () {
    Accounts.logout();
    alert("You are about to delete all data and add some new fresh ones");
    Meteor.call("injectData", function (error, result) {
      if (error) {
        alert(error);
      } else {
        alert("inject happened without error, please log in");
        Router.go("/");
      }
    })
  },
  {name: 'inject-data'}
)


