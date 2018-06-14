import {EquipmentComponent} from "../../common/EquipmentComponent"
import {EquipmentService} from "../../../../both/service/EquipmentService"

class ActivityEquipmentsComponent extends EquipmentComponent {

  constructor() {
    super();
    this.equipementTargetUsage = EquipementTargetUsage.ACTIVITY
  }

  template() {
    return "activityEquipments";
  }

  activityData() {
    return this.data();
  }

  computeEquipmentExtra(equipmentCategory) {
    var extraCompute = equipmentCategory.extraComputeRule;

    if (extraCompute === "SUM") {

      var categoryEquipments = EquipmentService.findByCategory(equipmentCategory._id).fetch();
      var activityEquipments = this.activityData().equipments;

      var categoryEquipmentIds = _.map(categoryEquipments, equipment => {
        return equipment._id
      });
      var activityEquipmentCategory = _.filter(activityEquipments, activityEquipment => {
        return categoryEquipmentIds.indexOf(activityEquipment.equipmentId) !== -1
      });

      var res = 0;
      activityEquipmentCategory.forEach(equipment => {
        var extra = parseInt(Equipments.findOne(equipment.equipmentId).extra);
        res += equipment.quantity * extra
      });

      return res + " Watts";

    } else
      console.error(extraCompute + " is not a valid equipment extra compute rule (SUM is the only one authorized)");
  }

}


ActivityEquipmentsComponent.register("ActivityEquipmentsComponent");