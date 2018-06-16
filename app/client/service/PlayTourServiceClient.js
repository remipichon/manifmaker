import {ActivityScenarioServiceClient} from "./ActivityScenarioServiceClient";

export class PlayTourServiceClient {

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
    ActivityScenarioServiceClient.playActivityScenario(options, speed);
  }
}