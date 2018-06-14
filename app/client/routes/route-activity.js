import {SecurityServiceClient} from "../../client/service/SecurityServiceClient"
import {ManifMakerRouterController} from "./ManifMakerRouterController"

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
    SecurityServiceClient.grantAccessToPage(RolesEnum.ACTIVITYREAD);
    console.info("routing", "/activities");

    this.render('activityList', {
      to: 'mainContent'
    });
  },
  {controller: ManifMakerRouterController, name: 'activity.list'}
)

/**
 * @memberOf Route.Activity
 * @summary Display the create activity form without time slots and validation workflow
 * @locus client
 * @name 'activity.create'  /activity
 */
Router.route('/activity', function () {

    SecurityServiceClient.grantAccessToPage(RolesEnum.ACTIVITYWRITE);
    console.info("routing", "/activity");

    this.render('insertActivityForm', {
      to: 'mainContent'
    });

  },
  {controller: ManifMakerRouterController, name: 'activity.create'}
);

/**
 * @memberOf Route.Activity
 * @summary Display the activity update form by it's MongoId
 * @locus client
 * @param taskId
 * @name 'activity.read'  /activity/:_id
 */
Router.route('/activity/:_id', function () {
    SecurityServiceClient.grantAccessToPage(RolesEnum.ACTIVITYWRITE);
    console.info("routing", "/activity/" + this.params._id);

    if (!Activities.findOne(this.params._id)) {
      console.info("routing", "activity not found, rerouting to /activities");
      Router.go("/activities");
    }


    this.render('updateActivityForm', {
      data: function () {
        var current = this.params._id;
        return Activities.findOne({_id: current});
      }, to: 'mainContent'
    });
  },
  {controller: ManifMakerRouterController, name: 'activity.update'}
);
