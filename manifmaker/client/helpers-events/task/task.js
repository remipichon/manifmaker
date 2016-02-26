Template.updateTaskForm.rendered = function () {
    $('.collapsible').collapsible({});
};


Template.updateTaskForm.helpers({

    displayTextArea: function (validationType, state) {
        if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
            (state === "TOBEVALIDATED" || state === "READY"))
            return false;
        return true;
    },


    equipmentsCategories: function() {
        var categories = EquipmentCategories.find().fetch();
        //remove categories which have nothing to display for this target
        var result = [];
        _.each(categories,function(category){
            if(Equipments.find({EquipmentCategories_Id: category._id, targetUsage : {$in : [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}})
                    .fetch().length !== 0){
                result.push(category);
            }
        });
        return result;
    },
    equipments: function(category){
        return Equipments.find({EquipmentCategories_Id: this._id, targetUsage : {$in : [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}});
    },


    autoformNameForQuantity: function() {
        //tout ca parce que Spacebars ne supporte pas @index...
        var currentEditingTaskId = SelectedUpdatedOrReadedTask.get();
        var currentTask = Tasks.findOne(currentEditingTaskId);
        var equipments = Tasks.findOne(currentEditingTaskId).equipments;
        var index = equipments.indexOf(_.findWhere(equipments,{equipmentId :this._id}))
        return "equipments."+ index +".quantity";
    },
    autoformNameForEquipmentId: function() {
        //tout ca parce que Spacebars ne supporte pas @index....
        var currentEditingTaskId = SelectedUpdatedOrReadedTask.get();
        var currentTask = Tasks.findOne(currentEditingTaskId);
        var equipments = Tasks.findOne(currentEditingTaskId).equipments;
        var index = equipments.indexOf(_.findWhere(equipments,{equipmentId :this._id}))
        return "equipments."+ index +".equipmentId";
    },
});