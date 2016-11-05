import {ServerUserService} from "./ServerUserService";
import {ServerService} from "./ServerService";
import {SecurityServiceServer} from "./SecurityServiceServer";

/** @class InjectDataHelperServerService */
export class InjectDataHelperServerService {

    static setTeamsAndSkills(userId, teams, skills) {
        if (teams)
            Meteor.users.update(userId, {
                $set: {
                    teams: teams,
                }
            });
        if (skills)
            Meteor.users.update(userId, {
                $set: {
                    skills: skills
                }
            });
    }

    static createAccountAndUser(username, email, password, groupRoleId) {
        return Accounts.createUser({
            username: username,
            email: email,
            password: password
        });
    }

    static setGroupRolesToUsers(userId, groupId) {
        if (!groupId) return;
        var groupArray;
        if (Array.isArray(groupId))
            groupArray = groupId
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

        AssignmentTerms.remove({});
    }

    static initAccessRightData() {
        if (Meteor.users.findOne({username: SUPERADMIN})) {
            return;
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
        var password = "superadmin";
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
                groupRoles: groupArray
            }
        });


        //propage role by hand because we need to use .direct to skip security control (superadmin can never be updated)
        ServerUserService.propagateRoles(null, {
            groupRoles: groupArray,
            _id: id
        });


    }



}