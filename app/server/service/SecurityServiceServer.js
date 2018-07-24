/** @class SecurityServiceServer */
export class SecurityServiceServer {

  /**
   * @summary throw error if userId does not have the role needed to update the doc
   * @param userId {MongoId}
   * @param neededRole {RoleEnum}
   * @param doc {object} the whole object to update
   */
  static grantAccessToItem(userId, neededRole, doc) {
    if (Meteor.isStartingUp) {
      console.info("SecurityServiceServer.grantAccessToItem : security skipped because Meteor.isStartingUp");
      return true;
    }
    if (Roles.userIsInRole(userId, neededRole)) {
      console.info(`access granted with ${neededRole} on type item for user ${userId} to task ${doc._id}`);
    } else {
      console.error("thrown to client 403", `Forbidden, user ${userId} don't have access right ${neededRole}`);
      throw new Meteor.Error("403", `Forbidden, user don't have access right`);
    }

  }

  /**
   * same as grantAccessToItem but return true (access granted) or false (access denied) without log
   * @param userId
   * @param neededRole
   * @returns {boolean}
   */
  static testAccessToItem(userId, neededRole) {
    if (Roles.userIsInRole(userId, neededRole))
      return true;
    else {
      return false;
    }
  }


  /**
   * same as grantAccessToItem but return true (access granted) or false (access denied) with
   * @param userId
   * @param neededRole
   * @param collection {String} collection name to get access
   * @returns {boolean}
   */
  static grantAccessToCollection(userId, neededRole, collection) {
    if (Roles.userIsInRole(userId, neededRole)) {
      console.info(`access granted with ${neededRole} on collection ${collection} for user ${userId}`);
      return true;
    } else {
      console.info(`access NOT granted with ${neededRole} on collection ${collection} for user ${userId}`);
      return false;
    }
  }

  static isItProd(method) {
    if (Meteor.isProduction)
      throw new Meteor.Error("403", `'${method}' can not be used in production.`);
  }
}
