class UpdateTaskComponent extends BlazeComponent {

    constructor() {
        super();
        this.nameIsEditingReactive = new ReactiveVar(false)
    }

    template() {
        return "updateTaskComponent";
    }

    events() {
        return [
            {
                "input .header-limited-to-text": this.displayDoneButton,
                "click #done-name": this.updateName,
                "click #edit-name": this.focusName
            }
        ];
    }

    nameIsEditing() {
        return this.nameIsEditingReactive.get();
    }

    displayDoneButton() {
        this.nameIsEditingReactive.set(true);
    }

    focusName() {
        $("[data-schema-key=name]").focus();
        this.nameIsEditingReactive.set(true);
    }

    updateName(e) {
        this.nameIsEditingReactive.set(false);

        var name = $("[data-schema-key=name]").html();
        if (Tasks.simpleSchema().namedContext("updateTask").validateOne({name: name}, "name")) {
            Tasks.update({_id: this.data()._id}, {
                $set: {
                    name: name
                }
            })
        } else {
            //TODO add error ?
        }
    }

    currentUserTeamId() {
        return Users.findOne({loginUserId: Meteor.userId()}).teams[0]; //TODO which team to choose ?
    }

    onDeleteSuccess() {
        return function () {
            //TODO message de deletion success
            console.log("TODO message de deletion success")
        }
    }

    onDeleteError() {
        return function () {
            //TODO message de deletion success
            console.log("TODO message de deletion error")
        }
    }

    beforeRemove() {
        return function () {
            Router.go("/tasks");
        }
    }

    equipmentsCategories() {
        var categories = EquipmentCategories.find().fetch();
        //remove categories which have nothing to display for this target
        var result = [];
        _.each(categories, function (category) {
            if (Equipments.find({EquipmentCategories_Id: category._id, targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}})
                    .fetch().length !== 0) {
                result.push(category);
            }
        });
        return result;
    }

    equipments(category) {
        return Equipments.find({EquipmentCategories_Id: category._id, targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}});
    }

    //TODO remove SelectedUpdatedOrReadedTask ???
    autoformNameForQuantity() {
        //tout ca parce que Spacebars ne supporte pas @index...
        //var currentEditingTaskId = SelectedUpdatedOrReadedTask.get();
        //var currentTask = Tasks.findOne(currentEditingTaskId);
        var equipments = this.data().equipments;//Tasks.findOne(currentEditingTaskId).equipments;
        var index = equipments.indexOf(_.findWhere(equipments, {equipmentId: this.currentData()._id}))
        return "equipments." + index + ".quantity";
    }

    autoformNameForEquipmentId() {
        //tout ca parce que Spacebars ne supporte pas @index....
        //var currentEditingTaskId = SelectedUpdatedOrReadedTask.get();
        //var currentTask = Tasks.findOne(currentEditingTaskId);
        var equipments = this.data().equipments;//Tasks.findOne(currentEditingTaskId).equipments;
        var index = equipments.indexOf(_.findWhere(equipments, {equipmentId: this.currentData()._id}))
        return "equipments." + index + ".equipmentId";
    }


}

UpdateTaskComponent.register('UpdateTaskComponent');

