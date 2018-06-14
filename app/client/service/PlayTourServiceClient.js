import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class PlayTourServiceClient {


    static playActivityScenario() {
        let speed = 0;
        $("#guided-tour-overlapp").addClass("visible");
        PlayTourServiceClient.goToCreateActivity(speed)
            .then(() => PlayTourServiceClient.fillCreateActivityForm(speed))
            .then(() => {
                console.log("playActivityScenario is done")
                $("#guided-tour-overlapp").removeClass("visible");
            })
    }


    static goToCreateActivity(speed) {
        return new Promise(resolve => {
            GuidedTourServiceClient.alert("We are going to create an activity", 3000 * speed, "center", "small")
                .then(() => GuidedTourServiceClient.openMenu())
                .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity", 500 * speed))
                .then(() => GuidedTourServiceClient.sleep(700 * speed))
                .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity-create", 500 * speed))
                .then(() => GuidedTourServiceClient.waitFor("General information"))
                .then(() => {
                    resolve()
                })
        })
    }

    static fillCreateActivityForm(speed) {
        return new Promise(resolve => {
            GuidedTourServiceClient.closeMenu()
                .then(() => GuidedTourServiceClient.alert("<p>This is the creation form where you only fill the principal information.</p>" +
                    "<p>More to come just after</p>", 6000 * speed, "center", "medium"))
                .then(() => GuidedTourServiceClient.sleep(200))
                .then(() => GuidedTourServiceClient.typeText("Build", "[for=first_name] ~ input"), 300 * speed)
                .then(() => GuidedTourServiceClient.sleep(200 * speed))
                .then(() => GuidedTourServiceClient.selectOption("Team", "confiance", 200 * speed))
                .then(() => GuidedTourServiceClient.sleep(700 * speed))
                .then(() => GuidedTourServiceClient.selectOption("'User responsible'", "hard3", 200 * speed))
                .then(() => GuidedTourServiceClient.sleep(700 * speed))
                .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert"), 500 * speed))
                .then(() => GuidedTourServiceClient.sleep(700))
                .then(() => GuidedTourServiceClient.waitFor("There is errors in the form"))
                .then(() => GuidedTourServiceClient.alert("<p>Oopsie, looks like something went wrong...</p>", speed * 3000, "center", "small"))
                .then(() => GuidedTourServiceClient.selectOption("'Live event responsible'", "bureau", 200 * speed))
                .then(() => GuidedTourServiceClient.sleep(700 * speed))
                .then(() => GuidedTourServiceClient.selectOption("'Place'", "Bocal", 200 * speed))
                .then(() => GuidedTourServiceClient.sleep(700 * speed))
                .then(() => GuidedTourServiceClient.waitFor("Insert"))
                .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert"), 500 * speed))
                .then(() => GuidedTourServiceClient.waitFor("Delete Build"))
                .then(() => GuidedTourServiceClient.alert("<p>Congrats ! First activity created, now let's look at everything you can configured for it.</p>" +
                    "<p>It's all optional, you tune as you please</p>", 3000 * speed, "center", "medium"))
                .then(() => resolve());
        })
    }


}