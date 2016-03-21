
class SimpleSelectComponent extends BlazeComponent {

    //TODO could'nt figure out how to use constructor with this.data
    fakeConstructorWithDataArguments(){
        if(! this.data().optionCollection || ! window[this.data().optionCollection])
            throw new Meteor.Error("SimpleSelectComponent : optionCollection should be Collection instance");
        this.optionCollection = window[this.data().optionCollection]
        this.optionValueName = this.data().name || "name";
        this.title =  this.data().title || this.data().optionCollection;
        this.filterPlaceHolder =  this.data().filterPlaceHolder || "Filter...";

        this.isRendered = false;


    }

    onRendered(){
        this.$('.custom-select-label-wrapper[data-popover]').popover({html: true, trigger: 'click', placement: 'bottom', delay: {show: 50, hide: 400}});
        this.isRendered = true;

    }

    template() {
        return 'simpleSelect';
    }


    collectionItems(){
        return this.optionCollection.find();
    }

    collectionSelectedItems(){
        return this.optionCollection.find({
            _id: {
                $in : Users.findOne({name:"user1"}).teams
            }
        });
    }

    isChecked(){
        var optionsToUpdate = Users.findOne({name:"user1"}).teams;

        if(this.isRendered) {
            //checkbox need to be updated by jQuery and not DOM. DOM can only be used to init checkbox state
            var isChecked = (optionsToUpdate.indexOf(this.currentData()._id) !== -1) ? true : false;
            //a trick to find the dom of the popover, not very strong
            this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content li input#"+this.currentData()._id).prop('checked', isChecked);
        }
        //still need DOM data for re-creating popover each time it is displayed
        return (optionsToUpdate.indexOf(this.currentData()._id) !== -1) ? "checked" : "";
    }

    optionKey(){
        return this.currentData()[this.optionKeyName];
    }

    optionValue(){
        return this.currentData()[this.optionValueName];
    }

    events() {
        return [{
            'change .custom-select-options :checkbox': this.onCheckboxOptionsChange,
        }];
    }

    addOption(addedOptionId){
        var toUpdate = Users.findOne({name:"user1"});
        var optionsToUpdate = toUpdate.teams;
        var toUpdateId = toUpdate._id;

        optionsToUpdate.push(addedOptionId);

        Users.update(toUpdateId,
            {
                $set: {
                    teams: optionsToUpdate
                }
            }
        );
    }

    removeOption(removedOptionId){
        var toUpdate = Users.findOne({name:"user1"});
        var optionsToUpdate = toUpdate.teams;
        var toUpdateId = toUpdate._id;

        optionsToUpdate = _.without(optionsToUpdate,removedOptionId);

        Users.update(toUpdateId,
            {
                $set: {
                    teams: optionsToUpdate
                }
            }
        );

    }

    onCheckboxOptionsChange(e){
        var cb = $(e.target);

        var _id = cb.attr("id");

        if(cb.is(":checked"))
            this.addOption(_id);
        else
            this.removeOption(_id);

    }
}

SimpleSelectComponent.register('SimpleSelectComponent');