
class MultipleSelectComponent extends BlazeComponent {

    //TODO could'nt figure out how to use constructor with this.data
    fakeConstructorWithDataArguments(){
        //select popover init arguments
        if(! this.data().optionCollection || ! window[this.data().optionCollection])
            throw new Meteor.Error("MultipleSelectComponent : optionCollection should be Collection instance in the window scope");
        this.optionCollection = window[this.data().optionCollection]; //should be in window scope
        this.optionValueName = this.data().optionValueName || "name";
        this.title =  this.data().title || this.data().optionCollection;
        this.filterPlaceHolder =  this.data().filterPlaceHolder || "Filter...";

        //item update arguments
        if(! this.data().updateCollection || ! window[this.data().updateCollection])
            throw new Meteor.Error("MultipleSelectComponent : updateCollection should be Collection instance in the window scope");
        this.updateCollection = this.data().updateCollection; //should be in window scope
        this.updateItemId = this.data().updateItemId; //mongoId
        this.updateItemPath = this.data().updateItemPath; //path to an array
    }

    constructor(){
        super();
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
                $in : this.optionsToUpdate()
            }
        });
    }

    optionsToUpdate() {
        var leaf = Leaf(window[this.updateCollection].findOne(this.updateItemId), this.updateItemPath);
        if(!leaf) throw new Meteor.Error("404",`SimpleSelectComponent : bad combination of update collection ${this.updateCollection} updateItemId ${updateItemId} and updateItemPath ${updateItemPath} : nothing has been found`);
        return leaf;
    }

    isChecked(){
        var isChecked = (this.optionsToUpdate().indexOf(this.currentData()._id) !== -1) ? true : false;

        if(this.isRendered) {
            //checkbox need to be updated by jQuery and not DOM. DOM can only be used to init checkbox state
            //a trick to find the dom of the popover, not very strong
            this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content li input#"+this.currentData()._id).prop('checked', isChecked);
        }
        //still need DOM data for re-creating popover each time it is displayed
        return (isChecked) ? "checked" : "";
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
        var optionsToUpdate = this.optionsToUpdate();
        optionsToUpdate.push(addedOptionId);
        this.updateOption(optionsToUpdate);
    }

    removeOption(removedOptionId){
        var optionsToUpdate = this.optionsToUpdate();
        optionsToUpdate = _.without(optionsToUpdate,removedOptionId);
        this.updateOption(optionsToUpdate);
    }

    updateOption(newOptions){
        window[this.updateCollection].update(this.updateItemId, {
                $set: {
                    [this.updateItemPath]: newOptions
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

MultipleSelectComponent.register('MultipleSelectComponent');