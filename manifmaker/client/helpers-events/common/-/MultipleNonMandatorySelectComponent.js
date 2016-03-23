class MultipleNonMandatorySelectComponent extends MultipleSelectComponent {

    fakeConstructorWithDataArguments() {
        super.fakeConstructorWithDataArguments();
        this.clearMessage = this.data().clearMessage || "Clear all";
    }

    template() {
        return 'nonMandatorySelectComponent';
    }

    events() {
        return super.events().concat({
            'click .clear': this.clear
        });
    }

    clear() {
        this.updateOption([]);
    }
}

MultipleNonMandatorySelectComponent.register('MultipleNonMandatorySelectComponent');