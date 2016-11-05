import {ManifMakerRouterController} from "../routes/ManifMakerRouterController"

/**
 * @memberOf Route
 * @namespace Route.Task
 */

/**
 * @memberOf Route.Task
 * @summary Display tasks list
 * @locus client
 * @name 'home'  /tasks
 */
Router.route('/tests', function () {

        console.info("routing", "/tests");

        //Meteor.call("injectData", _.bind(function () {
            this.render('tests', {
                to: 'mainContent'
            })
        //}, this));


    },
    {name: 'tests.list'}
)