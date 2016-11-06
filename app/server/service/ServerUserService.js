import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"
import {ServerTaskService} from "../../server/service/ServerTaskService"
import {TimeSlotService} from "../../both/service/TimeSlotService"
import { Accounts } from 'meteor/accounts-base'


/** @class ServerUserService */
export class ServerUserService {

    static updateUserName(userId,newUsername){
        Accounts.setUsername(userId, newUsername);
    }


    static updateUserEmail(userId,newEmail) {

        var email = Meteor.users.findOne(userId).emails[0];
        if (email) {
            var oldEmail = email.address;
            Accounts.removeEmail(userId, oldEmail);
        }
        Accounts.addEmail(userId, newEmail);
    }

    static sendVerificationEmail(userId){
        Accounts.sendVerificationEmail(userId);
    }

    /**
     * @summary Update a user to add specific fields not handled by Meteor Accounts
     * @param userId (will be always null)
     * @param doc
     * @locus server
     */
    static updateUser(userId, doc) {
        //user is not log in yet, userId is null, we bypass security with .direct and propagate role with direct call to method
        var settings = Settings.findOne();
        if(settings)
            var defaultGroupRoles = settings.defaultGroupRoles;
        if(!defaultGroupRoles){
            console.error("No default group role has been found, user will not be able to access anything");
            return;
        }

        if(!defaultGroupRoles){
            console.error(`Are you injecting data pragmatically ? If so, ignore this message. GroupRoles with name '${defaultGroupRoles.name}' doesn't exists, user '${doc.name}' will not be created as a custom user as it won't have any roles. `)
            return;
        }

        var defaultGroupRolesId = defaultGroupRoles._id;
        var _id = Meteor.users.update(doc._id, {
            $set: {
                groupRoles: [defaultGroupRolesId],
            }
        });

        console.info("A new user has been update :"+doc.username+" whith _id :"+_id+" and '"+defaultGroupRoles.name+"' group roles");
    }

    /**
     * @summary GroupRoles.after.update hook
     * @description
     * If group roles' roles are updated user roles are update as well.
     * @locus server
     * @param userId
     * @param doc
     * @param fieldNames
     * @param modifier
     * @param options
     */
    static propagateGroupRoles(userId, doc, fieldNames, modifier, options) {
        if (_.contains(fieldNames, "roles")) {

            //users having the updated groupRole
            var users = Meteor.users.find({groupRoles: doc._id}).fetch();
            users.forEach(user => {
                //update user roles, Account roles will be update by hooks
                var modifier = {
                    $set: {groupRoles: user.groupRoles}
                };
                //will fire the Meteor.users after hook and call propagateRoles
                Meteor.users.direct.update(user._id, modifier);
            });
        }
    }

    /**
     * @summary Meteor.users.after.update hook.
     * @description
     * About roles, we only add roles to the custom Meteor.users collection, **not** with the Roles library. This hooks is responsible to propagate roles to the
     * Meteor.users linked account.
     * @locus server
     * @param userId
     * @param doc
     * @param fieldNames
     * @param modifier
     * @param options
     */
    static propagateRoles(userId, doc, fieldNames, modifier) {
        var allGroupRolesMerged;
        if (fieldNames) { //update
            if (_.contains(fieldNames, "groupRoles")) {
                if (modifier.$set) {
                    //we have to merge roles and roles from groups
                    allGroupRolesMerged = ServerUserService.getRolesFromGroupRoles(modifier.$set.groupRoles);
                } else if(modifier.$push){
                    allGroupRolesMerged = ServerUserService.getRolesFromGroupRoles(modifier.$push.groupRoles.$each);
                } else {
                    //we have to remove all roles
                    allGroupRolesMerged = [];
                }
                console.info("Roles.setUserRoles "+ doc._id,allGroupRolesMerged);
                console.log(doc._id,allGroupRolesMerged);
                Roles.setUserRoles(doc._id, allGroupRolesMerged); //add to Account package
            }
        } else {//insert
            if(doc.groupRoles){
                var allGroupRolesMerged = ServerUserService.getRolesFromGroupRoles(doc.groupRoles);
                console.info("Roles.setUserRoles "+ doc._id,allGroupRolesMerged);
                Roles.setUserRoles(doc._id, allGroupRolesMerged); //add to Account package
            }
        }

    }

    static getRolesFromGroupRoles(groupRoles) {
        var newGroups = GroupRoles.find({_id: {$in: groupRoles}}).fetch(); //get all related roles
        var result = []; //reduce to get only the roles array
        newGroups.forEach(group => {
            result.push(group.roles);
        });
        var allGroupRolesMerged = _.uniq(_.flatten(result)); //obtain a single array
        return allGroupRolesMerged;
    }


    /**
     * @summary  Meteor.users.before.insert
     * @description
     * - Collection Hooks :  Meteor.users.before.insert
     * - Needed role : USERWRITE
     */
    static allowInsert(userId, doc) {
        if(!userId){
            console.info("allow insert user because userId is undefined, meaning a new user should be created with username "+doc.userName);
            return true;
        }
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.USERWRITE, doc, 'user');
    }

    /**
     * @summary  Meteor.users.before.update
     * @description
     * - Collection Hooks :  Meteor.users.before.update
     * - Needed role : USERWRITE
     *    - ROLE
     *    - ASSIGNMENTTASKUSER
     *
     * if userId is the doc being updated, no need of USERWRITE (a user can update itself)
     */
    static allowUpdate(userId, doc, fieldNames, modifier, options) {
        console.log(fieldNames)
        console.log(modifier)
        console.log("userId",userId);

        var user = Meteor.users.findOne(doc._id);


        //we are skipping some security test

        //Meteor account doing its bizness
        if(_.contains(fieldNames, "services") && ( fieldNames.length === 1 || fieldNames.length === 2 && _.contains(fieldNames, "emails")) ){
            console.info("Users.allowUpdate : authorizing updating user services because default its Meteor.account bizness")
            return true;
        }

        if(user.username === SUPERADMIN){
            if (_.contains(fieldNames, "groupRoles"))
                if (modifier.$set.groupRoles)
                    if(user.groupRoles.length !== 0)
                        throw new Meteor.Error("403","User superadmin can not be updated");

            //when superadmin is created, there is just superadmin group roles
            if (_.contains(fieldNames, "roles")) {
                var superadminGroupRoles = GroupRoles.findOne({name:"superadmin"});
                if (modifier.$set && modifier.$set.roles
                    && modifier.$set.roles.length === superadminGroupRoles.roles.length
                    && _.difference(modifier.$set.roles, superadminGroupRoles.roles).length === 0) {
                    console.info("Users.allowUpdate : authorizing setting superadmin roles because superadmin group role has been used")
                    return true;
                }
            }
        }

        //when inserting new user, its default group role have to be propagated even if default group role doesn't provide any roles
        var defaultGroupRoles = GroupRoles.findOne(Settings.findOne().defaultGroupRoles);

        //we authorize to $SET DEFAULT group role without any security check
        if (_.contains(fieldNames, "groupRoles") && fieldNames.length === 1)
            if (modifier.$set && modifier.$set.groupRoles
                && modifier.$set.groupRoles.length === 1) {
                console.info("Users.allowUpdate : authorizing setting user group roles because default group role has been used")
                return true;
            }

        //we authorize Meteor.account to update user roles to DEFAULT without any security check
        if (_.contains(fieldNames, "roles"))
            if (modifier.$set && modifier.$set.roles
                && modifier.$set.roles.length === defaultGroupRoles.roles.length
                && _.difference(modifier.$set.roles, defaultGroupRoles.roles).length === 0) {
                console.info("Users.allowUpdate : authorizing setting user roles because default group has been used")
                return true;
            }


        //back to classic security check
        if (userId !== doc._id)
                SecurityServiceServer.grantAccessToItem(userId, RolesEnum.USERWRITE, doc, 'user');

        if (_.contains(fieldNames, "groupRoles") ){
            SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ROLE, doc, 'user');
        }

        if (_.contains(fieldNames, "isReadyForAssignment"))
            if (modifier.$set.isReadyForAssignment)
                SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');

        if (_.contains(fieldNames, "teams")) {
            if (modifier.$pull)
                if (modifier.$pull.teams) {
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
                }
            if (modifier.$set) //TODO a virer
                if (modifier.$set.teams)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
            if (modifier.$push)
                if (modifier.$push.teams) {
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
                }
        }

        if (_.contains(fieldNames, "assignments")) {
            if (modifier.$pull)
                if (modifier.$pull.assignments)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
            if (modifier.$set) //TODO a virer
                if (modifier.$set.assignments)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
            if (modifier.$push)
                if (modifier.$push.assignments)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTTASKUSER, doc, 'user');
        }

    }

    /**
     * @summary  Meteor.users.before.remove
     * @description
     * - Collection Hooks :  Meteor.users.before.remove
     * - Needed role : USERDELETE
     */
    static allowDelete(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.USERDELETE, doc, 'task');

        if(Meteor.users.findOne(doc._id).name === SUPERADMIN){
            throw new Meteor.Error("403","User superadmin can not be deleted");
        }

        if(doc.assingments && doc.assignments.length !== 0 ){
            throw new Meteor.Error("403", "Can't delete user with assignments");
        }
    }

}