Template.updateTaskForm.rendered = function () {
    $('.collapsible').collapsible({});
};


Template.updateTaskForm.helpers({

    currentUserTeamId: function() {
        return Users.findOne({loginUserId: Meteor.userId()}).teams[0]; //TODO which team to choose ?
    },

    onDeleteSuccess: function(){
       return function () {
           //TODO message de deletion success
        }
    },

    beforeRemove: function(){
        return function () {
            Router.go("/tasks");
        }
    },

    ////old design

    displayTextArea: function (validationType, state) {
        if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
            (state === "TOBEVALIDATED" || state === "READY"))
            return false;
        return true;
    },


    isEquipmentReadOnly: function(){
        if(Roles.userIsInRole(Meteor.userId(),RolesEnum.EQUIPMENTVALIDATION))
            return false;
        if(this.equipmentValidation !== ValidationState.OPEN && (this.equipmentValidation !== ValidationState.REFUSED))
            return true;
        return false;
    },


    isAssignmentReadOnly: function(){
        //tout ca parce que Spacebars ne supporte pas @index...
        var currentEditingTaskId = SelectedUpdatedOrReadedTask.get();
        var currentTask = Tasks.findOne(currentEditingTaskId);
        if(Roles.userIsInRole(Meteor.userId(),RolesEnum.ASSIGNMENTVALIDATION))
            return false;
        if(currentTask.timeSlotValidation !== ValidationState.OPEN && (currentTask.timeSlotValidation !== ValidationState.REFUSED))
            return true;
        return false;
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

