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
Router.route('/roles', function () {
        console.info("routing", "/roles");
        if(Roles.userIsInRole(Meteor.userId(),"role"))
            this.render('RolesList', {to: 'mainContent'});
        else
            throw new Meteor.Error(403,"User needs 'admin' roles to edit roles");
    },
    {name: 'role.list'}
);