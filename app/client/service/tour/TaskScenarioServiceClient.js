import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class TaskScenarioServiceClient {

  static playScenario(options, speed) {
    return new Promise(resolve => {
      $("#guided-tour-overlapp").addClass("visible");
      TaskScenarioServiceClient.goToCreateTask(speed)
        .then(() => TaskScenarioServiceClient.fillCreateTaskForm(speed, options))
        .then(() => TaskScenarioServiceClient.fillUpdateTaskForm(speed, options))
        .then(() => TaskScenarioServiceClient.validateTask(speed, options))
        .then(() => {
          resolve()
          $("#guided-tour-overlapp").removeClass("visible");
        })
    })
  }

  static goToCreateTask(speed) {
    return new Promise(resolve => {
      GuidedTourServiceClient.alert("We are going to create a task", 300 * speed, "center", "small")
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
      GuidedTourServiceClient.closeMenu()
        .then(() => GuidedTourServiceClient.alert("<p>This is the creation form where you only fill the principal information.</p>" +
          "<p>More to come just after</p>", 600 * speed, "center", "medium"))
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
        .then(() => GuidedTourServiceClient.alert("<p>Congrats ! First task created, now let's look at everything you can configured for it.</p>" +
          "<p>It's all optional, you tune as you please</p>", 3000 * speed, "center", "medium"))
        .then(() => resolve());
    })
  }

  //assuming where are already on the update form
  static fillUpdateTaskForm(speed, options) {
    return new Promise(resolve => {
      GuidedTourServiceClient.closeMenu()
      // .then(() => GuidedTourServiceClient.selectOption("Linked Activity", options.activityName, 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.typeText("just make huge pile of sand, left and right",
          "[name=description]", 10 * speed))
        .then(() => GuidedTourServiceClient.sleep(500 * speed))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Equipment)"))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.typeEquipment(10, "colson", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.typeEquipment(5, "fenwick", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(500 * speed))
        // TODO time slots stuff
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.alert("Validationnnnnnnnnnn explication\nLalalal\nPouet pouet", 3000 * speed, "center", "medium"))
        .then(() => GuidedTourServiceClient.typeText("something about validaiton assignment", ".validation-comment-input[for='Time Slot'] input", 50 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Time Slot'] .askforvalidation-button", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(300 * speed))
        .then(() => resolve());
      //did you noticed the update happening in the top bar ? All all your actions are right away recorded and save
      //some information needs a manual update though, it's always clear what needs to be manually updated.
    })
  }

  static validateTask(speed, options) {
    return new Promise(resolve => {
      GuidedTourServiceClient.alert("Now, we are going to validate this task. Manifmaker comes wih customizable roles access, let's use a user who has 'general information' and 'equipement' right to validade",
        speed * 4000, "center", "medium")
        .then(() => GuidedTourServiceClient.logout(speed))
        .then(() => GuidedTourServiceClient.login(speed, options.assignmentUser))
        .then(() => GuidedTourServiceClient.openMenu())
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-task", 400 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-task ~.dropdown-menu [href='/tasks']", speed * 400))
        .then(() => GuidedTourServiceClient.waitFor("Tasks List"))
        .then(() => GuidedTourServiceClient.alert("<p>You can filter the list in several ways, let's filter to highlights the ones pending validate</p><p>(I know, it doens't make sense to filter a such small list)</p>",
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
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Time slots)"))
        .then(() => GuidedTourServiceClient.alert("<p>As you can see, time slots ca no longer be updated</p><p>Let's go to do some assignments</p>", speed * 2000, "top-right", "medium"))
        .then(() => resolve())
    })
  }
}