import {SecurityServiceServer} from "../../server/service/SecurityServiceServer"

/** @class ServerEquipmentService */
export class ServerEquipmentService {

  /**
   * @summary  Equipments.before.update
   * @description
   * - Collection Hooks :  Equipments.before.update
   * - Needed role : CONFMAKER
   * - cannot update targetUsage
   */
  static allowUpdate(userId, doc, fieldNames, modifier, options) {
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.CONFMAKER, doc, 'Equipments');

    if (modifier && modifier.$set && modifier.$set.targetUsage && modifier.$set.targetUsage !== doc.targetUsage) {
      console.error("thrown to client 403", `Forbidden, Equipment ${doc.name} target usage cannot be updated`);
      throw new Meteor.Error("403", `Forbidden, Equipment target usage cannot be updated`);
    }
  }


  static propagateNewEquipment(userId, doc) {
    if (doc.targetUsage === EquipementTargetUsage.TASK) {
      ServerEquipmentService.initEquipment(Tasks, doc);
    } else if (doc.targetUsage === EquipementTargetUsage.ACTIVITY) {
      ServerEquipmentService.initEquipment(Activities, doc);
    } else if (doc.targetUsage === EquipementTargetUsage.BOTH) {
      ServerEquipmentService.initEquipment(Activities, doc);
      ServerEquipmentService.initEquipment(Tasks, doc);
    }
  }


  static propagateRemoveEquipment(userId, doc) {
    if (doc.targetUsage === EquipementTargetUsage.TASK) {
      ServerEquipmentService.deleteEquipment(Tasks, doc);
    } else if (doc.targetUsage === EquipementTargetUsage.ACTIVITY) {
      ServerEquipmentService.deleteEquipment(Activities, doc);
    } else if (doc.targetUsage === EquipementTargetUsage.BOTH) {
      ServerEquipmentService.deleteEquipment(Activities, doc);
      ServerEquipmentService.deleteEquipment(Tasks, doc);
    }
  }

  static deleteEquipment(Collection, doc) {
    if (!Collection.findOne()) return
    Collection.update({}, {
      $pull: {
        equipments: {
          equipmentId: doc._id
        }
      }
    }, {multi: true});
  }

  static initEquipment(Collection, doc) {
    if (!Collection.findOne()) return
    Collection.update({}, {
      $push: {
        equipments: {
          equipmentId: doc._id,
          quantity: 0
        }
      }
    }, {multi: true});
  }

}