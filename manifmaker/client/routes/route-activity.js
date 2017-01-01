import {SecurityServiceClient} from "../../client/service/SecurityServiceClient"

/**
 * @memberOf Route
 * @namespace Route.Activity
 */

/**
 * @memberOf Route.Activity
 * @summary Display activities list
 * @locus client
 * @name 'home'  /activities
 */
Router.route('/activities', function () {
        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ACITIVITYREAD);
        console.info("routing", "/activities");

        this.render('activityList', {
            to: 'mainContent'
        });
    },
    {name: 'activity.list'}
)

/**
 * @memberOf Route.Activity
 * @summary Display the create activity form without time slots and validation workflow
 * @locus client
 * @name 'activity.create'  /activity
 */
Router.route('/activity', function () {
        this.wait(Meteor.subscribe('users'));

        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ACITIVITYWRITE);
        console.info("routing", "/activity");

        if (this.ready()) {
            this.render('insertActivityForm', {
                to: 'mainContent'
            });
        } else {
            console.log("Route /activity : waiting team data"); //TODO add a spinner
        }

    },
    {name: 'activity.create'}
);

/**
 * @memberOf Route.Activity
 * @summary Display the activity update form by it's MongoId
 * @locus client
 * @param taskId
 * @name 'activity.read'  /activity/:_id
 */
Router.route('/activity/:_id', function () {
        this.wait(Meteor.subscribe('activities'));
        this.wait(Meteor.subscribe('teams'));
        this.wait(Meteor.subscribe('places'));
        this.wait(Meteor.subscribe('skills'));
        this.wait(Meteor.subscribe('users'));
        this.wait(Meteor.subscribe('power-supplies'));

        if (this.ready()) {

            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ACITIVITYWRITE);
            console.info("routing", "/activity/" + this.params._id);

            if(!Activities.findOne(this.params._id)){
                console.info("routing", "activity not found, rerouting to /activities");
                Router.go("/activities");
            }


            this.render('updateActivityForm', {
                data: function () {
                    var current = this.params._id;
                    return Activities.findOne({_id: current});
                }, to: 'mainContent'
            });
        } else {
            console.log("waiting for data")
        }
    },
    {name: 'activity.update'}
);
