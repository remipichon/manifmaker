import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

export class ServerReferenceCollectionsService {

        static allowInsert(userId, doc){
            SecurityServiceServer.grantAccessToItem(userId,RolesEnum.CONFMAKER, doc,'ReferenceCollection');
        }

        static allowUpdate(userId, doc, fieldNames, modifier, options){
            SecurityServiceServer.grantAccessToItem(userId,RolesEnum.CONFMAKER, doc,'ReferenceCollection');
        }

        static allowDelete(userId, doc){
            SecurityServiceServer.grantAccessToItem(userId,RolesEnum.CONFMAKER, doc,'ReferenceCollection');
        }

    }