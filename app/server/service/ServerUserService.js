import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"
import {ServerTaskService} from "../../server/service/ServerTaskService"
import {TimeSlotService} from "../../both/service/TimeSlotService"


/** @class ServerUserService */
export class ServerUserService {

    /**
     * @summary Update a user to add specific fields not handled by Meteor Accounts
     * @param userId (will be always null)
     * @param doc
     * @locus server
     */
    static updateUser(userId, doc) {
        //user is not log in yet, userId is null, we bypass security with .direct and propagate role with direct call to method
        var defaultGroupRole = "minimal";
        var minimalGroup = GroupRoles.findOne({name:defaultGroupRole});

        if(!minimalGroup){
            console.error(`Are you injecting data pragmatically ? If so, ignore this message. GroupRoles with name '${defaultGroupRole}' doesn't exists, user '${doc.name}' will not be created as a custom user as it won't have any roles. `)
            return;
        }

        var minimalId = minimalGroup._id;
        var _id = Meteor.users.direct.update(doc._id, {
            $set: {
                name: doc.username,
                loginUserId: Meteor.users.findOne({username: doc.username})._id,
                groupRoles: [minimalId],
                //nickName: doc.username
            }
        });

        console.info("A new user has been update :"+doc.username+" whith _id :"+_id+" and 'minimal' group roles");
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
                console.info("Roles.setUserRoles"+ doc.loginUserId,allGroupRolesMerged);
                console.log(doc._id,allGroupRolesMerged);
                Roles.setUserRoles(doc._id, allGroupRolesMerged); //add to Account package
            }
        } else {//insert
            if(doc.groupRoles){
                var allGroupRolesMerged = ServerUserService.getRolesFromGroupRoles(doc.groupRoles);
                console.info("Roles.setUserRoles"+ doc.loginUserId,allGroupRolesMerged);
                Roles.setUserRoles(doc.loginUserId, allGroupRolesMerged); //add to Account package
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
        if(_.contains(fieldNames, "services")) //Meteor account doing its bizness
            return true;

        if (userId !== doc.loginUserId)
            SecurityServiceServer.grantAccessToItem(userId, RolesEnum.USERWRITE, doc, 'user');

        if (_.contains(fieldNames, "groupRoles"))
                SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ROLE, doc, 'user');

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

        var user = Meteor.users.findOne(doc._id);
        if(user.name === SUPERADMIN){
            if (_.contains(fieldNames, "groupRoles"))
                if (modifier.$set.groupRoles)
                    if(user.groupRoles.length !== 0)
                        throw new Meteor.Error("403","User superadmin can not be updated");
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