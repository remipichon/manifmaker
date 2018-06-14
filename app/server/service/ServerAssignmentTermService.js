import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/** @class ServerAssignmentTermService */
export class ServerAssignmentTermService {


  static isUsed(assignmentTerm) {
    var start = assignmentTerm.start;
    var end = assignmentTerm.end;

    //has availabilities
    if (Meteor.users.find({
        "availabilities": {
          $elemMatch: {
            start: {
              $gte: start,
              $lt: end
            },
            end: {
              $gt: start,
              $lt: end
            }
          }
        }
      }).fetch().length !== 0)
      return `Can't update/delete assignment term with availabilities (except name and deadline)`;


    //has timeSlots
    if (Tasks.find({
        "timeSlots": {
          $elemMatch: {
            start: {
              $gte: start,
              $lt: end
            },
            end: {
              $gt: start,
              $lt: end
            }
          }
        }
      }).fetch().length !== 0)
      return `Can't  update/delete assignment term with timeSlots (except name and deadline)`;
    return false;
  }

  /**
   * @summary  AssignmentTerm.before.insert
   * @description
   * - Collection Hooks :  AssignmentTerm.before.insert
   * - Needed role : CONFMAKER
   */
  static allowInsert(userId, doc) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'assignmentTerm');
  }

  /**
   * @summary  AssignmentTerm.before.update
   * @description
   * - Collection Hooks :  AssignmentTerm.before.update
   * - Needed role : CONFMAKER
   */
  static allowUpdate(userId, doc, fieldNames, modifier, options) {
    var updateAvailableFields = ["addAvailabilitiesDeadline", "name", "_id"]; //_id is not $set by AutoForm

    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'assignmentTerm');

    var isItUsed = ServerAssignmentTermService.isUsed(doc);
    if (isItUsed) {
      Object.keys(doc).forEach(field => {
        if (!_.contains(updateAvailableFields, field)) {
          if (JSON.stringify(doc[field]) !== JSON.stringify(modifier.$set[field])) {
            throw new Meteor.Error("403", isItUsed);
          }
        }
      })
    }
  }

  /**
   * @summary  AssignmentTerm.before.remove
   * @description
   * - Collection Hooks :  AssignmentTerm.before.remove
   * - Needed role : CONFMAKER
   */
  static allowDelete(userId, doc) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'assignmentTerm');
    var termIsUsed = ServerAssignmentTermService.isUsed(doc)
    if (termIsUsed)
      throw new Meteor.Error("403", termIsUsed);
  }

}