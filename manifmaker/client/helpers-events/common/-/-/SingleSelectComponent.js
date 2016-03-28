SingleSelectComponent =
    class SingleSelectComponent extends MultipleSelectComponent {

        checkItemPath() {
            //in another method to have a context alone for reactivity

            var item = window[this.updateCollection].findOne(this.updateItemId);
            if (!item)
                throw new Meteor.Error(`${this.constructor.name} : could not find ${this.updateItemId} in collection ${this.updateCollection}`);

            //is it a MongoDB id type ?
            try {
                if (Schemas[this.updateCollection].pick([this.updateItemPath])._schema[this.updateItemPath].type !== SimpleSchema.RegEx.Id)
                    throw new Meteor.Error(`${this.constructor.name}  : path ${this.updateItemPath} should not refers to an object (nor array)`);
            } catch(Error){
                throw new Meteor.Error(`${this.constructor.name}  : path ${this.updateItemPath} should not refers to an object (nor array)`);
            }

            //is it an _id  ?
            if(this.quickSelectId){
                if(this.quickSelectId.match( SimpleSchema.RegEx.Id )[0] !== this.quickSelectId)
                    throw new Meteor.Error(`${this.constructor.name}  : this.quickSelectId should be a MongoDB id (should match ${SimpleSchema.RegEx.Id}). Given : ${this.quickSelectId}`);
            }
        }

        template() {
            return 'selectComponent';
        }

        collectionSelectedItems() {
            return this.optionCollection.find({
                _id: this.optionsToUpdate()
            });
        }

        isChecked() {
            var isChecked = (this.optionsToUpdate() === this.currentData()._id) ? true : false;

            if (this.isRendered) {
                //checkbox need to be updated by jQuery and not DOM. DOM can only be used to init checkbox state
                //a trick to find the dom of the popover, not very strong
                this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content li input#" + this.currentData()._id).prop('checked', isChecked);
                //a wonderfull trick, to prevent the user to click on a already selected option, we desactivate it
                this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content li input#" + this.currentData()._id).prop('disabled', isChecked);
            }
            //still need DOM data for re-creating popover each time it is displayed
            //a wonderfull trick, to prevent the user to click on a already selected option, we desactivate it
            //return (isChecked) ? "disabled checked" : "";
            return (isChecked) ? "checked" : "";
        }

        quickSelect(){
            this.updateOption(this.quickSelectId);
        }

        updateOption(newOptions) {
            var previousOptions = this.optionsToUpdate();
            if (previousOptions === newOptions) {
                console.info("single select, nothing to update");
                return;
            }

            window[this.updateCollection].update(this.updateItemId, {
                    $set: {
                        [this.updateItemPath]: newOptions
                    }
                }
            );
        }

        onCheckboxOptionsChange(e) {
            var cb = $(e.target);
            var _id = cb.attr("id");

            this.updateOption(_id);
        }
    }

SingleSelectComponent.register('SingleSelectComponent');