class TaskTimeSlotsComponent extends BlazeComponent{

    reactiveConstructor() {
        this.createTimeSlotDefaultStartDate.set(AssignmentCalendarDisplayedDays.find().fetch()[0].date);
        this.createTimeSlotDefaultEndDate.set(AssignmentCalendarDisplayedDays.find().fetch()[0].date);
    }

    constructor() {
        super();
        this.updateTaskContext = Tasks.simpleSchema().namedContext("updateTask");


        //TIMESLOTS SECTION
        this.tempPeopleNeedIdReactive = new ReactiveVar(TempCollection.insert({ //TODO not sure if reactive var is needed
                userId: null,
                teamId: null,
                skills: []
            })
        );
        this.updatedTimeSlotId = new ReactiveVar(null);
        this.updatetimeSlotDatesErrorArray = new ReactiveVar([]);
        this.currentSelectedStartDate = null;
        this.currentSelectedEndDate = null;
        this.bulkIds = {};
        this.updatePeopleNeededErrorArray = new ReactiveVar([]);
        this.isTimeSlotCreated = new ReactiveVar(false);
        this.isTimeSlotUpdated = new ReactiveVar(false);
        this.newTimeSlotSubmitedOnce = false;
        this.createTimeSlotDefaultStartDate = new ReactiveVar(null);
        this.createTimeSlotDefaultEndDate = new ReactiveVar(null);
        this.isTimeSlotDuplicated = false;


        ////ADD PEOPLENEED SECTION
        this.displayAddPeopleNeedFormReactiveVar = new ReactiveVar(false);
        this.createPeopleNeededErrorArray = new ReactiveVar([]);

    }

    template(){
        return "taskTimeSlots"
    }

    events() {
        return [
            {
                //"input .header-limited-to-text": this.displayDoneButton,//TODO more precise selector
                //"click #done-name": this.updateName,//TODO more precise selector
                //"click #edit-name": this.focusName,//TODO more precise selector
                "click .people-need .delete": this.deletePeopleNeeded, //TODO more precise selector
                "click .people-need .duplicate": this.duplicatePeopleNeeded, //TODO more precise selector

                "click .add-time-slot .add-button": this.addTimeSlot,
                "click .add-time-slot .clear-button": this.clearTimeSlot,
                "click .add-time-slot .done-button": this.submitNewTimeSlot,
                "click .add-time-slot .delete-button": this.deleteTimeSlot,
                "click .add-time-slot .duplicate-button": this.duplicateTimeSlot,

                //ADD PEOPLENEED SECTION
                "click .add-people-need .add-button": this.addPeopleNeed,
                "click .add-people-need .done-button": this.submitPeopleNeed,
                "click .add-people-need .clear-button": this.clearAddPeopleNeedForm,
            }
        ];
    }

    taskData(){
        return this.data().parentInstance.data()
    }


    self() {
        return this;
    }


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    ADD TIMESLOTS SECTION
    ////////////////////////////////////////////////////////////////////////

    addTimeSlot() {
        this.isTimeSlotCreated.set(true);
        this.isTimeSlotUpdated.set(false);
    }

    clearTimeSlot() {
        this.isTimeSlotCreated.set(false);
        this.isTimeSlotUpdated.set(false);
        this.resetTimeSlotForm();
    }

    submitNewTimeSlot() {
        this.addTimeSlotToTask(this.currentSelectedStartDate, this.currentSelectedEndDate);
    }

    addTimeSlotToTask(start, end) {
        var peopleNeeded = [];
        if (this.isTimeSlotDuplicated) {
            peopleNeeded = this.currentTimeSlot().peopleNeeded
        }

        var data = {
            start: start ? start.toDate() : null,
            end: end ? end.toDate() : null,
            peopleNeeded: peopleNeeded
        };
        Tasks.update({_id: this.taskData()._id}, {
            $push: {
                "timeSlots": data
            }
        }, _.bind(function (error, docAffected) {
            if (error) {
                this.updatetimeSlotDatesErrorArray.set([error.message]);
            } else {
                this.resetTimeSlotForm();

                //select newly created timeslot to update
                this.isTimeSlotCreated.set(false);
                this.isTimeSlotUpdated.set(true);
                this.updatedTimeSlotId.set(this.taskData().timeSlots[this.taskData().timeSlots.length - 1]._id);


            }

        }, this));
    }

    resetTimeSlotForm() {
        this.updatetimeSlotDatesErrorArray.set([]);
        this.currentSelectedStartDate = null;
        this.currentSelectedEndDate = null;
        this.isTimeSlotDuplicated = false;
        this.createTimeSlotDefaultStartDate.set(AssignmentCalendarDisplayedDays.find().fetch()[0].date);
        this.createTimeSlotDefaultEndDate.set(AssignmentCalendarDisplayedDays.find().fetch()[0].date);
    }


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    UPDATE TIMESLOTS SECTION
    ////////////////////////////////////////////////////////////////////////

    isTimeSlotsUpdateAllowed() {
        return ValidationService.isUpdateAllowed(this.taskData().timeSlotValidation.currentState);
    }

    isTimeSlotsReadOnly() {
        return !this.isTimeSlotsUpdateAllowed();
    }

    deleteTimeSlot() {
        if (!ValidationService.isUpdateAllowed(this.taskData().timeSlotValidation.currentState)) {
            console.log("can't update timeslot as validation state doesn't allow it");
            //TODO ca devrait etre fait par le schema mais j'ai pas trouvé comment faire prendre en compte le $pull dans le custom
            //meme probleme pour delete people need mais actuellement le delete passe par un update uggly de tous les timeslot donc l'erreur est quand meme jetée par schema
            return;
        }
        Tasks.update(this.taskData()._id, {
            $pull: {
                timeSlots: {_id: this.updatedTimeSlotId.get()}
            }
        }, _.bind(function (error, docAffected) {
            if (error) {
                console.error(error.message);
            } else {
                this.isTimeSlotCreated.set(false);
                this.isTimeSlotUpdated.set(false);
            }
        }, this));
    }

    duplicateTimeSlot() {
        this.addTimeSlot();
        var end = new moment(this.currentTimeSlot().end);
        var start = this.currentTimeSlot().start;
        this.createTimeSlotDefaultStartDate.set(end);
        var newEnd = new moment(end);
        this.createTimeSlotDefaultEndDate.set(newEnd.add(end.diff(start), "ms"));
        this.currentSelectedStartDate = end;
        this.currentSelectedEndDate = newEnd;
        this.isTimeSlotDuplicated = true;

    }


    getUpdateTimeSlotIndex() {
        var timeSlotId = this.updatedTimeSlotId.get();
        return TimeSlotService.getTimeSlotIndex(this.taskData(), timeSlotId);
    }

    deletePeopleNeeded(e) {
        var peopleNeededId = $(e.target).data("peopleneededid");
        PeopleNeedService.removePeopleNeed(this.taskData(), this.taskData().timeSlots[this.getUpdateTimeSlotIndex()], {_id: peopleNeededId});
    }

    duplicatePeopleNeeded(e) {
        var peopleNeededId = $(e.target).data("peopleneededid");
        var peopleNeed = PeopleNeedService.getPeopleNeedByIndex(this.taskData().timeSlots[this.getUpdateTimeSlotIndex()], peopleNeededId);

        this.submitPeopleNeedWithData({
            userId: peopleNeed.userId,
            teamId: peopleNeed.teamId,
            skills: peopleNeed.skills
        })

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

        if (this.isTimeSlotUpdated.get()) {
            var $set = {};
            if (start)
                $set["timeSlots." + this.getUpdateTimeSlotIndex() + ".start"] = start.toDate();
            if (end)
                $set["timeSlots." + this.getUpdateTimeSlotIndex() + ".end"] = end.toDate();

            Tasks.update({_id: this.taskData()._id}, {
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
        } else if (this.isTimeSlotCreated.get()) {
            if (this.newTimeSlotSubmitedOnce) //display error only after hitting submit button once
                this.addTimeSlotToTask(start, end)
        }
    }

    currentTimeSlot() {
        return this.taskData().timeSlots[this.getUpdateTimeSlotIndex()];
        //return this.currentData().timeSlots[this.getUpdateTimeSlotIndex()];
    }

    currentTimeSlotPeopleNeededMerged() {
        if (!this.currentTimeSlot()) return [];
        return this.getPeopleNeededMerged(this.currentTimeSlot()._id);
    }

    getPeopleNeededMerged(timeSlotId) {
        var peopleNeeded = _.findWhere(this.taskData().timeSlots, {
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

        //return this.data().parentInstance.getPeopleNeededMerged(timeSlotId);

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

    updatePeopleNeedCallback() {
        return _.bind(function (error, docAffected) {
            if (error) {
                this.updatePeopleNeededErrorArray.set([error.message]);
            } else {
                this.updatePeopleNeededErrorArray.set([]);
            }
        }, this);
    }

    updatePeopleNeededError() {
        return this.updatePeopleNeededErrorArray.get();
    }


    ////////////////////////////////////////////////////////////////////////
    ////////////////////    ADD PEOPLENEED SECTION
    ////////////////////////////////////////////////////////////////////////

    displayAddPeopleNeedForm() {
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


    submitPeopleNeed(event) {
        var data = TempCollection.findOne(this.tempPeopleNeedIdReactive.get());
        data = {
            userId: data.userId,
            teamId: data.teamId,
            skills: data.skills
        };
        this.submitPeopleNeedWithData(data);
    }

    /**
     * add people need to the task collection object
     */
    submitPeopleNeedWithData(data) {

        Tasks.update({_id: this.taskData()._id}, {
            $push: {
                ["timeSlots." + this.getUpdateTimeSlotIndex() + ".peopleNeeded"]: data //TODO should not be reactive when updatedTimeSlotIndex change
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

}

TaskTimeSlotsComponent.register("TaskTimeSlotsComponent");
