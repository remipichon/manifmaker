import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/** @class ServerActivityService */
export class ServerActivityService {

  /**
   * @summary  Activities.before.insert
   * @description
   * - Collection Hooks :  Activities.before.insert
   * - Needed role : ACTIVITYWRITE
   */
  static allowInsert(userId, doc) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ACTIVITYWRITE, doc, 'activity');
  }

  /**
   * @summary  Activities.before.update
   * @description
   * - Collection Hooks :  Activities.before.update
   * - Needed role : ACTIVITYWRITE
   */
  static allowUpdate(userId, doc, fieldNames, modifier, options) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ACTIVITYWRITE, doc, 'activity');

    if (_.contains(fieldNames, "accessPassValidation"))
      if (modifier.$set.accessPassValidation.currentState !== ValidationState.TOBEVALIDATED)
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ACCESSPASSVALIDATION, doc, 'activity');

    if (_.contains(fieldNames, "generalInformationValidation")) {
      if (modifier.$set.generalInformationValidation.currentState !== ValidationState.TOBEVALIDATED)
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTVALIDATION, doc, 'activity');
    }

    if (_.contains(fieldNames, "equipmentValidation"))
      if (( modifier.$set.equipmentValidation && modifier.$set.equipmentValidation.currentState !== ValidationState.TOBEVALIDATED &&
          modifier.$set["equipmentValidation.currentState"] !== ValidationState.TOBEVALIDATED))
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.EQUIPMENTVALIDATION, doc, 'activity');

  }

  /**
   * @summary  Activities.before.delete
   * @description
   * - Collection Hooks :  Activities.before.delete
   * - Needed role : ACTIVITYDELETE
   */
  static allowDelete(userId, doc) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ACTIVITYDELETE, doc, 'activity');
  }
}