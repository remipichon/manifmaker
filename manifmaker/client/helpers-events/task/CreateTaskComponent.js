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
        this.hasBeenSubmitted = new ReactiveVar(false);
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
                "change [data-key=name]": this.updateName,
                "change [data-key=description]": this.updateDescription
            }]
    }

    updateDescription() {
        TempCollection.update({_id: this.tempItemId},
            {
                $set: {
                    name: $("[data-key=description]").val()
                }
            }
        );
    }

    updateName() {
        TempCollection.update({_id: this.tempItemId},
            {
                $set: {
                    name: $("[data-key=name]").val()
                }
            }
        );
    }

    submitForm() {
        this.hasBeenSubmitted.set(true);

        if (this.isFormValid) {
            var temp = TempCollection.findOne({_id: this.tempItemId});
            var _id = Tasks.insert(temp);
            Router.go("/task/" + _id);
        }
    }

    validateForm() {
        //validating
        var temp = TempCollection.findOne({_id: this.tempItemId});
        delete temp._id; //cleaning
        var isValid = Tasks.simpleSchema().namedContext("insertTask").validate(temp, {modifier: false});

        //managing error
        if (!isValid) {
            var ik = this.insertTaskContext.invalidKeys(); //it's reactive ! whouhou
            ik = _.map(ik, _.bind(function (o) {
                return _.extend({message: this.insertTaskContext.keyErrorMessage(o.name)}, o);
            }, this));

            this.errorsArray.set(ik);
            this.isFormValid = false;
        } else {
            this.errorsArray.set([]);
            this.isFormValid = true;
        }
    }

    errors() {
        this.validateForm(); //just to active reactivity on this method
        var err = this.errorsArray.get();

        if (this.hasBeenSubmitted.get()) { //active reactivity
            return err;
        }
        return [];
    }

}

CreateTaskComponent.register('CreateTaskComponent');
