/** @class SecurityServiceClient */
export class SecurityServiceClient {

    /**
     * @summary check if userId has the neededRole
     * @param userId {Mongo_id}
     * @param neededRole {RolesEnum}
     * @param page {String} for logging purpose only
     */
        static grantAccessToPage(userId, neededRole,page) {
            if (!Roles.userIsInRole(userId, neededRole))
                throw new Meteor.Error("403", `Can't access page ${page}, user don't have access right`);
        }

    }

