import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class PlayTourServiceClient {


  static playActivityScenario() {
    PlayTourServiceClient.goToCreateActivity()
      .then(() => PlayTourServiceClient.fillCreateActivityForm())
      .then(() => {
        console.log("playActivityScenario is done")
      })
  }


  static goToCreateActivity() {
    return new Promise(resolve => {
      console.info("Going to 'create activity'");
      GuidedTourServiceClient.openMenu()
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity"))
        .then(() => GuidedTourServiceClient.sleep(700))
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity-create"))
        .then(() => GuidedTourServiceClient.waitFor("General information"))
        .then(() => {
          console.info("We are at 'create activity'");
          resolve()
        });
    })
  }

  static fillCreateActivityForm() {
    return new Promise(resolve => {
      GuidedTourServiceClient.closeMenu()
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
        .then(() => {
          console.log("HOLLLY COOW, there is an error")
        })
        .then(() => GuidedTourServiceClient.selectOption("'Live event responsible'", "hard3"))
        .then(() => GuidedTourServiceClient.sleep(700))
        .then(() => GuidedTourServiceClient.selectOption("'Place'", "Bocal"))
        .then(() => GuidedTourServiceClient.sleep(700))
        .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert")))
        .then(() => GuidedTourServiceClient.waitFor("Delete Build"))
        .then(() => resolve());
    })
  }


}