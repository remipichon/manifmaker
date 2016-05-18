import {MultipleSelectComponent} from "./MultipleSelectComponent"

export class MultipleNonMandatorySelectComponent extends MultipleSelectComponent {

    initializeData() {
        super.initializeData();
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