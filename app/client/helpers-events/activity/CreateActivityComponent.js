class CreateActivityComponent extends BlazeComponent {

    constructor() {
        super();
        this.tempItemId = TempCollection.insert({
            name: null,
            teamId: null,
            placeId: null,
            liveEventMasterId: null,
            masterId: null,
            limitToTeam: false
        });
        this.insertActivityContext = Activities.simpleSchema().namedContext("insertActivity");
        this.errorsArray = new ReactiveVar([]);
        this.hasBeenSubmitted = new ReactiveVar(false);

        this.sAlertIsDisplayed = false;
    }


    rendered() {

    }

    template() {
        return "createActivityComponent";
    }

    events() {
        return [
            {
                "click [type=submit]": this.submitForm,
                "change [data-key=name]": this.updateName,
                "change [data-key=limitToTeam]": this.updateLimitToTeam,
                "change [data-key=description]": this.updateDescription
            }]
    }

    updateDescription() {
        TempCollection.update({_id: this.tempItemId},
            {
                $set: {
                    description: $("[data-key=description]").val()
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

    updateLimitToTeam() {
        TempCollection.update({_id: this.tempItemId},
            {
                $set: {
                    limitToTeam: $("[data-key=limitToTeam]").val()
                }
            }
        );
    }

    submitForm() {
        this.hasBeenSubmitted.set(true);

        if (this.validateForm()) {
            var temp = TempCollection.findOne({_id: this.tempItemId});
            var _id = Activities.insert(temp);
            Router.go("/activity/" + _id);
        }
    }

    validateForm() {
        //validating
        var temp = TempCollection.findOne({_id: this.tempItemId});
        delete temp._id; //cleaning
        var isValid = Activities.simpleSchema().namedContext("insertActivity").validate(temp, {modifier: false});

        //managing error
        if (!isValid) {
            var ik = this.insertActivityContext.invalidKeys(); //it's reactive ! whouhou
            ik = _.map(ik, _.bind(function (o) {
                return _.extend({message: this.insertActivityContext.keyErrorMessage(o.name)}, o);
            }, this));

            this.errorsArray.set(ik);
            this.isFormValid = false;
        } else {
            this.errorsArray.set([]);
            this.isFormValid = true;
        }

        return this.isFormValid;

    }

    errors() {
        //this.validateForm(); //just to active reactivity on this method
        var err = this.errorsArray.get();

        if (this.hasBeenSubmitted.get()) { //active reactivity
            if (err.length !== 0 && !this.sAlertIsDisplayed) {
                this.sAlertIsDisplayed = true;
                sAlert.error('There is errors in the form', {
                    onClose: _.bind(function () {
                        this.sAlertIsDisplayed = false;
                    }, this),
                    timeout: 'none'
                });
            } else if(err.length === 0){
                sAlert.closeAll();
            }
            return err;
        }
        return [];
    }


}

CreateActivityComponent.register('CreateActivityComponent');
