import {ValidationService} from "../../../both/service/ValidationService"

export class EquipmentComponent extends BlazeComponent {

  constructor(isReadOnly) {
    super();
    this.isReadOnly = isReadOnly;
  }

  isEquipmentsUpdateAllowed() {
    return ValidationService.isUpdateAllowed(this.data().equipmentValidation.currentState);
  }

  isEquipmentsReadOnly() {
    return this.isReadOnly || !this.isEquipmentsUpdateAllowed();
  }

  displayItem(item) {
    if (this.data()[item] === null && this.isEquipmentsReadOnly())
      return false;
    return true;
  }


  equipmentsCategories() {
    var categories = EquipmentCategories.find().fetch();

    if (this.isEquipmentsReadOnly()) {
      //remove categories which have nothing to display for this target + that don't have any quantity
      var equipmentIdsWithAQuantity = this.equipmentIdsWithAQuantity();

      var result = [];
      _.each(categories, _.bind(function (category) {
        var equipmentsForACategory = Equipments.find({
          EquipmentCategories_Id: category._id,
          targetUsage: {$in: [EquipementTargetUsage.BOTH, this.equipementTargetUsage]}
        })
          .fetch();

        equipmentsForACategory = _.filter(equipmentsForACategory, function (equipment) {
          return _.contains(equipmentIdsWithAQuantity, equipment._id)
        });

        if (equipmentsForACategory.length !== 0) {
          result.push(category);
        }
      }, this));
      return result;
    } else {
      //remove categories which have nothing to display for this target
      var result = [];
      _.each(categories, _.bind(function (category) {
        if (Equipments.find({
            EquipmentCategories_Id: category._id,
            targetUsage: {$in: [EquipementTargetUsage.BOTH, this.equipementTargetUsage]}
          })
            .fetch().length !== 0) {
          result.push(category);
        }
      }, this));
      return result;
    }
  }

  equipmentWithAQuantity() {
    return _.reject(this.data().equipments, function (equipment) {
      return equipment.quantity === 0
    });
  }

  equipmentIdsWithAQuantity() {
    return _.map(this.equipmentWithAQuantity(), function (equipment) {
      return equipment.equipmentId
    });
  }

  equipments(category) {
    var equipmentCategory = Equipments.find({
      EquipmentCategories_Id: category._id,
      targetUsage: {$in: [EquipementTargetUsage.BOTH, this.equipementTargetUsage]}
    });
    if (this.isEquipmentsReadOnly()) {
      var result;
      var equipmentIdWithQuantity = this.equipmentIdsWithAQuantity();
      result = _.filter(equipmentCategory.fetch(), function (equipment) {
        return _.contains(equipmentIdWithQuantity, equipment._id);
      });
      return result;
    } else {
      return equipmentCategory;
    }
  }

  autoformNameForQuantity() {
    var equipments = this.data().equipments;
    var index = equipments.indexOf(_.findWhere(equipments, {equipmentId: this.currentData()._id}));
    return "equipments." + index + ".quantity";
  }

  autoformNameForEquipmentId() {
    var equipments = this.data().equipments;
    var index = equipments.indexOf(_.findWhere(equipments, {equipmentId: this.currentData()._id}));
    return "equipments." + index + ".equipmentId";
  }
}

EquipmentComponent.register("EquipmentComponent");

