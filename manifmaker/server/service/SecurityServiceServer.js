/** @class SecurityServiceServer */
export class SecurityServiceServer {

    /**
     * @summary throw error if userId does not have the role needed to update the doc
     * @param userId {MongoId}
     * @param neededRole {RoleEnum}
     * @param doc {object} the whole object to update
     */
    static grantAccessToItem(userId, neededRole, doc) {
        if (Roles.userIsInRole(userId, neededRole) ||
            (Meteor.isDevelopment && Meteor.isServer) //TODO : MAX SECURITY BREACH : if a user is not logged in in dev mode, he will have all access
        ) {
            //console.info(`access granted with ${neededRole} on type item ${type} for user ${userId} to task ${doc._id}`);
        } else {
            console.error("thrown to client 403", `Forbidden, user ${userId} don't have access right ${neededRole}`);
            throw new Meteor.Error("403", `Forbidden, user don't have access right`);
        }

    }

    /**
     * same as grantAccessToItem but return true (access granted) or false (access denied)
     * @param userId
     * @param neededRole
     * @param doc
     * @returns {boolean}
     */
    static testAccessToItem(userId, neededRole, doc) {
        if (Roles.userIsInRole(userId, neededRole))
            return true;
        else {
            return false;
        }
    }

    static grantAccessToCollection(userId, neededRole, collection) {
        if (Roles.userIsInRole(userId, neededRole)) {
            console.info(`access granted with ${neededRole} on collection ${collection} for user ${userId}`);
            return true;
        } else {
            console.info(`access NOT granted with ${neededRole} on collection ${collection} for user ${userId}`);
            return false;
        }
    }
}
