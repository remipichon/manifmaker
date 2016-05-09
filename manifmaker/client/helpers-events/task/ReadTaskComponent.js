class ReadTaskComponent extends BlazeComponent {

    reactiveConstructor() {
        //this.createTimeSlotDefaultStartDate.set(AssignmentCalendarDisplayedDays.find().fetch()[0].date);
        //this.createTimeSlotDefaultEndDate.set(AssignmentCalendarDisplayedDays.find().fetch()[0].date);
    }

    constructor() {
        super();
        //this.nameIsEditingReactive = new ReactiveVar(false);
        //this.updateTaskContext = Tasks.simpleSchema().namedContext("updateTask");


        //TIMESLOTS SECTION
        //this.tempPeopleNeedIdReactive = new ReactiveVar(TempCollection.insert({ //TODO not sure if reactive var is needed
        //        userId: null,
        //        teamId: null,
        //        skills: []
        //    })
        //);
        this.updatedTimeSlotId = new ReactiveVar(null);
        //this.updatetimeSlotDatesErrorArray = new ReactiveVar([]);
        //this.currentSelectedStartDate = null;
        //this.currentSelectedEndDate = null;
        this.bulkIds = {};
        //this.updatePeopleNeededErrorArray = new ReactiveVar([]);
        //this.isTimeSlotCreated = new ReactiveVar(false);
        this.isTimeSlotUpdated = new ReactiveVar(false);
        //this.newTimeSlotSubmitedOnce = false;
        //this.createTimeSlotDefaultStartDate = new ReactiveVar(null);
        //this.createTimeSlotDefaultEndDate = new ReactiveVar(null);
        //this.isTimeSlotDuplicated = false;


        ////ADD PEOPLENEED SECTION
        //this.displayAddPeopleNeedFormReactiveVar = new ReactiveVar(false);
        //this.createPeopleNeededErrorArray = new ReactiveVar([]);

    }

    self() {
        return this;
    }

    onRendered() {
        this.$('.collapse').collapse({toggle: false});

        this.$('.collapse').on('shown.bs.collapse	', _.bind(function () {
            var glyphicon = this.$("[data-target=#" + $(arguments[0].target).attr("id") + "] span.glyphicon");
            glyphicon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        }, this));

        this.$('.collapse').on('hidden.bs.collapse', _.bind(function () {
            var glyphicon = this.$("[data-target=#" + $(arguments[0].target).attr("id") + "] span.glyphicon");
            glyphicon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        }, this));

    }

    template() {
        return "readTaskComponent";
    }

    events() {
        return [
            {
                //"input .header-limited-to-text": this.displayDoneButton,//TODO more precise selector
                //"click #done-name": this.updateName,//TODO more precise selector
                //"click #edit-name": this.focusName,//TODO more precise selector
                //"click .people-need .delete": this.deletePeopleNeeded, //TODO more precise selector
                //"click .people-need .duplicate": this.duplicatePeopleNeeded, //TODO more precise selector

                //"click #timeslots .add-time-slot .add-button": this.addTimeSlot,
                //"click #timeslots .add-time-slot .clear-button": this.clearTimeSlot,
                //"click #timeslots .add-time-slot .done-button": this.submitNewTimeSlot,
                //"click #timeslots .add-time-slot .delete-button": this.deleteTimeSlot,
                //"click #timeslots .add-time-slot .duplicate-button": this.duplicateTimeSlot,
                //
                //ADD PEOPLENEED SECTION
                //"click .add-people-need .add-button": this.addPeopleNeed,
                //"click .add-people-need .done-button": this.submitPeopleNeed,
                //"click .add-people-need .clear-button": this.clearAddPeopleNeedForm,
            }
        ];
    }

    isGeneralInformationReadOnly(){
        return true;
    }


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    ADD TIMESLOTS SECTION
    ////////////////////////////////////////////////////////////////////////

    //addTimeSlot() {
    //    this.isTimeSlotCreated.set(true);
    //    this.isTimeSlotUpdated.set(false);
    //}
    //
    //clearTimeSlot() {
    //    this.isTimeSlotCreated.set(false);
    //    this.isTimeSlotUpdated.set(false);
    //    this.resetTimeSlotForm();
    //}
    //
    //submitNewTimeSlot() {
    //    this.addTimeSlotToTask(this.currentSelectedStartDate, this.currentSelectedEndDate);
    //}
    //
    //addTimeSlotToTask(start, end) {
    //    var peopleNeeded = [];
    //    if (this.isTimeSlotDuplicated) {
    //        peopleNeeded = this.currentTimeSlot().peopleNeeded
    //    }
    //
    //    var data = {
    //        start: start ? start.toDate() : null,
    //        end: end ? end.toDate() : null,
    //        peopleNeeded: peopleNeeded
    //    };
    //    Tasks.update({_id: this.data()._id}, {
    //        $push: {
    //            "timeSlots": data
    //        }
    //    }, _.bind(function (error, docAffected) {
    //        if (error) {
    //            this.updatetimeSlotDatesErrorArray.set([error.message]);
    //        } else {
    //            this.resetTimeSlotForm();
    //
    //            //select newly created timeslot to update
    //            this.isTimeSlotCreated.set(false);
    //            this.isTimeSlotUpdated.set(true);
    //            this.updatedTimeSlotId.set(this.data().timeSlots[this.data().timeSlots.length - 1]._id);
    //
    //
    //        }
    //
    //    }, this));
    //}
    //
    //resetTimeSlotForm() {
    //    this.updatetimeSlotDatesErrorArray.set([]);
    //    this.currentSelectedStartDate = null;
    //    this.currentSelectedEndDate = null;
    //    this.isTimeSlotDuplicated = false;
    //    this.createTimeSlotDefaultStartDate.set(AssignmentCalendarDisplayedDays.find().fetch()[0].date);
    //    this.createTimeSlotDefaultEndDate.set(AssignmentCalendarDisplayedDays.find().fetch()[0].date);
    //}


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    UPDATE TIMESLOTS SECTION
    ////////////////////////////////////////////////////////////////////////

    isTimeSlotsUpdateAllowed() {
        return false;//ValidationService.isUpdateAllowed(this.data().timeSlotValidation.currentState);
    }

    isTimeSlotsReadOnly() {
        return !this.isTimeSlotsUpdateAllowed();
    }

    //deleteTimeSlot() {
    //    if (!ValidationService.isUpdateAllowed(this.currentData().timeSlotValidation.currentState)) {
    //        console.log("can't update timeslot as validation state doesn't allow it");
    //        //TODO ca devrait etre fait par le schema mais j'ai pas trouvé comment faire prendre en compte le $pull dans le custom
    //        //meme probleme pour delete people need mais actuellement le delete passe par un update uggly de tous les timeslot donc l'erreur est quand meme jetée par schema
    //        return;
    //    }
    //    Tasks.update(this.currentData()._id, {
    //        $pull: {
    //            timeSlots: {_id: this.updatedTimeSlotId.get()}
    //        }
    //    }, _.bind(function (error, docAffected) {
    //        if (error) {
    //            console.error(error.message);
    //        } else {
    //            this.isTimeSlotCreated.set(false);
    //            this.isTimeSlotUpdated.set(false);
    //        }
    //    }, this));
    //}
    //
    //duplicateTimeSlot() {
    //    this.addTimeSlot();
    //    var end = new moment(this.currentTimeSlot().end);
    //    var start = this.currentTimeSlot().start;
    //    this.createTimeSlotDefaultStartDate.set(end);
    //    var newEnd = new moment(end);
    //    this.createTimeSlotDefaultEndDate.set(newEnd.add(end.diff(start), "ms"));
    //    this.currentSelectedStartDate = end;
    //    this.currentSelectedEndDate = newEnd;
    //    this.isTimeSlotDuplicated = true;
    //
    //}
    //

    getUpdateTimeSlotIndex() {
        var timeSlotId = this.updatedTimeSlotId.get();
        return TimeSlotService.getTimeSlotIndex(this.data(), timeSlotId);
    }

    //deletePeopleNeeded(e) {
    //    var peopleNeededId = $(e.target).data("peopleneededid");
    //    PeopleNeedService.removePeopleNeed(this.data(), this.data().timeSlots[this.getUpdateTimeSlotIndex()], {_id: peopleNeededId});
    //}
    //
    //duplicatePeopleNeeded(e) {
    //    var peopleNeededId = $(e.target).data("peopleneededid");
    //    var peopleNeed = PeopleNeedService.getPeopleNeedByIndex(this.data().timeSlots[this.getUpdateTimeSlotIndex()], peopleNeededId);
    //
    //    this.submitPeopleNeedWithData({
    //        userId: peopleNeed.userId,
    //        teamId: peopleNeed.teamId,
    //        skills: peopleNeed.skills
    //    })
    //
    //}
    //
    //updateTimeSlotStartDate() {
    //    return _.bind(function (newDate) {
    //        this.currentSelectedStartDate = newDate;
    //
    //        if (this.currentSelectedEndDate)
    //            this.updateTimeSlotDates(this.currentSelectedStartDate, this.currentSelectedEndDate);
    //        else
    //            this.updateTimeSlotDates(this.currentSelectedStartDate, null);
    //
    //    }, this);
    //}

    //updatetimeSlotDatesError() {
    //    return this.updatetimeSlotDatesErrorArray.get();
    //}
    //
    //updateTimeSlotEndDate() {
    //    return _.bind(function (newDate) {
    //        this.currentSelectedEndDate = newDate;
    //
    //        if (this.currentSelectedStartDate)
    //            this.updateTimeSlotDates(this.currentSelectedStartDate, this.currentSelectedEndDate);
    //        else
    //            this.updateTimeSlotDates(null, this.currentSelectedEndDate);
    //    }, this);
    //}

    //updateTimeSlotDates(start, end) {
    //
    //    if (this.isTimeSlotUpdated.get()) {
    //        var $set = {};
    //        if (start)
    //            $set["timeSlots." + this.getUpdateTimeSlotIndex() + ".start"] = start.toDate();
    //        if (end)
    //            $set["timeSlots." + this.getUpdateTimeSlotIndex() + ".end"] = end.toDate();
    //
    //        Tasks.update({_id: this.data()._id}, {
    //            $set: $set
    //        }, _.bind(function (error, docAffected) {
    //            if (error) {
    //                this.updatetimeSlotDatesErrorArray.set([error.message]);
    //            } else {
    //                this.updatetimeSlotDatesErrorArray.set([]);
    //                this.currentSelectedStartDate = null;
    //                this.currentSelectedEndDate = null;
    //            }
    //
    //        }, this));
    //    } else if (this.isTimeSlotCreated.get()) {
    //        if (this.newTimeSlotSubmitedOnce) //display error only after hitting submit button once
    //            this.addTimeSlotToTask(start, end)
    //    }
    //}

    currentTimeSlot() {
        return this.data().timeSlots[this.getUpdateTimeSlotIndex()];
    }

    currentTimeSlotPeopleNeededMerged() {
        if (!this.currentTimeSlot()) return [];
        return this.getPeopleNeededMerged(this.currentTimeSlot()._id);
    }

    getPeopleNeededMerged(timeSlotId) {
        var peopleNeeded = _.findWhere(this.data().timeSlots, {
            _id: timeSlotId
        }).peopleNeeded;

        //group by identical people need
        var peopleNeededGroupBy = _.groupBy(peopleNeeded, function (peopleNeed) {
            return peopleNeed.userId + peopleNeed.skills + peopleNeed.teamId
        });

        var bulkIds = {};

        //take only the first one, doesn't really matter as their are identical
        var peopleNeededMerged = _.map(peopleNeededGroupBy, function (groupBy) {
            //use first one as a key for the bulk ids
            bulkIds[groupBy[0]._id] = _.map(groupBy, function (peopleNeed) {
                return peopleNeed._id
            });
            return _.extend(groupBy[0], {count: groupBy.length});
        });

        this.bulkIds = bulkIds;

        return peopleNeededMerged;

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

    bulkPeopleNeededIds() {
        var result = [
            {
                path: "timeSlots",
                _id: this.currentTimeSlot()._id
            },
            {
                path: "peopleNeeded",
                _ids: this.bulkIds[this.currentData()._id]
            }
        ];


        return result;
    }

    //updatePeopleNeedCallback() {
    //    return _.bind(function (error, docAffected) {
    //        if (error) {
    //            this.updatePeopleNeededErrorArray.set([error.message]);
    //        } else {
    //            this.updatePeopleNeededErrorArray.set([]);
    //        }
    //    }, this);
    //}
    //
    //updatePeopleNeededError() {
    //    return this.updatePeopleNeededErrorArray.get();
    //}


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    ADD PEOPLENEED SECTION
    ////////////////////////////////////////////////////////////////////////

    //displayAddPeopleNeedForm() {
    //    return this.displayAddPeopleNeedFormReactiveVar.get();
    //}
    //
    //clearAddPeopleNeedForm() {
    //    TempCollection.update(this.tempPeopleNeedIdReactive.get(), {
    //        userId: null,
    //        teamId: null,
    //        skills: []
    //    });
    //
    //    this.displayAddPeopleNeedFormReactiveVar.set(false);
    //}
    //
    //tempPeopleNeedId() {
    //    return this.tempPeopleNeedIdReactive.get();
    //}

    /**
     * prepare form to add a people need, not submit
     */
    ////addPeopleNeed() {
    ////    this.displayAddPeopleNeedFormReactiveVar.set(true);
    ////}
    //
    //
    //submitPeopleNeed(event) {
    //    var data = TempCollection.findOne(this.tempPeopleNeedIdReactive.get());
    //    data = {
    //        userId: data.userId,
    //        teamId: data.teamId,
    //        skills: data.skills
    //    };
    //    this.submitPeopleNeedWithData(data);
    //}

    /**
     * add people need to the task collection object
     */
    //submitPeopleNeedWithData(data) {
    //
    //    Tasks.update({_id: this.data()._id}, {
    //        $push: {
    //            ["timeSlots." + this.getUpdateTimeSlotIndex() + ".peopleNeeded"]: data //TODO should not be reactive when updatedTimeSlotIndex change
    //        }
    //    }, _.bind(function (error, docAffected) {
    //        if (error) {
    //            this.createPeopleNeededErrorArray.set([error.message]);
    //        } else {
    //            this.createPeopleNeededErrorArray.set([]);
    //            this.clearAddPeopleNeedForm();
    //        }
    //
    //    }, this));
    //
    //}
    //
    //createPeopleNeededError() {
    //    return this.createPeopleNeededErrorArray.get();
    //}


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    GENERAL INFORMATION SECTION
    ////////////////////////////////////////////////////////////////////////

    //nameIsEditing() {
    //    return this.nameIsEditingReactive.get();
    //}
    //
    //displayDoneButton() {
    //    this.nameIsEditingReactive.set(true);
    //}
    //
    //focusName() {
    //    $("[data-key=name]").focus();
    //    this.nameIsEditingReactive.set(true);
    //}
    //
    //updateName(e) {
    //    this.nameIsEditingReactive.set(false);
    //
    //    var name = $("[data-key=name]").html();
    //    if (Tasks.simpleSchema().namedContext("updateTask").validateOne({name: name}, "name")) {
    //        Tasks.update({_id: this.data()._id}, {
    //            $set: {
    //                name: name
    //            }
    //        })
    //    } else {
    //        //TODO add error ?
    //    }
    //}

    ////////////////////////////////////////////////////////////////////////
    ////////////////////    OVERALL TASK SECTION
    ////////////////////////////////////////////////////////////////////////

    //onDeleteSuccess() {
    //    return function () {
    //        //TODO message de deletion success
    //        console.log("TODO message de deletion success")
    //    }
    //}
    //
    //onDeleteError() {
    //    return function () {
    //        //TODO message de deletion success
    //        console.log("TODO message de deletion error")
    //    }
    //}
    //
    //beforeRemove() {
    //    return function () {
    //        //TODO add a better dialog box to confirm deletion
    //        if(window.confirm("About to delete the task")){
    //            Router.go("/tasks");
    //            this.remove();
    //        }
    //    }
    //}

    ////////////////////////////////////////////////////////////////////////
    ////////////////////    EQUIPMENT SECTION
    ////////////////////////////////////////////////////////////////////////

    isEquipmentsUpdateAllowed() {
        return false;//ValidationService.isUpdateAllowed(this.data().equipmentValidation.currentState);
    }

    isEquipmentsReadOnly() {
        return !this.isEquipmentsUpdateAllowed();
    }

    equipmentsCategories() {
        var categories = EquipmentCategories.find().fetch();

        if(this.isEquipmentsReadOnly()){
            //remove categories which have nothing to display for this target + that don't have any quantity
            var equipmentIdsWithAQuantity = this.equipmentIdsWithAQuantity();

            var result = [];
            _.each(categories, function (category) {
                var equipmentsForACategory = Equipments.find({EquipmentCategories_Id: category._id, targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}})
                    .fetch();

                equipmentsForACategory = _.filter(equipmentsForACategory,function(equipment){
                    return _.contains(equipmentIdsWithAQuantity,equipment._id)
                });

                if (equipmentsForACategory.length !== 0) {
                    result.push(category);
                }
            });
            return result;
        } else {
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
        var equipmentCategory = Equipments.find({EquipmentCategories_Id: category._id, targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}});
        if(this.isEquipmentsReadOnly()){
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


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    VALIDATION SECTION
    ////////////////////////////////////////////////////////////////////////


    //displayTextArea(validationType, state) {
    //    if (!Roles.userIsInRole(Meteor.userId(), RolesEnum[validationType]) &&
    //        (state === "TOBEVALIDATED" || state === "READY"))
    //        return false;
    //    return true;
    //    return false;
    //}


}

ReadTaskComponent.register('ReadTaskComponent');

