import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class UserScenarioServiceClient {

  static playScenario(options, speed) {
    return GuidedTourServiceClient.alert("<p>Avant de passer a l'affectation, nous avons besoin d'un premier benevole qui sera Squid. Il va pouvoir ajouter des disponibilités",
    speed * 8000, "center","medium")
      .then(() => GuidedTourServiceClient.instantLogout(speed))
      .then(() => GuidedTourServiceClient.login(speed, options.volunteerUser))
      .then(() => UserScenarioServiceClient.goToUserProfile(speed))
      .then(() => UserScenarioServiceClient.fillUpdateUserForm(speed, options))
  }

  static goToUserProfile(speed) {
    return GuidedTourServiceClient.alert("Le benevole peut renseigner quelques informations mais surtout ses disponibilités", 4000 * speed, "center", "small")
      .then(() => GuidedTourServiceClient.openMenu(speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn(".sidebar [href='#settings-dropdown']", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn("#settings-dropdown [href^=\\/user\\/]", speed))
      .then(() => GuidedTourServiceClient.waitFor("General information"))
  }

  static fillAvailability(avail, resolveFillAll, speed) {
    return new Promise(resolveFillOne => {
      if (!avail[0]) {
        resolveFillOne();
        return;
      }
      GuidedTourServiceClient.clickOn(`.calendar .quart_heure[quarter='${avail[0]}']`, speed)
        .then(resolveClickOn => {
          avail.shift();
          if (avail.length == 0) {
            resolveFillAll()
          }
          UserScenarioServiceClient.fillAvailability(avail, resolveFillAll, speed)
        })
    })
  }

  static fillAvailabilities(avail, speed) {
    return new Promise(resolve => {
      UserScenarioServiceClient.fillAvailability(avail, resolve, speed)
    })
  }

  static fillUpdateUserForm(speed, options) {
    return GuidedTourServiceClient.clickOn(`.assignments-terms-button:contains('${options.term.name}')`, speed)
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => UserScenarioServiceClient.fillAvailabilities(options.volunteerUser.availabilities, speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
  }
}