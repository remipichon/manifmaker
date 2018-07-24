import {SecurityServiceClient} from "../../client/service/SecurityServiceClient";
import {ManifMakerRouterController} from "./ManifMakerRouterController";
import {ExportRouterController} from "./ExportRouterController";

/**
 * @memberOf Route
 * @namespace Route.User
 */

/**
 * @memberOf Route.User
 * @summary Display the user list with filter and search
 * @locus client
 * @name 'user.list'  /users
 */
Router.route('/users', function () {
    //everyone can at least edit its own profile
    console.info("routing", "/users");
    this.render('usersList', {
      to: 'mainContent'
    });
  },
  {data: {currentTab: 'Users'}, controller: ManifMakerRouterController, name: 'user.list'}
);

/**
 * @memberOf Route.User
 * @summary Redirect tp the register user form
 * @locus client
 * @name 'user.create'  /user
 */
Router.route('/user', function () {
    Router.go("/register");
  },
  {data: {currentTab: 'Users'}, name: 'user.create'}
);

/**
 * @memberOf Route.User
 * @summary Display register form
 * @locus client
 * @name 'user.register'  /user
 */
Router.route('/register', function () {
    console.info("routing", "/register");
  },
  {data: {currentTab: 'Users'}, name: 'user.register', layoutTemplate: "register"}
);

/**
 * @memberOf Route.User
 * @summary Display the user update form by it's MongoId
 * @locus client
 * @param userId
 * @name 'user.read'  /user/:_id
 */
Router.route('/user/:_id', function () {
    if (!Meteor.users.findOne(this.params._id)) {
      throw new Meteor.Error("404", "User not found");
      return;
    }
    if (Meteor.users.findOne(this.params._id)._id !== Meteor.userId())
      SecurityServiceClient.grantAccessToPage(RolesEnum.USERWRITE);

    console.info("routing", "/user/" + this.params._id);
    this.render('updateUserForm', {
      data: function () {
        var currentUser = this.params._id;
        return Meteor.users.findOne({_id: currentUser});
      }, to: 'mainContent'
    });
  },
  {data: {currentTab: 'Users'}, controller: ManifMakerRouterController, name: 'user.write'}
);

/**
 * @memberOf Route.User
 * @summary Display the user in read mode by it's MongoId
 * @locus client
 * @param userId
 * @name 'user.read'  /user/:_id/read
 */
Router.route('/user/:_id/read', function () {
    if (!Meteor.users.findOne({_id: this.params._id})) {
      throw new Meteor.Error("404", "User not found");
    }
    if (Meteor.users.findOne(this.params._id)._id !== Meteor.userId())
      SecurityServiceClient.grantAccessToPage(RolesEnum.USERREAD);

    console.info("routing", "/user/" + this.params._id);
    this.render('readUserForm', {
      data: function () {
        var currentUser = this.params._id;
        return Meteor.users.findOne({_id: currentUser});
      }, to: 'mainContent'
    });
  },
  {data: {currentTab: 'Users'}, controller: ManifMakerRouterController, name: 'user.read'}
);

/**
 * @memberOf Route.User
 * @summary Display the user HTML agenda by it's MongoId
 * @locus client
 * @param userId
 * @name 'user.export'  /user/:_id/export/html
 */
Router.route('/user/:_id/export/html', function () {
    if (!Meteor.users.findOne({_id: this.params._id})) {
      throw new Meteor.Error("404", "User not found");
    }
    if (Meteor.users.findOne(this.params._id)._id !== Meteor.userId())
      SecurityServiceClient.grantAccessToPage(RolesEnum.USERREAD);

    console.info("routing", "/user/" + this.params._id + "/export/html");
    this.render('exportUserAssignment', {
      data: function () {
        var currentUser = this.params._id;
        return Meteor.users.findOne({_id: currentUser});
      }, to: 'mainContent'
    });
  },
  {data: {currentTab: 'Users'}, controller: ExportRouterController, name: 'user.export.html'}
);


/**
 * @memberOf Route.User
 * @summary Display the user clean HTML agenda by it's MongoId, ready for print
 * @locus client
 * @param userId
 * @name 'user.export'  /user/:_id/export/html/clean
 */
Router.route('/user/:_id/export/html/clean', function () {
    if (!Meteor.users.findOne({_id: this.params._id})) {
      throw new Meteor.Error("404", "User not found");
    }
    if (Meteor.users.findOne(this.params._id)._id !== Meteor.userId())
      SecurityServiceClient.grantAccessToPage(RolesEnum.USERREAD);

    console.info("routing", "/user/" + this.params._id + "/export/html/clean");
    this.render('exportUserAssignment', {
      data: function () {
        var currentUser = this.params._id;
        let user = Meteor.users.findOne({_id: currentUser});
        user.cleanHtmlToPrint = true;
        return user;
      }, to: 'mainContent'
    });
  },
  {data: {currentTab: 'Users'}, controller: ExportRouterController, name: 'user.export.html.clean'}
);

/**
 * @memberOf Route.User
 * @summary Download the user PDF agenda by it's MongoId
 * @locus client
 * @param userId
 * @name 'user.export'  /user/:_id/export/pdf
 */
Router.route('/user/:_id/export/pdf', function () {
    if (!Meteor.users.findOne({_id: this.params._id})) {
      throw new Meteor.Error("404", "User not found");
    }
    if (Meteor.users.findOne(this.params._id)._id !== Meteor.userId())
      SecurityServiceClient.grantAccessToPage(RolesEnum.USERREAD);

    var options = [{
      url: "/user/" + this.params._id + "/export/html",
      fileName: Meteor.users.findOne(this.params._id).username + ".pdf"
    }];

    console.info("routing", "/user/" + this.params._id + "/export/pdf");
    this.render('downloadPdf', {
      data: function () {
        return {
          user: Meteor.users.findOne(this.params._id),
          options: options,
          message: "We are generating a new fresh PDF agenda just for you, please wait..."
        };
      }, to: 'mainContent'
    });
  },
  {data: {currentTab: 'Users'}, controller: ManifMakerRouterController, name: 'user.export.pdf'}
);


/**
 * @memberOf Route.User
 * @summary Logout usser
 * @locus client
 * @name 'logout'  /logout
 */
Router.route('/logout', function () {
    Accounts.logout();
    Router.go("/")
  },
  {name: 'logout'}
);









