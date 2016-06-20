import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/** @class ServerReferenceCollectionsService */
export class ServerReferenceCollectionsService {

    /**
     * @summary  ReferenceCollection.before.insert
     * @description
     * - Collection Hooks :  ReferenceCollection.before.insert
     * - Needed role : CONFMAKER
     */
    static allowInsert(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'ReferenceCollection');
    }
    
    /**
     * @summary  ReferenceCollection.before.update
     * @description
     * - Collection Hooks :  ReferenceCollection.before.update
     * - Needed role : CONFMAKER
     */
    static allowUpdate(userId, doc, fieldNames, modifier, options) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'ReferenceCollection');
    }
    
    /**
     * @summary  ReferenceCollection.before.remove
     * @description
     * - Collection Hooks :  ReferenceCollection.before.remove
     * - Needed role : CONFMAKER
     */
    static allowDelete(userId, doc) {
        SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'ReferenceCollection');
    }

}