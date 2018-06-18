import {ActivityScenarioServiceClient} from "./ActivityScenarioServiceClient";
import {TaskScenarioServiceClient} from "./TaskScenarioServiceClient";
import {UserScenarioServiceClient} from "./UserScenarioServiceClient";
import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class PlayTourServiceClient {

  static playScenarii(speed = 1) {
    let options = {
      year: "2018",
      activityName: "Sandcastle On The Beach " + new moment().format("hhmmss"),
      taskName: "Pile Up Sand" + new moment().format("hhmmss"),
      regularUser: {  //ACTIVITY RW TASK RW
        email: "superadmin@yopmail.com",
        pwd: "superadmin"
      },
      equipmentUser: {  //ACTIVITY RW TASK RW EQUIPMENTVALIDATION ACTIVIITYGENERALVALIDATION CONFMAKER
        email: "superadmin@yopmail.com",
        pwd: "superadmin"
      },
      assignmentUser: {  //ACTIVITY RW TASK RW ASSIGNMENTVALIDAITON  ASSIGNMENTTASKUSER
        email: "superadmin@yopmail.com",
        pwd: "superadmin"
      },
      volunteerUser: {  //part of team with access to terms, already validated (son planning et ses fiches tches)
        email: "hard@yopmail.com",
        pwd: "hard",
        availabilities: [
          "Wed Jun 16 2021 02:00:00 GMT+0200",
          "Wed Jun 16 2021 04:00:00 GMT+0200",
          "Wed Jun 16 2021 06:00:00 GMT+0200",
          "Wed Jun 16 2021 08:00:00 GMT+0200",
          "Wed Jun 16 2021 10:00:00 GMT+0200",
          "Wed Jun 16 2021 14:00:00 GMT+0200",
          "Wed Jun 16 2021 16:00:00 GMT+0200",
        ]
      },
      term: {
        name: "Premanif"
      },
      timeSlot: {
        start: "Wed Jun 16 2021 04:00:00 GMT+0200",
        start2: "Wed Jun 16 2021 02:00:00 GMT+0200" //tricks
      }
    };
    $("#guided-tour-overlapp").addClass("visible");
    console.log("using", options);
    PlayTourServiceClient.intro(speed)
      .then(() => ActivityScenarioServiceClient.playScenario(options, speed))
      .then(() => TaskScenarioServiceClient.playScenario(options, speed))
      .then(() => UserScenarioServiceClient.playScenario(options, speed)).then(() => {
      $("#guided-tour-overlapp").removeClass("visible");
    })
  }

  static intro(speed){
    return GuidedTourServiceClient.alert("<p>Bienvenue dans le tour guidé de Manfimaker</p>" +
        "<p>Aujourd'hui nous allons suivre Bob l'Eponge et ses amis organiser une apres midi a la plage</p>" +
        "<p>Ils veulent s'assurer de passer une bonne après midi bien organisée alors ils se sont tournés vers Manifmaker pour les aider dans l'organisation</p>" +
        "<p>Je vais te guider à travers l'application, tu n'as qu'à suivre et me lire de temps en temps.</p>" +
        "<p>C'est parti !</p>",30000 * speed, "center", "big")
  }

}