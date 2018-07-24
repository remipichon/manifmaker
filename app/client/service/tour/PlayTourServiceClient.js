import {ActivityScenarioServiceClient} from "./ActivityScenarioServiceClient";
import {TaskScenarioServiceClient} from "./TaskScenarioServiceClient";
import {UserScenarioServiceClient} from "./UserScenarioServiceClient";
import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class PlayTourServiceClient {

  static playScenarii(speed = 1, params) {
    let suffix = params.suffix;
    var options = {
      options: {
        year: params.year,
        month: params.month,
        date: params.date
      },
      activityName: "Sandcastle On The Beach " + suffix,
      taskName: "Pile Up Sand" + suffix,
      regularUser: {  //ACTIVITY RW TASK RW
        email: `spongebob${suffix}@yopmail.com`,
        pwd: `spongebob`,
        name: "spongebob" + suffix
      },
      equipmentUser: {  //ACTIVITY RW TASK RW EQUIPMENTVALIDATION ACTIVIITYGENERALVALIDATION CONFMAKER
        email: `patrickstar${suffix}@yopmail.com`,
        pwd: `patrickstar`,
        name: "patrickstar" + suffix
      },
      assignmentUser: {  //ACTIVITY RW TASK RW ASSIGNMENTVALIDAITON  ASSIGNMENTTASKUSER
        email: `sandycheeks${suffix}@yopmail.com`,
        pwd: `sandycheeks`
      },
      term: {
        name: `Journée Plage ${suffix}`
      },
      places: {
        plage: "Plage de Bikini Bottom"
      },
      teams: {
        regularTeam: "Dream Team " + suffix
      },
      equipments: {
        sautjaune: "saut jaune en plastique",
        sautbleu: "saut bleu en plastique",
        chaise: "chaise longue",
        pelle: "pelle en plastique"
      },
      skills: {
        fen: "Permis cariste pour le fen"
      }
    };


    let startDate = new moment().year(options.options.year).month(options.options.month).date(options.options.date).hour(0).minute(0).second(0);


    options.activityDate = startDate;

    options.timeSlot = {
      start: startDate.set("h", 10).toString(),
      start2: startDate.set("h", 8).toString() //tricks
    };

    options.volunteerUser = {  //part of team with access to terms, already validated
      email: `squidwardtantacles${suffix}@yopmail.com`,
      pwd: "squidwardtantacles",
      availabilities: [
        startDate.set("h", 8).toString(),
        startDate.set("h", 10).toString(),
        startDate.set("h", 14).toString(),
        startDate.set("h", 16).toString()
      ]
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

  static intro(speed) {
    return GuidedTourServiceClient.alert("<p>Bienvenue dans le tour guidé de Manfimaker</p>" +
      "<p>Aujourd'hui nous allons suivre Bob l'Eponge et ses amis organiser une apres midi a la plage</p>" +
      "<p>Ils veulent s'assurer de passer une bonne après midi bien organisée alors ils se sont tournés vers Manifmaker pour les aider dans l'organisation</p>" +
      "<p>Je vais te guider à travers l'application, tu n'as qu'à suivre et me lire de temps en temps.</p>" +
      "<p>C'est parti !</p>", 30000 * speed, "center", "big")
  }

}