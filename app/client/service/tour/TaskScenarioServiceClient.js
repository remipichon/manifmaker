import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class TaskScenarioServiceClient {

  static playScenario(options, speed) {
    return TaskScenarioServiceClient.goToCreateTask(speed, options)
      .then(() => TaskScenarioServiceClient.fillCreateTaskForm(speed, options))
      .then(() => TaskScenarioServiceClient.fillUpdateTaskForm(speed, options))
      .then(() => TaskScenarioServiceClient.validateTask(speed, options))
  }

  static goToCreateTask(speed, options) {
    return GuidedTourServiceClient.alert("Nous allons nous revenir avec Bob l'Eponge pour créer une fiche tache qui prepera l'animation des chateaux de sables.",
      10000 * speed, "center", "medium")
      .then(() => GuidedTourServiceClient.instantLogout(speed))
      .then(() => GuidedTourServiceClient.openMenu(speed))
      .then(() => GuidedTourServiceClient.login(speed, options.regularUser))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.openMenu(speed))
      .then(() => GuidedTourServiceClient.clickOn("#sidebar-task", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn("[href='/task']", speed))
      .then(() => GuidedTourServiceClient.waitFor("General information"))
  }

  static fillCreateTaskForm(speed, options) {
    return GuidedTourServiceClient.alert("<p>Meme histoire que pour les animations, uniquement les informations générales ici</p>", 3000 * speed, "center", "medium")
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.typeText(options.taskName, "[for=first_name] ~ input", 50 * speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.selectOption("Team", "confiance", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.selectOption("User responsible", "hard3", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.selectOption("Rendez-vous point", "Petite scene", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.selectOption("Live event responsible", "bureau", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed)) //poney trick, because doing both responsbiles in a row, the second click on the first one that didn't dissapear yet
      .then(() => GuidedTourServiceClient.waitFor("Insert"))
      .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert"), speed))
      .then(() => GuidedTourServiceClient.waitFor("Delete " + options.taskName))
  }

  //assuming where are already on the update form
  static fillUpdateTaskForm(speed, options) {
    return GuidedTourServiceClient.selectOption("Linked Activity", options.activityName, speed)
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.typeText("<p>Avec le fenwick et les pelles en plastiques disponobles, il faut faire des tres gros tas de sables.</p>" +
        "<p>Le mieux c'est d'en faire a droite et a gauche ainsi que au millieu, devant et derriere.</p>" +
        "<p>Oubliez pas les cotés ! Il faut faire des tas haut mais pas trop. </p>" +
        "<p>Vive la plage ! </p>",
        "[name=description]", 10 * speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Equipment)"))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.typeEquipment(10, "colson", 300 * speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.typeEquipment(5, "fenwick", 300 * speed))
      .then(() => GuidedTourServiceClient.sleep(1200 * speed))
      .then(() => TaskScenarioServiceClient.playWithTimeSlots(speed, options))
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.alert("<p>Il n'y a que deux validations pour les fiches taches</p>" +
        "<p>1. Validation Equipement</p> " +
        "<p>2. Validation Creneaux</p>" +
        "Nous allons nous concentrer sur l'affectation...", 10000 * speed, "center", "medium"))
      .then(() => GuidedTourServiceClient.typeText(" ", ".validation-comment-input[for='Time Slot'] input", 50 * speed))
      .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Time Slot'] .askforvalidation-button", speed))
      .then(() => GuidedTourServiceClient.sleep(1200 * speed))
    //did you noticed the update happening in the top bar ? All all your actions are right away recorded and save
    //some information needs a manual update though, it's always clear what needs to be manually updated.
  }

  static playWithTimeSlots(speed, options) {

    return GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains('Time slots')", "top")
      .then(() => GuidedTourServiceClient.alert("<p>Les créneaux sont la partie la plus importante de la taches. Ici nous définissons quand aura lieu la tache et de qui aura t'elle besoin.</p>" +
        "<p>Commencons par choisir le quand.</p>" +
        "<p>Un evenement complexe peut etre divisé en plusieurs périodes de durées variables. Choissisons la période de la 'journée plage'.</p>",
        17000 * speed, "center", "big"))
      .then(() => GuidedTourServiceClient.clickOn(`.assignments-terms-button:contains('${options.term.name}')`, speed)) //TODO this click works but doesn't show the cirle
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".updateTimeSlotCalendar", "top"))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.waitFor(`.calendar .quart_heure[quarter='${options.timeSlot.start2}']`))
      .then(() => GuidedTourServiceClient.clickOn(`.calendar .quart_heure[quarter='${options.timeSlot.start2}']`, 0)) //tricks, there is a bug, first select doesn't work
      .then(() => GuidedTourServiceClient.waitFor(`.calendar .quart_heure[quarter='${options.timeSlot.start}']`))
      .then(() => GuidedTourServiceClient.clickOn(`.calendar .quart_heure[quarter='${options.timeSlot.start}']`, speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .done-button", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.alert("<p>Le quand, c'est fait. Maintenant le avec qui.</p>" +
        "<p>Les besoins en organisteurs peuvent demander n'importe qui d'une équipe, ou alors une personne avec certaines compétences voir meme cummuler les deux. " +
        "Il est également possible de demander quelqu'un en particulier.</p>", speed * 25000, "center", "big"))
      .then(() => GuidedTourServiceClient.clickOn(".add-people-need .add-button", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.selectOption("Need a specific team", "hard", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn(".add-people-need .done-button", speed))
      .then(() => GuidedTourServiceClient.sleep(1200 * speed))
      .then(() => GuidedTourServiceClient.alert("Hop, on copie un besoin orgas !", speed * 2000, "center", "medium"))
      .then(() => GuidedTourServiceClient.clickOn(".people-need .duplicate", speed))
      .then(() => GuidedTourServiceClient.clickOn(".people-need .duplicate:first", speed))
      .then(() => GuidedTourServiceClient.clickOn(".people-need .duplicate:first", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn(".add-people-need .add-button", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.selectOption("Need of set of skills", ["Responsable Bar", "Responsable Anim"], speed)) //trick to select several skills
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn(".add-people-need .done-button", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      //annoying to when duplicating while testing
      // .then(() => GuidedTourServiceClient.clickOn(".add-people-need .add-button", speed))
      // .then(() => GuidedTourServiceClient.standardSleep(speed))
      // .then(() => GuidedTourServiceClient.selectOption("Need a specific user", "Sticky Expert", speed * 300)) //trick to select several skills
      // .then(() => GuidedTourServiceClient.standardSleep(speed))
      // .then(() => GuidedTourServiceClient.clickOn(".add-people-need .done-button", speed))
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".updateTimeSlotCalendar", "top"))
      .then(() => GuidedTourServiceClient.alert("<p>Sur le calendrier nous pouvons voir un petit résumé des besoins pour avoir un rapide coup d'oeil.</p>" +
        "<p>Et nous pouvons egalement dupliquer un créneau entier.</p>", 10000 * speed, "center-right", "medium"))
      .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .duplicate-button[title=duplicate]", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .done-button", speed))
      .then(() => GuidedTourServiceClient.sleep(300 * speed))
      .then(() => GuidedTourServiceClient.waitFor(".add-time-slot .duplicate-button[title=duplicate]"))
      .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .duplicate-button[title=duplicate]", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .done-button", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      //make the ui buggy
      // .then(() => GuidedTourServiceClient.waitFor(`.calendar .quart_heure[quarter='${options.timeSlot.start}']`))
      // .then(() => GuidedTourServiceClient.clickOn(`.calendar .quart_heure[quarter='${options.timeSlot.start}'] .creneau .creneau-to-affect`, speed))
      // .then(() => GuidedTourServiceClient.selectDate(".from-date-time-picker-update-time-slot input", null, null, "02", 200 * speed))
      .then(() => GuidedTourServiceClient.sleep(1200 * speed))
  }

  static validateTask(speed, options) {
    return GuidedTourServiceClient.alert("Comme pour l'animation, nous allons valider la tache avec Sandy qui sera responsable de l'affectation (ce pourquoi tu es venu ici...)",
      speed * 13000, "center", "medium")
      .then(() => GuidedTourServiceClient.logout(speed))
      .then(() => GuidedTourServiceClient.login(speed, options.assignmentUser))
      .then(() => GuidedTourServiceClient.openMenu(speed))
      .then(() => GuidedTourServiceClient.clickOn("#sidebar-task", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn("#sidebar-task ~.dropdown-menu [href='/tasks']", speed))
      .then(() => GuidedTourServiceClient.waitFor("Tasks List"))
      .then(() => GuidedTourServiceClient.alert("<p>Hop, nous voulons uniquement les taches dont les creneaux sont a valider.</p>",
        speed * 4000, "center", "medium"))
      .then(() => GuidedTourServiceClient.clickOn("#advanced-search-button", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.selectOption("Validation Status", "Assignment validation In validation process", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
      .then(() => GuidedTourServiceClient.clickOn(`td:contains('${options.taskName}') ~ td .btn[title=Edit]`, speed))
      .then(() => GuidedTourServiceClient.waitFor(`Delete ${options.taskName}`))
      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
      .then(() => GuidedTourServiceClient.typeText("Ready for assignment, yeah !", ".validation-comment-input[for='Time Slot'] input", 0 * speed))
      .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Time Slot'] .close-button", speed))
      .then(() => GuidedTourServiceClient.standardSleep(speed))
  }
}