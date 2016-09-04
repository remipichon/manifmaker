export var ManifMakerRouterController = RouteController.extend({
    onBeforeAction: function () {
        if (! Meteor.userId()) {
            beforeLogginRoute = "/" + Router.current().route.getName();
            Router.go("/login");
        } else {
            this.next();
        }

    },

    onAfterAction: function () {

    }
});


