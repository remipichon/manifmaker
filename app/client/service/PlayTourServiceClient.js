import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class PlayTourServiceClient {


    static playActivityScenario() {
        $("#guided-tour-overlapp").addClass("visible");
        PlayTourServiceClient.goToCreateActivity()
            .then(() => PlayTourServiceClient.fillCreateActivityForm())
            .then(() => {
                console.log("playActivityScenario is done")
                $("#guided-tour-overlapp").removeClass("visible");
            })
    }


    static goToCreateActivity() {
        return new Promise(resolve => {
            GuidedTourServiceClient.alert("We are going to create an activity", 3000, "center", "small")
                .then(() => GuidedTourServiceClient.openMenu())
                .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity"))
                .then(() => GuidedTourServiceClient.sleep(700))
                .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity-create"))
                .then(() => GuidedTourServiceClient.waitFor("General information"))
                .then(() => {
                    resolve()
                })
        })
    }

    static fillCreateActivityForm() {
        return new Promise(resolve => {
            GuidedTourServiceClient.closeMenu()
                .then(() => GuidedTourServiceClient.alert("<p>This is the creation form where you only fill the principal information.</p>" +
                    "<p>More to come just after</p>", 6000, "center", "medium"))
                .then(() => GuidedTourServiceClient.sleep(200))
                .then(() => GuidedTourServiceClient.typeText("Build", "[for=first_name] ~ input"))
                .then(() => GuidedTourServiceClient.sleep(200))
                .then(() => GuidedTourServiceClient.selectOption("Team", "confiance"))
                .then(() => GuidedTourServiceClient.sleep(700))
                .then(() => GuidedTourServiceClient.selectOption("'User responsible'", "hard3"))
                .then(() => GuidedTourServiceClient.sleep(700))
                .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert")))
                .then(() => GuidedTourServiceClient.sleep(700))
                .then(() => GuidedTourServiceClient.waitFor("There is errors in the form"))
                .then(() => GuidedTourServiceClient.alert("<p>Oopsie, looks like something went wrong...</p>", 3000, "center", "small"))
                .then(() => GuidedTourServiceClient.selectOption("'Live event responsible'", "hard3"))
                .then(() => GuidedTourServiceClient.sleep(700))
                .then(() => GuidedTourServiceClient.selectOption("'Place'", "Bocal"))
                .then(() => GuidedTourServiceClient.sleep(700))
                .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert")))
                .then(() => GuidedTourServiceClient.waitFor("Delete Build"))
                .then(() => GuidedTourServiceClient.alert("<p>Congrats ! First activity created, now let's look at everything you can configured for it.</p>" +
                    "<p>It's all optional, you tune as you please</p>", 3000, "center", "medium"))
                .then(() => resolve());
        })
    }


}