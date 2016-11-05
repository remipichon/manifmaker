import {ManifMakerRouterController} from "./ManifMakerRouterController"

Router.route('/activities', function () {
        console.info("routing", "/activities");
        this.render('ActivitiesList', {to: 'mainContent'});
    },
    {controller: ManifMakerRouterController,name: 'activity.list'}
);