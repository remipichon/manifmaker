import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class PlayTourServiceClient {

  static playActivityScenario(speed = 1) {
    //TODO do something for activity name
    $("#guided-tour-overlapp").addClass("visible");
    PlayTourServiceClient.goToCreateActivity(speed)
      .then(() => PlayTourServiceClient.fillCreateActivityForm(speed))
      .then(() => PlayTourServiceClient.fillUpdateActivityForm(speed))
      //TODO then switch user to validate this activity
      .then(() => {
        console.log("playActivityScenario is done")
        $("#guided-tour-overlapp").removeClass("visible");
      })
  }

  static goToCreateActivity(speed) {
    return new Promise(resolve => {
      GuidedTourServiceClient.alert("We are going to create an activity", 300 * speed, "center", "small")
        .then(() => GuidedTourServiceClient.openMenu())
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity", 500 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
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
          "<p>More to come just after</p>", 600 * speed, "center", "medium"))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.typeText("Build", "[for=first_name] ~ input", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Team", "confiance", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("User responsible", "hard3", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert"), 600 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.waitFor("There is errors in the form"))
        .then(() => GuidedTourServiceClient.alert("<p>Oopsie, looks like something went wrong...</p>", speed * 3000, "center", "small"))
        .then(() => GuidedTourServiceClient.selectOption("Live event responsible", "bureau", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Place", "Bocal", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.waitFor("Insert"))
        .then(() => GuidedTourServiceClient.clickOn(GuidedTourServiceClient.findComponentByContent("Insert"), 400 * speed))
        .then(() => GuidedTourServiceClient.waitFor("Delete Build"))
        .then(() => GuidedTourServiceClient.alert("<p>Congrats ! First activity created, now let's look at everything you can configured for it.</p>" +
          "<p>It's all optional, you tune as you please</p>", 3000 * speed, "center", "medium"))
        .then(() => resolve());
    })
  }

  static logoutLogin(email, password) {
    return new Promise(resolve => {
      GuidedTourServiceClient.openMenu()
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("[href='#settings-dropdown']", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("[href='/logout']", speed * 300))
        .then(() => GuidedTourServiceClient.waitFor(".at-pwd-form"))
        .then(() => GuidedTourServiceClient.typeText(email, "#at-field-email", speed * 50))
        .then(() => GuidedTourServiceClient.typeText(password, "#at-field-password", speed * 50))
        .then(() => GuidedTourServiceClient.clickOn("#at-pwd-form .submit", speed * 200))
        .then(() => GuidedTourServiceClient.waitFor("Home"))
        .then(() => resolve)
    })
  }

  static fillUpdateActivityForm(speed) {
    //TODO do something with the dates to make sure it never fall behind
    return new Promise(resolve => {
      let activityName = "Chateau Coconuts";
      GuidedTourServiceClient.closeMenu()
        .then(() => GuidedTourServiceClient.selectDate(".date-time-picker-update-activity-start input", "10/02/2018", "Sep", "10", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectDate(".date-time-picker-update-activity-end input", "10/02/2018", "Sep", "18", 300 * speed))
        .then(() => GuidedTourServiceClient.typeText("This will be the best sandcastle in the word\nYou will have to use all the tools given to you, feel free to ask for help",
          "[name=description]", 50 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Equipment)"))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Water supply", "AIP", 300 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.alert("Validationnnnnnnnnnn explication\nLalalal\nPouet pouet", 3000 * speed, "center", "medium"))
        .then(() => GuidedTourServiceClient.typeText("Hey, is it all good ? No grammar mistakes?", ".validation-comment-input[for='General Information'] input", 0 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='General Information'] .askforvalidation-button", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(300 * speed))
        .then(() => GuidedTourServiceClient.typeText("I don't need the clipper, maybe you can remove it to accept it", ".validation-comment-input[for='Equipment'] input", 0 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Equipment'] .askforvalidation-button", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(300 * speed))
        .then(() => GuidedTourServiceClient.alert("Now, we are going to validate this activity. Manifmaker comes wih customizable roles access, let's use a user who has 'general information' and 'equipement' right to validade",
          speed * 4000, "center", "medium"))
        .then(() => PlayTourServiceClient.logoutLogin("superadmin@yopmail.com", "superadmin"))
        .then(() => GuidedTourServiceClient.openMenu())
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity", 500 * speed))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("#sidebar-activity ~.dropdown-menu [href='/activities']"))
        .then(() => GuidedTourServiceClient.waitFor("Activities List"))
        .then(() => GuidedTourServiceClient.alert("<p>You can filter the list in several ways, let's filter to highlights the ones pending validate</p><p>(I know, it doens't make sense to filter a such small list)</p>",
          speed * 4000, "center", "medium"))
        .then(() => GuidedTourServiceClient.clickOn("#advanced-search-button", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(100 * speed))
        .then(() => GuidedTourServiceClient.selectOption("Validation Status", "In validation process", 300))
        .then(() => GuidedTourServiceClient.sleep(100 * speed))
        .then(() => GuidedTourServiceClient.clickOn(`td:contains(${activityName}) ~ td .btn[title=edit]`))
        .then(() => GuidedTourServiceClient.waitFor(`Delete ${activityName}`))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
        .then(() => GuidedTourServiceClient.typeText("Mistakes, please review", ".validation-comment-input[for='General Information'] input", 0 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='General Information'] .refuse-button", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(300 * speed))
        .then(() => GuidedTourServiceClient.typeText("All good, you will have the clipper", ".validation-comment-input[for='Equipment'] input", 0 * speed))
        .then(() => GuidedTourServiceClient.clickOn(".validation-comment-input[for='Equipment'] .close-button", 200 * speed))
        .then(() => GuidedTourServiceClient.sleep(300 * speed))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Equipments)"))
        .then(() => GuidedTourServiceClient.alert("<p>As you can see, equipment ca no longer be updated</p><p>Let's go back to the other user to create tasks</p>", speed * 2000, "center", "small"))
        .then(() => resolve)
      //did you noticed the update happening in the top bar ? All all your actions are right away recorded and save
      //some information needs a manual update though, it's always clear what needs to be manually updated.
    })
  }
}