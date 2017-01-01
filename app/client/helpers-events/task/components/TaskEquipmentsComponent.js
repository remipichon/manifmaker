import {EquipmentComponent} from "../../common/EquipmentComponent"

class TaskEquipmentsComponent extends EquipmentComponent{

    template() {
        return "taskEquipments";
    }

    taskData(){
        return this.data();
    }

    constructor(){
        super();
        this.equipementTargetUsage = EquipementTargetUsage.TASK
    }

}


TaskEquipmentsComponent.register("TaskEquipmentsComponent");