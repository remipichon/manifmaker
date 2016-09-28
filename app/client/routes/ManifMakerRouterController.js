import {SecurityServiceClient} from "../../client/service/SecurityServiceClient"

export var ManifMakerRouterController = RouteController.extend({
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            beforeLogginRoute = "/" + Router.current().route.getName();
            Router.go("/login");
        } else {
            try {
                SecurityServiceClient.grantAccessToPage(RolesEnum.MANIFMAKER, "whole application");
            } catch (e) {
                if (e.errorType === "Meteor.Error" && e.error === "403") {
                    Router.go("forbidden");
                }
                throw e;
            }

            this.wait(Meteor.subscribe("skills"));
            this.wait(Meteor.subscribe("users"));
            this.wait(Meteor.subscribe("tasks"));
            this.wait(Meteor.subscribe("places"));
            this.wait(Meteor.subscribe("assignments"));
            this.wait(Meteor.subscribe("teams"));
            this.wait(Meteor.subscribe("groups"));
            this.wait(Meteor.subscribe("group-roles"));
            this.wait(Meteor.subscribe("roles"));
            this.wait(Meteor.subscribe("equipment-categories"));
            this.wait(Meteor.subscribe("equipment-storages"));
            this.wait(Meteor.subscribe("equipments"));
            this.wait(Meteor.subscribe("water-supplies"));
            this.wait(Meteor.subscribe("water-disposals"));
            this.wait(Meteor.subscribe("power-supplies"));
            this.wait(Meteor.subscribe("assignment-terms"));

            if(this.ready()){
                NProgress.done();
                this.next();
            } else {
                NProgress.start();
            }
        }

    },

    onAfterAction: function () {

    }
});


