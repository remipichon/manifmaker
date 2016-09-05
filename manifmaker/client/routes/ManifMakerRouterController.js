import {SecurityServiceClient} from "../../client/service/SecurityServiceClient"

export var ManifMakerRouterController = RouteController.extend({
    onBeforeAction: function () {
        if (! Meteor.userId()) {
            beforeLogginRoute = "/" + Router.current().route.getName();
            Router.go("/login");
        } else {
            try {
                SecurityServiceClient.grantAccessToPage(Meteor.userId(),RolesEnum.MANIFMAKER);
            } catch(e){
                if(e.errorType === "Meteor.Error" && e.error === "403"){
                    Router.go("forbidden");
                }
                throw e;
            }


            this.next();
        }

    },

    onAfterAction: function () {

    }
});


