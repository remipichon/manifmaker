class UpdateTaskComponent extends BlazeComponent {

    //TODO masquer le add people need form a l'init

    constructor() {
        super();
        this.nameIsEditingReactive = new ReactiveVar(false);
        this.updateTaskContext = Tasks.simpleSchema().namedContext("updateTask");


        //TIMESLOTS SECTION
        this.tempPeopleNeedIdReactive = new ReactiveVar(TempCollection.insert({ //TODO not sure if reactive var is needed
                userId: null,
                teamId: null,
                skills: []
            })
        );
        this.updatedTimeSlotIndex = new ReactiveVar(1); //TODO cf workflow creation/update timeslot
        this.updatetimeSlotDatesErrorArray = new ReactiveVar([]);
        this.currentSelectedStartDate = null;
        this.currentSelectedEndDate = null;

        ////ADD PEOPLENEED SECTION
        this.displayAddPeopleNeedFormReactiveVar = new ReactiveVar(false);
        this.createPeopleNeededErrorArray = new ReactiveVar([]);

    }

    onRendered() {
    }

    template() {
        return "updateTaskComponent";
    }

    events() {
        return [
            {
                "input .header-limited-to-text": this.displayDoneButton,//TODO more precise selector
                "click #done-name": this.updateName,//TODO more precise selector
                "click #edit-name": this.focusName,//TODO more precise selector
                "click .people-need .delete": this.deletePeopleNeeded, //TODO more precise selector
                "click .people-need .duplicate": this.duplicatePeopleNeeded, //TODO more precise selector

                //ADD PEOPLENEED SECTION
                "click .add-people-need .add-button": this.addPeopleNeed,
                "click .add-people-need .done-button": this.submitPeopleNeed,
                "click .add-people-need .clear-button": this.clearAddPeopleNeedForm,
            }
        ];
    }

    ////////////////////////////////////////////////////////////////////////
    ////////////////////    UPDATE TIMESLOTS SECTION
    ////////////////////////////////////////////////////////////////////////

    deletePeopleNeeded(e) {
        var peopleNeededId = $(e.target).data("peopleneededid");
        PeopleNeedService.removePeopleNeed(this.data(), this.data().timeSlots[this.updatedTimeSlotIndex.get()], {_id: peopleNeededId});
    }

    duplicatePeopleNeeded(e) {
        var peopleNeededId = $(e.target).data("peopleneededid");
        console.log("TODO duplicatePeopleNeeded");//TODO

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
            $set["timeSlots." + this.updatedTimeSlotIndex.get() + ".start"] = start.toDate();
        if (end)
            $set["timeSlots." + this.updatedTimeSlotIndex.get() + ".end"] = end.toDate();

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

    currentTimeSlot() {
        return this.data().timeSlots[this.updatedTimeSlotIndex.get()];
    }

    pathWithArrayPeopleNeeded() {
        return [
            {
                path: "timeSlots",
                _id: this.currentTimeSlot()._id
            },
            {
                path: "peopleNeeded",
                _id: this.currentData()._id
            }
        ]

    }

    bulkPeopleNeededIds(){
        var result =  [
            {
                path: "timeSlots",
                _id: this.currentTimeSlot()._id
            },
            {
                path: "peopleNeeded",
                _ids: [this.currentData()._id]
            }
        ];


        return result;
    }


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    ADD PEOPLENEED SECTION
    ////////////////////////////////////////////////////////////////////////

    displayAddPeopleNeedForm(){
        return this.displayAddPeopleNeedFormReactiveVar.get();
    }

    clearAddPeopleNeedForm() {
        TempCollection.update(this.tempPeopleNeedIdReactive.get(), {
            userId: null,
            teamId: null,
            skills: []
        });

        this.displayAddPeopleNeedFormReactiveVar.set(false);
    }

    tempPeopleNeedId() {
        return this.tempPeopleNeedIdReactive.get();
    }

    /**
     * prepare form to add a people need, not submit
     */
    addPeopleNeed() {
        this.displayAddPeopleNeedFormReactiveVar.set(true);
    }

    /**
     * add people need to the task collection object
     */
    submitPeopleNeed() {
        var data = TempCollection.findOne(this.tempPeopleNeedIdReactive.get());
        var data = {
            userId: data.userId,
            teamId: data.teamId,
            skills: data.skills
        };

        Tasks.update({_id: this.data()._id}, {
            $push: {
                ["timeSlots."+this.updatedTimeSlotIndex.get()+".peopleNeeded"] : data //TODO should not be reactive when updatedTimeSlotIndex change
            }
        }, _.bind(function (error, docAffected) {
            if (error) {
                this.createPeopleNeededErrorArray.set([error.message]);
            } else {
                this.createPeopleNeededErrorArray.set([]);
                this.clearAddPeopleNeedForm();
            }

        }, this));

    }

    createPeopleNeededError() {
        return this.createPeopleNeededErrorArray.get();
    }


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    GENERAL INFORMATION SECTION
    ////////////////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////////////////
    ////////////////////    OVERALL TASK SECTION
    ////////////////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////////////////
    ////////////////////    EQUIPMENT SECTION
    ////////////////////////////////////////////////////////////////////////

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

UpdateTaskComponent.register('UpdateTaskComponent');

