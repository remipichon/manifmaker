
class MultipleNonMandatorySelectComponent extends MultipleSelectComponent {


    //TODO could'nt figure out how to use constructor with this.data
    fakeConstructorWithDataArguments(){
        super.fakeConstructorWithDataArguments();

        this.clearMessage =  this.data().clearMessage || "Clear all";
    }



    template() {
        return 'multipleNonMandatorySelectComponent';
    }


    events() {
        return super.events().concat({
            'click .clear': this.clear
        });
    }


    clear(){
        this.updateOption([]);
    }



}

MultipleNonMandatorySelectComponent.register('MultipleNonMandatorySelectComponent');