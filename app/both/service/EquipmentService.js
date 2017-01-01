/** @class EquipmentService */
export class EquipmentService {


    static findByCategory(categoryId){
        return Equipments.find({EquipmentCategories_Id: categoryId})
    }

}