import {GTC} from "./GTC";

export class PlayTourServiceClient {

    static playActivityScenario(speed = 1) {
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
            GTC.alert("We are going to create an activity", 3000 * speed, "center", "small")
                .then(() => GTC.openMenu())
                .then(() => GTC.clickOn("#sidebar-activity", 500 * speed))
                .then(() => GTC.sleep(700 * speed))
                .then(() => GTC.clickOn("#sidebar-activity-create", 500 * speed))
                .then(() => GTC.waitFor("General information"))
                .then(() => {
                    resolve()
                })
        })
    }

    static fillCreateActivityForm(speed) {
        return new Promise(resolve => {
            GTC.closeMenu()
                .then(() => GTC.alert("<p>This is the creation form where you only fill the principal information.</p>" +
                    "<p>More to come just after</p>", 6000 * speed, "center", "medium"))
                .then(() => GTC.sleep(200 * speed))
                .then(() => GTC.typeText("Build", "[for=first_name] ~ input", 300 * speed))
                .then(() => GTC.sleep(200 * speed))
                .then(() => GTC.selectOption("Team", "confiance", 300 * speed))
                .then(() => GTC.sleep(700 * speed))
                .then(() => GTC.selectOption("'User responsible'", "hard3", 300 * speed))
                .then(() => GTC.sleep(700 * speed))
                .then(() => GTC.clickOn(GTC.findComponentByContent("Insert"), 500 * speed))
                .then(() => GTC.sleep(700 * speed))
                .then(() => GTC.waitFor("There is errors in the form"))
                .then(() => GTC.alert("<p>Oopsie, looks like something went wrong...</p>", speed * 3000, "center", "small"))
                .then(() => GTC.selectOption("'Live event responsible'", "bureau", 300 * speed))
                .then(() => GTC.sleep(700 * speed))
                .then(() => GTC.selectOption("'Place'", "Bocal", 300 * speed))
                .then(() => GTC.sleep(700 * speed))
                .then(() => GTC.waitFor("Insert"))
                .then(() => GTC.clickOn(GTC.findComponentByContent("Insert"), 500 * speed))
                .then(() => GTC.waitFor("Delete Build"))
                .then(() => GTC.alert("<p>Congrats ! First activity created, now let's look at everything you can configured for it.</p>" +
                    "<p>It's all optional, you tune as you please</p>", 3000 * speed, "center", "medium"))
                .then(() => resolve());
        })
    }
}