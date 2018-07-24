import {SecurityServiceServer} from "../../server/service/SecurityServiceServer";

/** @class ServerTaskGroupService */
export class ServerTaskGroupService {

  /**
   * @summary  TaskGroups.before.insert
   * @description
   * - Collection Hooks :  TaskGroups.before.insert
   * - Needed role : TASKGROUPWRITE
   */
  static allowInsert(userId, doc) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKGROUPWRITE, doc, 'taskGroup');
  }

  /**
   * @summary  TaskGroups.before.update
   * @description
   * - Collection Hooks :  TaskGroups.before.update
   * - Needed role : TASKGROUPWRITE
   */
  static allowUpdate(userId, doc, fieldNames, modifier, options) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKGROUPWRITE, doc, 'taskgroup');
  }

  /**
   * @summary  TaskGroups.before.delete
   * @description
   * - Collection Hooks :  TaskGroups.before.delete
   * - Needed role : TASKGROUPDELETE
   */
  static allowDelete(userId, doc) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKGROUPDELETE, doc, 'taskgroup');
  }

  /**
   * @summary  TaskGroups.after.delete
   * @description
   * - Collection Hooks :  TaskGroups.after.delete
   */
  static afterRemove(userId, doc) {
    Tasks.update(
      {
        groupId: doc._id
      }, {
        $set: {
          groupId: null
        }
      }
    );
  }
}