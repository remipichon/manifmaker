import {EquipmentComponent} from "../../common/EquipmentComponent"

class ActivityEquipmentsComponent extends EquipmentComponent {

    template() {
        return "activityEquipments";
    }

    activityData(){
        return this.data();
    }

    constructor() {
        super();
        this.equipementTargetUsage = EquipementTargetUsage.ACTIVITY
    }

}


ActivityEquipmentsComponent.register("ActivityEquipmentsComponent");