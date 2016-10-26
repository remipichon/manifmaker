/** @class SecurityServiceClient */
export class SecurityServiceClient {

    /**
     * @summary check if userId has the neededRole, throw error if not
     * @param userId {Mongo_id}
     * @param neededRole {RolesEnum}
     * @param page {String} for logging purpose only
     */
    static grantAccessToPage(neededRole, page) {
        var _id = Meteor.userId();
        if (!Roles.userIsInRole(_id, neededRole)) {
            console.error("403", `Can't access page ${page}, user don't have access right`);
            throw new Meteor.Error("403", `Can't access page ${page}, user don't have access right`);
        }
    }

    /**
     * @summary soft check if userId has the neededRole, return true or false
     * @param userId {Mongo_id}
     * @param neededRole {RolesEnum}
     * @param page {String} for logging purpose only
     * @return {true|false}
     */
    static softGrantAccessToPage(neededRole, page) {
        var _id = Meteor.userId();
        return Roles.userIsInRole(_id, neededRole);
    }

}

