import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class UserScenarioServiceClient {

  static playScenario(options, speed = 1) {
    return new Promise(resolve => {
      GuidedTourServiceClient.instantLogout(speed)
        .then(() => GuidedTourServiceClient.login(speed, options.volunteerUser))
        .then(() => UserScenarioServiceClient.goToUserProfile(speed))
        .then(() => UserScenarioServiceClient.fillUpdateUserForm(speed, options))
        .then(() => {
          resolve()
        })
    })
  }

  static goToUserProfile(speed) {
    return new Promise(resolve => {
      GuidedTourServiceClient.alert("We are going to add availabilities to the the volunteer user ", 300 * speed, "center", "small")
        .then(() => GuidedTourServiceClient.openMenu())
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".sidebar [href='#settings-dropdown']", 500 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("#settings-dropdown [href^=\\/user\\/]", 500 * speed))
        .then(() => GuidedTourServiceClient.waitFor("General information"))
        .then(() => {
          resolve()
        })
    })
  }

  static fillAvailability(avail, resolveFillAll, delay) {
    return new Promise(resolveFillOne => {
      if (!avail[0]) {
        resolveFillOne();
        return;
      }
      GuidedTourServiceClient.clickOn(`.calendar .quart_heure[quarter='${avail[0]}']`, delay)
        .then(resolveClickOn => {
          avail.shift();
          if (avail.length == 0) {
            resolveFillAll()
          }
          UserScenarioServiceClient.fillAvailability(avail, resolveFillAll, delay)
        })
    })
  }

  static fillAvailabilities(avail, delay) {
    return new Promise(resolve => {
      UserScenarioServiceClient.fillAvailability(avail, resolve, delay)
    })
  }

  static fillUpdateUserForm(speed, options) {
    return new Promise(resolve => {
      GuidedTourServiceClient.clickOn(`.assignments-terms-button:contains('${options.term.name}')`, speed * 300)
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => UserScenarioServiceClient.fillAvailabilities(options.volunteerUser.availabilities, speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => resolve())
    })
  }

}