import {EquipmentComponent} from "../../common/EquipmentComponent"

class TaskEquipmentsComponent extends EquipmentComponent {

  constructor() {
    super();
    this.equipementTargetUsage = EquipementTargetUsage.TASK
  }

  template() {
    return "taskEquipments";
  }

  taskData() {
    return this.data();
  }

}


TaskEquipmentsComponent.register("TaskEquipmentsComponent");