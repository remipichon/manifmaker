SecurityServiceServer =
    class SecurityServiceServer {

        static grantAccessToItem(userId, neededRole, doc, type) {
            if (Roles.userIsInRole(userId, neededRole))
                console.info(`access granted with ${neededRole} on type item ${type} for user ${userId} to task ${doc._id}`);
            else {
                console.error("thrown to client 403", `Forbidden, user ${userId} don't have access right ${neededRole}`);
                throw new Meteor.Error("403", `Forbidden, user don't have access right`);
            }

        }

        static testAccessToItem(userId, neededRole, doc, type) {
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
