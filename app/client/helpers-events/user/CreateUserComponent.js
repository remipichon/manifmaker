class CreateUserComponent extends BlazeComponent {

    constructor() {
        super();
        this.tempItemId = TempCollection.insert({
            name: null,
            firstName: null,
            nickName: null,
            phoneNumber: null,
            birthDate: null
        });
        this.insertUserContext = Meteor.users.simpleSchema().namedContext("insertUser");
        this.errorsArray = new ReactiveVar([]);
        this.hasBeenSubmitted = new ReactiveVar(false);

        this.sAlertIsDisplayed = false;
    }


    rendered() {

    }

    template() {
        return "createUserComponent";
    }

    events() {
        return [
            {
                "click [type=submit]": this.submitForm,
                "change [data-key=name]": this.updateName,
            }]
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

        if (this.validateForm()) {
            var temp = TempCollection.findOne({_id: this.tempItemId});
            var _id = Meteor.users.insert(temp);
            Router.go("/user/" + _id);
        }
    }

    validateForm() {
        //validating
        var temp = TempCollection.findOne({_id: this.tempItemId});
        delete temp._id; //cleaning
        var isValid = Meteor.users.simpleSchema().namedContext("insertUser").validate(temp, {modifier: false});

        //managing error
        if (!isValid) {
            var ik = this.insertUserContext.invalidKeys(); //it's reactive ! whouhou
            ik = _.map(ik, _.bind(function (o) {
                return _.extend({message: this.insertUserContext.keyErrorMessage(o.name)}, o);
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

CreateUserComponent.register('CreateUserComponent');
