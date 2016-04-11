class UpdateTaskComponent extends BlazeComponent {

    //TODO masquer le add people need form a l'init

    constructor() {
        super();
        this.nameIsEditingReactive = new ReactiveVar(false);
        this.updateTaskContext = Tasks.simpleSchema().namedContext("updateTask");
        this.tempPeopleNeedIdReactive = new ReactiveVar(TempCollection.insert({ //TODO not sure if reactive var is needed
                userId: null,
                teamId: null,
                skills: []
            })
        );

        this.updatedTimeSlotIndex = 1;

        this.updatetimeSlotDatesErrorArray = new ReactiveVar([]);
        this.currentSelectedStartDate = null;
        this.currentSelectedEndDate = null;


    }


    updateTimeSlotStartDate() {
        return _.bind(function (newDate) {
            this.currentSelectedStartDate = newDate;

            if (this.currentSelectedEndDate)
                this.updateTimeSlotDates(this.currentSelectedStartDate, this.currentSelectedEndDate);
            else
                this.updateTimeSlotDates(this.currentSelectedStartDate, null);

        }, this);
    }

    updatetimeSlotDatesError() {
        return this.updatetimeSlotDatesErrorArray.get();
    }

    updateTimeSlotEndDate() {
        return _.bind(function (newDate) {
            this.currentSelectedEndDate = newDate;

            if (this.currentSelectedStartDate)
                this.updateTimeSlotDates(this.currentSelectedStartDate, this.currentSelectedEndDate);
            else
                this.updateTimeSlotDates(null, this.currentSelectedEndDate);
        }, this);
    }

    updateTimeSlotDates(start, end) {
        var $set = {};
        if (start)
            $set["timeSlots." + this.updatedTimeSlotIndex + ".start"] = start.toDate();
        if (end)
            $set["timeSlots." + this.updatedTimeSlotIndex + ".end"] = end.toDate();

        Tasks.update({_id: this.data()._id}, {
            $set: $set
        }, _.bind(function (error, docAffected) {
            if (error) {
                this.updatetimeSlotDatesErrorArray.set([error.message]);
            } else {
                this.updatetimeSlotDatesErrorArray.set([]);
                this.currentSelectedStartDate = null;
                this.currentSelectedEndDate = null;
            }

        }, this));
    }

    onRendered() {
    }

    template() {
        return "updateTaskComponent";
    }

    events() {
        return [
            {
                "input .header-limited-to-text": this.displayDoneButton,
                "click #done-name": this.updateName,
                "click #edit-name": this.focusName,
                "click .add-people-need .add-button": this.addPeopleNeed,
                "click .clear-button": this.clearAddPeopleNeedForm,
                "click .done-button": this.submitPeopleNeed
            }
        ];
    }

    clearAddPeopleNeedForm() {
        TempCollection.update(this.tempPeopleNeedIdReactive.get(), {
            userId: null,
            teamId: null,
            skills: []
        });

        this.displayAddPeopleNeedForm(false);
    }

    displayAddPeopleNeedForm(toDisplay) {
        if (toDisplay)
            this.$("#add-people-need-form").fadeIn(600);
        else
            this.$("#add-people-need-form").fadeOut(600);

    }

    tempPeopleNeedId() {
        return this.tempPeopleNeedIdReactive.get();
    }

    /**
     * prepare form to add a people need, not submit
     */
    addPeopleNeed() {
        this.displayAddPeopleNeedForm(true);
    }

    /**
     * add people need to the task collection object
     */
    submitPeopleNeed() {
        //TODO store in database dans le bon timeslot


    }


    //currentTimeSlotPeopleNeeds(){
    //    return this.data().timeSlots[1].peopleNeeded; //TODO
    //}

    currentTimeSlot() {
        return this.data().timeSlots[this.updatedTimeSlotIndex];
    }

    nameIsEditing() {
        return this.nameIsEditingReactive.get();
    }

    displayDoneButton() {
        this.nameIsEditingReactive.set(true);
    }

    focusName() {
        $("[data-key=name]").focus();
        this.nameIsEditingReactive.set(true);
    }

    updateName(e) {
        this.nameIsEditingReactive.set(false);

        var name = $("[data-key=name]").html();
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

