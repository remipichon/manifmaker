class CreateTaskComponent extends BlazeComponent {

    constructor() {
        super();
        this.tempItemId = TempCollection.insert({
            name: null,
            teamId: null,
            placeId: null,
            liveEventMasterId: null,
            masterId: null
        });
        this.insertTaskContext = Tasks.simpleSchema().namedContext("insertTask");
        this.errorsArray = new ReactiveVar([]);
        this.errorsArray2 = [];

    }


    rendered() {

    }

    template() {
        return "createTaskComponent";
    }

    events() {
        return [
            {
                "click [type=submit]": this.submitForm,
                "change [data-schema-key=name]": this.updateName,
                "change [data-schema-key=description]": this.updateDescription
            }]
    }

    updateDescription(){
        TempCollection.update({_id: this.tempItemId},
            {
                $set: {
                    name: $("[data-schema-key=description]").val()
                }
            }
        );
    }
    updateName(){
        TempCollection.update({_id: this.tempItemId},
            {
                $set: {
                    name: $("[data-schema-key=name]").val()
                }
            }
        );
    }

    submitForm(){
        this.hasBeenSubmitted = true;
        var newVar = this.errorsArray.get();
        this.errorsArray.set([]);
        this.errorsArray.set(newVar)

        if(this.isFormValid) {
            var temp = TempCollection.findOne({_id: this.tempItemId});
            var _id = Tasks.insert(temp);
            Router.go("/task/" + _id);
        }

        //if(this.validateForm()){
        //
        //} else {
          //  TODO il faut balancer les errors !!!
        //}
    }


    validateForm() {
        console.log("validateForm");
        //validating
        var temp = TempCollection.findOne({_id: this.tempItemId});
        delete temp._id; //cleaning

        var isValid = Tasks.simpleSchema().namedContext("insertTask").validate(temp, {modifier: false});
        if (!isValid) {
            var ik = this.insertTaskContext.invalidKeys(); //it's reactive ! whouhou
            ik = _.map(ik, _.bind(function (o) {
                return _.extend({message: this.insertTaskContext.keyErrorMessage(o.name)}, o);
            },this));

            _.each(ik,function(key){
                console.error(key.message);
            });

            this.errorsArray.set(ik);
            //this.errorsArray2 = ik ;
            this.isFormValid = false;
            return ik;
        } else {
            this.errorsArray.set([]);
            //this.errorsArray2 = [] ;
            this.isFormValid = true;
            return [];
        }


    }

    errors(){

        //this one is reactive
        //var temp = TempCollection.findOne({_id: this.tempItemId});

        console.log("errors");
        //var err = this.errorsArray.get();
        var err = this.errorsArray.get();//this.validateForm();


        if(this.hasBeenSubmitted) { //active reactivity
            //= this.errorsArray2;
            return err;
        }
        return [];
    }


}

CreateTaskComponent.register('CreateTaskComponent');






















Template.updateTaskForm.rendered = function () {
    $('.collapsible').collapsible({});
};


Template.updateTaskForm.helpers({

    currentUserTeamId: function () {
        return Users.findOne({loginUserId: Meteor.userId()}).teams[0]; //TODO which team to choose ?
    },

    onDeleteSuccess: function () {
        return function () {
            //TODO message de deletion success
            console.log("TODO message de deletion success")
        }
    },

    onDeleteError: function () {
        return function () {
            //TODO message de deletion success
            console.log("TODO message de deletion error")
        }
    },

    beforeRemove: function () {
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


    isEquipmentReadOnly: function () {
        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.EQUIPMENTVALIDATION))
            return false;
        if (this.equipmentValidation !== ValidationState.OPEN && (this.equipmentValidation !== ValidationState.REFUSED))
            return true;
        return false;
    },


    isAssignmentReadOnly: function () {
        //tout ca parce que Spacebars ne supporte pas @index...
        var currentEditingTaskId = SelectedUpdatedOrReadedTask.get();
        var currentTask = Tasks.findOne(currentEditingTaskId);
        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.ASSIGNMENTVALIDATION))
            return false;
        if (currentTask.timeSlotValidation !== ValidationState.OPEN && (currentTask.timeSlotValidation !== ValidationState.REFUSED))
            return true;
        return false;
    },

    equipmentsCategories: function () {
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
    },
    equipments: function (category) {
        return Equipments.find({EquipmentCategories_Id: this._id, targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}});
    },


    autoformNameForQuantity: function () {
        //tout ca parce que Spacebars ne supporte pas @index...
        var currentEditingTaskId = SelectedUpdatedOrReadedTask.get();
        var currentTask = Tasks.findOne(currentEditingTaskId);
        var equipments = Tasks.findOne(currentEditingTaskId).equipments;
        var index = equipments.indexOf(_.findWhere(equipments, {equipmentId: this._id}))
        return "equipments." + index + ".quantity";
    },
    autoformNameForEquipmentId: function () {
        //tout ca parce que Spacebars ne supporte pas @index....
        var currentEditingTaskId = SelectedUpdatedOrReadedTask.get();
        var currentTask = Tasks.findOne(currentEditingTaskId);
        var equipments = Tasks.findOne(currentEditingTaskId).equipments;
        var index = equipments.indexOf(_.findWhere(equipments, {equipmentId: this._id}))
        return "equipments." + index + ".equipmentId";
    },
});


sandbox = function () {
    var insertTaskContext = Tasks.simpleSchema().namedContext("insertTask");
    Tasks.simpleSchema().namedContext("insertTask").validate({
        name: "task 1",
        teamId: Teams.findOne()._id,
        placeId: Places.findOne()._id,
        liveEventMasterId: Users.findOne()._id,
        masterId: Users.findOne()._id,
    }, {modifier: false});

    var ik = insertTaskContext.invalidKeys(); //it's reactive ! whouhou
    ik = _.map(ik, function (o) {
        return _.extend({message: insertTaskContext.keyErrorMessage(o.name)}, o);
    });


}

