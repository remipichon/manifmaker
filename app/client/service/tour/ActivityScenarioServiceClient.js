import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class ActivityScenarioServiceClient {

  static playScenario(options, speed = 1) {
    return GuidedTourServiceClient.alert("Nous allons nous connecter en tant que Bob l'Eponge, notre premier protagoniste, pour créer une animation.",
      7000 * speed, "center", "medium")
      .then(() => GuidedTourServiceClient.instantLogout(speed))
      .then(() => GuidedTourServiceClient.login(speed, options.regularUser))
      .then(() => ActivityScenarioServiceClient.goToCreateActivity(speed))
      .then(() => ActivityScenarioServiceClient.fillCreateActivityForm(speed, options))
      .then(() => ActivityScenarioServiceClient.fillUpdateActivityForm(speed, options))
      .then(() => ActivityScenarioServiceClient.validateActivity(speed, options))
  }

  static goToCreateActivity(speed) {
    return GuidedTourServiceClient.alert("Créons une activité pour décrire notre animation.", 3000 * speed, "center", "small")
      .then(() => GuidedTourServiceClient.openMenu())
      .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity", 500 * speed))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.clickOn("[href='/activity']", 500 * speed))
      .then(() => GuidedTourServiceClient.waitFor("General information"))
  }

  static fillCreateActivityForm(speed, options) {
    return GuidedTourServiceClient.alert("<p>Voici le formulaire de création où nous renseignons uniquement les informations principales.</p>" +
      "<p>Bien plus à venir...</p>", 3000 * speed, "center", "medium")
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.typeText(options.activityName, "[for=first_name] ~ input", 50 * speed))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.selectOption("Team", "confiance", 300 * speed))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.selectOption("User responsible", "hard3", 300 * speed))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert"), 600 * speed))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.waitFor("There is errors in the form"))
      .then(() => GuidedTourServiceClient.alert("<p>Oopsie, il semblerait qu'ils y aient des erreurs...</p>", speed * 1000, "left-vertical-align-.alert alert-danger", "small"))
      .then(() => GuidedTourServiceClient.selectOption("Live event responsible", "bureau", 300 * speed))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.selectOption("Place", "Bocal", 300 * speed))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.waitFor("Insert"))
      .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert"), 400 * speed))
      .then(() => GuidedTourServiceClient.waitFor("Delete " + options.activityName))
      .then(() => GuidedTourServiceClient.alert("<p>Bravo ! Première activité créé (facile hein), voyons tout ce que nous pouvons configurer désormais.</p>" +
        "<p>Tout est optionnel, tu configures à ta guise. </p>", 10000 * speed, "center", "medium"))
  }

  //assuming where are already on the update form
  static fillUpdateActivityForm(speed, options) {
    return GuidedTourServiceClient.selectDate(".date-time-picker-update-activity-start input", "10/02/" + options.year, "Sep", "10", 300 * speed)
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.selectDate(".date-time-picker-update-activity-end input", "10/02/" + options.year, "Sep", "18", 300 * speed))
      .then(() => GuidedTourServiceClient.typeText("<p>Concours de chateau de sable ! </p>" +
        "<p>Il y aura des tas de sable sur la page, prenez en un et utiliser les pelles et sauts à disposition</p>" +
        "<p>Le plus beau chateau sera récompensé d'un beau trésor des mers !</p>", "[name=description]", 10 * speed))
      .then(() => GuidedTourServiceClient.sleep(500 * speed))
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Equipment)"))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.selectOption("Water supply", "AIP", 300 * speed))
      .then(() => GuidedTourServiceClient.sleep(500 * speed))
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.alert("<p>Une fois l'animation configurée, elle doit passer par une série de validation, il y en a trois sortes.</p>" +
        "<p>1. Validation des informations générales, utilisées nottament pour afficher sur le site web ou l'application</p>" +
        "<p>2. Validation du matériel pour vérifier sa conformité et les stockes" +
        "<p>3. Validation des pass d'accès, si besoin en sécurité. A Bikini Bottom, tout le monde est gentil, pas besoin de sécurité</p>" +
        "<p>Chaque validation peut se faire par des personnes différentes, en fonction de leur droit. Voyons d'abord comment soumettre en validation</p>", 40000 * speed, "center", "medium"))
      .then(() => GuidedTourServiceClient.typeText("Normalement je n'ai pas fais de fautes d'ortografes. ", ".validation-comment-input[for='General Information'] input", 50 * speed))
      .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='General Information'] .askforvalidation-button", 200 * speed))
      .then(() => GuidedTourServiceClient.sleep(300 * speed))
      .then(() => GuidedTourServiceClient.typeText("Les chaisses longues c'est en bonus, supprime les si c'est en trop", ".validation-comment-input[for='Equipment'] input", 50 * speed))
      .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Equipment'] .askforvalidation-button", 200 * speed))
      .then(() => GuidedTourServiceClient.sleep(300 * speed))
    //did you noticed the update happening in the top bar ? All all your actions are right away recorded and save
    //some information needs a manual update though, it's always clear what needs to be manually updated.
  }

  static validateActivity(speed, options) {
    return GuidedTourServiceClient.alert("<p>Validons cette animation ! Entre en jeux Patrick l'Etoile de Mer, expert en matériel qui va pouvoir confirmer les besoins de Bob l'Eponge.",
      speed * 10000, "center", "medium")
      .then(() => GuidedTourServiceClient.logout(speed))
      .then(() => GuidedTourServiceClient.login(speed, options.equipmentUser))
      .then(() => GuidedTourServiceClient.openMenu())
      .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity", 400 * speed))
      .then(() => GuidedTourServiceClient.sleep(200 * speed))
      .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity ~.dropdown-menu [href='/activities']"), speed * 400)
      .then(() => GuidedTourServiceClient.waitFor("Activities List"))
      .then(() => GuidedTourServiceClient.alert("<p>Tu peux chercher dans et filtrer cette liste à ta guise, concentrons nous sur celle dont l'équipement doit etre validée.</p>",
        speed * 7000, "center", "medium"))
      .then(() => GuidedTourServiceClient.clickOn("#advanced-search-button", 200 * speed))
      .then(() => GuidedTourServiceClient.sleep(100 * speed))
      .then(() => GuidedTourServiceClient.selectOption("Validation Status", "Equipment validation In validation process", 400))
      .then(() => GuidedTourServiceClient.sleep(100 * speed))
      .then(() => GuidedTourServiceClient.clickOn(`td:contains(${options.activityName}) ~ td .btn[title=Edit]`, speed * 400))
      .then(() => GuidedTourServiceClient.waitFor(`Delete ${options.activityName}`))
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
      .then(() => GuidedTourServiceClient.typeText("Pas de soucis, tu peux avoir les chaises longues", ".validation-comment-input[for='Equipment'] input", 0 * speed))
      .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Equipment'] .close-button", 400 * speed))
      .then(() => GuidedTourServiceClient.sleep(300 * speed))
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Equipments)"))
      .then(() => GuidedTourServiceClient.alert("<p>Maintenant que le matériel est validé, il ne peut plus etre modifié." +
        "Au besoin, la validation peut etre refusée pour modifier les quantitiés.", speed * 10000, "top-right", "medium"))
  }
}