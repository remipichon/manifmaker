import {ServerUserService} from "./ServerUserService";
import {SecurityServiceServer} from "./SecurityServiceServer";

/** @class InjectDataHelperServerService */
export class InjectDataHelperServerService {

  static isInjectDataRequired(envReport) {
    if (envReport.dataInjectEverytime) {
      console.info("Meteor.startup: dev mode: inject data (env DATA_INJECT_EVERYTIME)");
      return true;
    } else if (envReport.dataInjectOnce) {
      if (InjectDataInfo.findOne({triggerEnv: "DATA_INJECTED"})) {
        console.info("Meteor.startup: dev mode: inject once skipped because it has already been injected (env DATA_INJECT_ONCE)");
        return false;
      } else {
        console.info("Meteor.startup: dev mode: inject once (env DATA_INJECT_ONCE)");
        return true;
      }
    } else {
      console.info("Meteor.startup: dev mode: none of env DATA_INJECT_ONCE or env DATA_INJECT_EVERYTIME specified, injecting nothing");
      return false;
    }
  }

  static setTeamsAndSkills(userId, teams, skills) {
    if (teams)
      Meteor.users.update(userId, {
        $set: {
          teams: teams,
        }
      });
    console.log("setSkills", userId, skills);
    if (skills)
      Meteor.users.update(userId, {
        $set: {
          skills: skills
        }
      });
  }

  static createAccountAndUser(username, email, password, groupRoleId) {
    let userId = Accounts.createUser({
      username: username,
      email: email,
      password: password
    });
    InjectDataHelperServerService.setGroupRolesToUsers(userId, groupRoleId);
    return userId;
  }

  static setGroupRolesToUsers(userId, groupId) {
    if (!groupId) return;
    var groupArray;
    if (Array.isArray(groupId))
      groupArray = groupId;
    else
      groupArray = [groupId];

    Meteor.users.update(userId, {
      $set: {
        groupRoles: groupArray
      }
    });
  }

  static getDateFromDateAndHourMinute(year, month, day, hour = 0, minute = 0) {
    return new moment().year(year).month(month).date(day).hour(hour).minute(minute).second(0).millisecond(0).toDate();
  }

  static updateTaskEquipmentQuantity(taskId, equipmentId, quantity) {
    Tasks.update({_id: taskId, "equipments.equipmentId": equipmentId}, {
      $set: {
        "equipments.$.quantity": quantity
      }
    });
  }

  static injectRoles() {
    var superadminRoles = [];
    _.each(RolesEnum, function (role) {
      Roles.createRole(role);
      superadminRoles.push(role);
    });
    return superadminRoles;
  }

  static deleteAll() {
    SecurityServiceServer.isItProd();
    Meteor.roles.direct.remove({});
    GroupRoles.direct.remove({});

    Meteor.users.direct.remove({});

    Assignments.direct.remove({});
    Tasks.remove({});
    Activities.remove({});
    Settings.remove({});
    Places.remove({});
    Teams.remove({});
    TaskGroups.remove({});
    Skills.remove({});
    Teams.remove({});
    EquipmentCategories.remove({});
    Equipments.remove({});
    WaterSupplies.remove({});
    WaterDisposals.remove({});
    PowerSupplies.remove({});
    EquipmentStorages.remove({});
    AccessPoints.remove({});
    WebCategories.remove({});
    AndroidCategories.remove({});

    AssignmentTerms.remove({});

    InjectDataInfo.remove({});
  }

  static makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  static printSuperAdmin(password) {
    console.log("***********************************************************************");
    console.log("***********************************************************************");
    console.log("*");
    console.log("*");
    console.log("*");
    console.log("*");
    console.log("*");
    console.info("Superadmin has been created with password :", password);
    console.log("*");
    console.log("*");
    console.log("*");
    console.log("*");
    console.log("*");
    console.log("*");
    console.log("***********************************************************************");
    console.log("***********************************************************************");

  }

  static initAccessRightData() {
    if (Meteor.users.findOne({username: SUPERADMIN})) {
      return false;
    }
    console.info(SUPERADMIN + " user not found, now injecting roles and superadmin user");

    //create roles
    console.info("inject Roles");
    var superadminRoles = InjectDataHelperServerService.injectRoles();

    var superAdmin = GroupRoles.insert({
      name: "superadmin",
      roles: superadminRoles
    });

    var email = "superadmin@yopmail.com";
    var username = "superadmin";
    var password;
    if (Meteor.isDevelopment)
      password = "superadmin";
    else
      password = InjectDataHelperServerService.makeid();

    var groupArray;
    if (Array.isArray(superAdmin))
      groupArray = superAdmin;
    else
      groupArray = [superAdmin];

    var id = Accounts.createUser({
      username: username,
      email: email,
      password: password
    });


    Meteor.users.direct.update(id, {
      $set: {
        username: username,
        _id: id,
        groupRoles: groupArray,
        hideAllDismissible: true
      }
    });


    //propage role by hand because we need to use .direct to skip security control (superadmin can never be updated)
    ServerUserService.propagateRoles(null, {
      groupRoles: groupArray,
      _id: id
    });

    InjectDataHelperServerService.printSuperAdmin(password);


    return password;
  }


}