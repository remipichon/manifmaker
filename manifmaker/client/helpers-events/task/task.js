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

    autoformNameForQuantity: function() {
        //tout ca parce que Spacebars ne supporte pas @index....
        var currentTask = Tasks.findOne(currentEditingTaskId);
        var equipments = Tasks.findOne(currentEditingTaskId).equipments;
        var index = equipments.indexOf(_.findWhere(equipments,{equipmentId :this.equipmentId}))
        return "equipments."+ index +".quantity";
    },
    autoformNameForEquipmentId: function() {
        //tout ca parce que Spacebars ne supporte pas @index....
        var currentTask = Tasks.findOne(currentEditingTaskId);
        var equipments = Tasks.findOne(currentEditingTaskId).equipments;
        var index = equipments.indexOf(_.findWhere(equipments,{equipmentId :this.equipmentId}))
        return "equipments."+ index +".equipmentId";
    },

    equipmentName: function(){
        return Equipments.findOne(this.equipmentId).name;
    }


});