import {ActivityScenarioServiceClient} from "./ActivityScenarioServiceClient";
import {TaskScenarioServiceClient} from "./TaskScenarioServiceClient";
import {UserScenarioServiceClient} from "./UserScenarioServiceClient";

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
    ActivityScenarioServiceClient.playScenario(options, speed)
      .then(() => TaskScenarioServiceClient.playScenario(options, speed))
      .then(() => UserScenarioServiceClient.playScenario(options, speed)).then(() => {
      $("#guided-tour-overlapp").removeClass("visible");
    })
  }

  static playActivityScenario(speed = 1) {
    let options = {
      year: "2018",
      activityName: "Sandcastle On The Beach " + new moment().format("hhmmss"),
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
      guestUser: {  //read only (son planning et ses fiches tches)
        email: "superadmin@yopmail.com",
        pwd: "superadmin"
      }
    };
    ActivityScenarioServiceClient.playScenario(options, speed);
  }

  static playTaskScenario(speed = 1) {
    //names in CamelCase because UI sometimes format it this way
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
      guestUser: {  //read only (son planning et ses fiches tches)
        email: "superadmin@yopmail.com",
        pwd: "superadmin"
      }
    };
    console.log("using", options)
    TaskScenarioServiceClient.playScenario(options, speed);
  }
}