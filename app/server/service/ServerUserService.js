import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"
import {ServerTaskService} from "../../server/service/ServerTaskService"

/** @class ServerUserService */
export class ServerUserService {

    /**
     * @summary Create a custom user from doc.username
     * @param userId (will be always null)
     * @param doc
     * @locus server
     */
    static createCustomUser(userId, doc) {
        console.info("create custom user with",doc.username);
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
            var users = Users.find({groupRoles: doc._id}).fetch();
            users.forEach(user => {
                //update user roles, Account roles will be update by hooks
                var modifier = {
                    $set: {groupRoles: user.groupRoles}
                };
                //will fire the Users after hook and call propagateRoles
                Users.update(user._id, modifier);
            });
        }
    }

    /**
     * @summary Users.after.update hook.
     * @description
     * About roles, we only add roles to the custom Users collection, **not** with the Roles library. This hooks is responsible to propagate roles to the
     * Meteor.users linked account.
     * @locus server
     * @param userId
     * @param doc
     * @param fieldNames
     * @param modifier
     * @param options
     */
    static propagateRoles(userId, doc, fieldNames, modifier) {
        if (fieldNames) { //update
            if (_.contains(fieldNames, "groupRoles")) {
                if (modifier.$set.groupRoles) {
                    //we have to merge roles and roles from groups
                    var allGroupRolesMerged = ServerUserService.getRolesFromGroupRoles(modifier.$set.groupRoles);
                } else {
                    //we have to remove all roles
                    var allGroupRolesMerged = [];
                }
                console.info("Roles.setUserRoles"+ doc.loginUserId,allGroupRolesMerged);
                Roles.setUserRoles(doc.loginUserId, allGroupRolesMerged); //add to Account package
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
     * @summary  Users.before.insert
     * @description
     * - Collection Hooks :  Users.before.insert
     * - Needed role : USERWRITE
     */
    static allowInsert(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.USERWRITE, doc, 'user');
    }

    /**
     * @summary  Users.before.update
     * @description
     * - Collection Hooks :  Users.before.update
     * - Needed role : USERWRITE
     *    - ROLE
     *    - ASSIGNMENTTASKUSER
     *
     * if userId is the doc being updated, no need of USERWRITE (a user can update itself)
     */
    static allowUpdate(userId, doc, fieldNames, modifier, options) {

        if (userId !== doc.loginUserId)
            SecurityServiceServer.grantAccessToItem(userId, RolesEnum.USERWRITE, doc, 'user');

        if (_.contains(fieldNames, "groupRoles"))
            if (modifier.$set.groupRoles)
                SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ROLE, doc, 'user');

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

        if(Users.findOne(doc._id).name === SUPERADMIN){
            throw new Meteor.Error("403","User superadmin can not be updated");
        }
    }

    /**
     * @summary  Users.before.remove
     * @description
     * - Collection Hooks :  Users.before.remove
     * - Needed role : USERDELETE
     */
    static allowDelete(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.USERDELETE, doc, 'task');

        if(Users.findOne(doc._id).name === SUPERADMIN){
            throw new Meteor.Error("403","User superadmin can not be deleted");
        }

        if(doc.assignments.length !== 0 ){
            throw new Meteor.Error("403", "Can't delete user with assignments");
        }
    }

}