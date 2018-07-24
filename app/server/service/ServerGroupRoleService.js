import {SecurityServiceServer} from "../../server/service/SecurityServiceServer";

/** @class ServerUserService */
export class ServerGroupRoleService {

  /**
   * @summary  GroupRole.before.insert
   * @description
   * - Collection Hooks :  GroupRole.before.insert
   * - Needed role : CONFMAKER
   */
  static allowInsert(userId, doc) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'groupRole');
  }

  /**
   * @summary  GroupRole.before.update
   * @description
   * - Collection Hooks :  GroupRole.before.update
   * - Needed role : CONFMAKER
   */
  static allowUpdate(userId, doc, fieldNames, modifier, options) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'groupRole');
    if (GroupRoles.findOne(doc._id).name === "superadmin") {
      throw new Meteor.Error("403", "Group Role superadmin can not be updated");
    }
  }

  /**
   * @summary  GroupRole.before.remove
   * @description
   * - Collection Hooks :  GroupRole.before.remove
   * - Needed role : CONFMAKER
   */
  static allowDelete(userId, doc) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'groupRole');
    if (GroupRoles.findOne(doc._id).name === "superadmin") {
      throw new Meteor.Error("403", "Group Role superadmin can not be deleted");
    }
  }

}