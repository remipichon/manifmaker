class SingleNonMandatorySelectComponent extends SingleSelectComponent {

    fakeConstructorWithDataArguments() {
        super.fakeConstructorWithDataArguments();
        this.clearMessage = this.data().clearMessage || "Clear";
    }

    template() {
        return 'nonMandatorySelectComponent';
    }

    events() {
        return super.events().concat({
            'click .clear': this.clear
        });
    }

    isChecked() {
        var isChecked = (this.optionsToUpdate() === this.currentData()._id) ? true : false;

        if (this.isRendered) {
            //checkbox need to be updated by jQuery and not DOM. DOM can only be used to init checkbox state
            //a trick to find the dom of the popover, not very strong
            this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content li input#" + this.currentData()._id).prop('checked', isChecked);
        }
        //still need DOM data for re-creating popover each time it is displayed
        return (isChecked) ? "checked" : "";
    }

    clear() {
        this.updateOption(null);
    }

    onCheckboxOptionsChange(e) {
        var cb = $(e.target);
        var _id = cb.attr("id");

        if (cb.is(":checked"))
            this.updateOption(_id);
        else
            this.updateOption(null);
    }
}

SingleNonMandatorySelectComponent.register('SingleNonMandatorySelectComponent');