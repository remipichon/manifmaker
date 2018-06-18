import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class TaskScenarioServiceClient {

  static playScenario(options, speed) {
    return new Promise(resolve => {
      TaskScenarioServiceClient.goToCreateTask(speed)
        .then(() => TaskScenarioServiceClient.fillCreateTaskForm(speed, options))
        .then(() => TaskScenarioServiceClient.fillUpdateTaskForm(speed, options))
        .then(() => TaskScenarioServiceClient.validateTask(speed, options))
        .then(() => {
          resolve();
        })
    })
  }

  static goToCreateTask(speed) {
    return new Promise(resolve => {
      GuidedTourServiceClient.alert("Nous allons nous revenir avec que Bob l'Eponge pour créer une fiche tache qui prepera l'animation des chateaux de sables.",
        5000 * speed, "center", "medium")
        .then(() => GuidedTourServiceClient.instantLogout(speed))
        .then(() => GuidedTourServiceClient.openMenu())
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.login(speed, options.regularUser))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.openMenu())
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-task", 500 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("[href='/task']", 500 * speed))
        .then(() => GuidedTourServiceClient.waitFor("General information"))
        .then(() => {
          resolve()
        })
    })
  }

  static fillCreateTaskForm(speed, options) {
    return new Promise(resolve => {
      GuidedTourServiceClient.alert("<p>Meme histoire que pour les animations, uniquement les informations générales ici</p>", 600 * speed, "center", "medium")
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.typeText(options.taskName, "[for=first_name] ~ input", 50 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Team", "confiance", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("User responsible", "hard3", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Rendez-vous point", "Petite scene", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Live event responsible", "bureau", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed)) //poney trick, because doing both responsbiles in a row, the second click on the first one that didn't dissapear yet
        .then(() => GuidedTourServiceClient.waitFor("Insert"))
        .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert"), 400 * speed))
        .then(() => GuidedTourServiceClient.waitFor("Delete " + options.taskName))
        .then(() => resolve());
    })
  }

  //assuming where are already on the update form
  static fillUpdateTaskForm(speed, options) {
    return new Promise(resolve => {
      GuidedTourServiceClient.selectOption("Linked Activity", options.activityName, 300 * speed)
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.typeText("<p>Avec le fenwick et les pelles en plastiques disponobles, il faut faire des tres gros tas de sables.</p>" +
          "<p>Le mieux c'est d'en faire a droite et a gauche ainsi que au millieu, devant et derriere.</p>" +
          "<p>Oubliez pas les cotés ! Il faut faire des tas haut mais pas trop. </p>" +
          "<p>Vive la plage ! </p>",
          "[name=description]", 10 * speed))
        .then(() => GuidedTourServiceClient.sleep(500 * speed))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Equipment)"))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.typeEquipment(10, "colson", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.typeEquipment(5, "fenwick", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(500 * speed))
        .then(() => TaskScenarioServiceClient.playWithTimeSlots(speed, options))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.alert("<p>Il n'y a que deux validations pour les fiches taches</p>" +
          "<p>1. Validation Equipement</p> " +
          "<p>2. Validation Creneaux</p>", 3000 * speed, "center", "medium"))
        .then(() => GuidedTourServiceClient.typeText(" ", ".validation-comment-input[for='Time Slot'] input", 50 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Time Slot'] .askforvalidation-button", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(300 * speed))
        .then(() => resolve());
      //did you noticed the update happening in the top bar ? All all your actions are right away recorded and save
      //some information needs a manual update though, it's always clear what needs to be manually updated.
    })
  }

  static playWithTimeSlots(speed, options) {
    return new Promise(resovle => {
      GuidedTourServiceClient.alert("<p>Les créneaux est la partie la plus importante de la taches. Ici nous définissons quand aura lieu la tache et de qui aura t'elle besoin.</p>" +
        "<p>Commencons par choisir quand. Un evenement complexe peut etre divisé en plusieurs périodes, choissisons celle de la journée plage.</p>",
        30000 * speed, "center", "large")
        .then(() => GuidedTourServiceClient.clickOn(`.assignments-terms-button:contains('${options.term.name}')`, speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.waitFor(`.calendar .quart_heure[quarter='${options.timeSlot.start2}']`))
        .then(() => GuidedTourServiceClient.clickOn(`.calendar .quart_heure[quarter='${options.timeSlot.start2}']`, 100)) //tricks, there is a bug, first select doesn't work
        .then(() => GuidedTourServiceClient.waitFor(`.calendar .quart_heure[quarter='${options.timeSlot.start}']`))
        .then(() => GuidedTourServiceClient.clickOn(`.calendar .quart_heure[quarter='${options.timeSlot.start}']`, speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .done-button", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.alert("<p>Le quand, c'est fait. Maintenant le qui.</p>" +
          "<p>Les besoins orga peuvent réclamer quelqu'un d'une équipe, ou alors quelqu'un avec certaines compétences ou meme cummuler les deux. " +
          "Il est possible de demander quelqu'un en particulier</p>", speed * 20000, "center", "small"))
        .then(() => GuidedTourServiceClient.clickOn(".add-people-need .add-button", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Need a specific team", "hard", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".add-people-need .done-button", speed * 300))
        .then(() => GuidedTourServiceClient.alert("Hop, on copie un besoin orgas !", 500 * speed, "center", "small"))
        .then(() => GuidedTourServiceClient.clickOn(".people-need .duplicate", speed * 200))
        .then(() => GuidedTourServiceClient.clickOn(".people-need .duplicate", speed * 200))
        .then(() => GuidedTourServiceClient.clickOn(".people-need .duplicate", speed * 200))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".add-people-need .add-button", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Need of set of skills", "Responsable", speed * 300)) //trick to select several skills
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".add-people-need .done-button", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        //annoying to when duplicating while testing
        // .then(() => GuidedTourServiceClient.clickOn(".add-people-need .add-button", speed * 300))
        // .then(() => GuidedTourServiceClient.sleep(200 * speed))
        // .then(() => GuidedTourServiceClient.selectOption("Need a specific user", "Sticky Expert", speed * 300)) //trick to select several skills
        // .then(() => GuidedTourServiceClient.sleep(200 * speed))
        // .then(() => GuidedTourServiceClient.clickOn(".add-people-need .done-button", speed * 300))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".add-time-slot .duplicate-button[title=duplicate]"))
        .then(() => GuidedTourServiceClient.alert("Sur le calendrier nous pouvons voir un petit résumé des besoins pour avoir un rapide coup d'oeil.", 10000 * speed, "top", "medium"))
        .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .duplicate-button[title=duplicate]", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .done-button", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(300 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .duplicate-button[title=duplicate]", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".add-time-slot .done-button", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        //make the ui buggy
        // .then(() => GuidedTourServiceClient.waitFor(`.calendar .quart_heure[quarter='${options.timeSlot.start}']`))
        // .then(() => GuidedTourServiceClient.clickOn(`.calendar .quart_heure[quarter='${options.timeSlot.start}'] .creneau .creneau-to-affect`, speed * 300))
        // .then(() => GuidedTourServiceClient.selectDate(".from-date-time-picker-update-time-slot input", null, null, "02", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(400 * speed))
        .then(() => resovle())
    })
  }

  static validateTask(speed, options) {
    return new Promise(resolve => {
      GuidedTourServiceClient.alert("Comme pour l'animation, nous allons validé la tache avec Sandy qui sera responsable de l'affectation (ce pourquoi tu es venu ici...)",
        speed * 4000, "center", "medium")
        .then(() => GuidedTourServiceClient.logout(speed))
        .then(() => GuidedTourServiceClient.login(speed, options.assignmentUser))
        .then(() => GuidedTourServiceClient.openMenu())
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-task", 400 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-task ~.dropdown-menu [href='/tasks']", speed * 400))
        .then(() => GuidedTourServiceClient.waitFor("Tasks List"))
        .then(() => GuidedTourServiceClient.alert("<p>Hop, nous voulons les taches dont les creneaux sont a relire</p>",
          speed * 4000, "center", "medium"))
        .then(() => GuidedTourServiceClient.clickOn("#advanced-search-button", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(100 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Validation Status", "Assignment validation In validation process", 400))
        .then(() => GuidedTourServiceClient.sleep(100 * speed))
        .then(() => GuidedTourServiceClient.clickOn(`td:contains('${options.taskName}') ~ td .btn[title=Edit]`, speed * 400))
        .then(() => GuidedTourServiceClient.waitFor(`Delete ${options.taskName}`))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
        .then(() => GuidedTourServiceClient.typeText("Ready for assignment, yeah !", ".validation-comment-input[for='Time Slot'] input", 0 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Time Slot'] .close-button", 400 * speed))
        .then(() => GuidedTourServiceClient.sleep(300 * speed))
        .then(() => resolve())
    })
  }
}