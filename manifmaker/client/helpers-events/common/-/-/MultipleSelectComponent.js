MultipleSelectComponent =
    class MultipleSelectComponent extends SelectComponent {

        checkItemPath() {
            //in another method to have a context alone for reactivity

            var item = window[this.updateCollection].findOne(this.updateItemId);
            if (!item)
                throw new Meteor.Error(`${this.constructor.name} : could not find ${this.updateItemId} in collection ${this.updateCollection}`);


            //is it an array ?
            try {
                if (!Array.isArray(Schemas[this.updateCollection].pick([this.updateItemPath, this.updateItemPath+".$"])._schema[this.updateItemPath].type())) {
                    throw new Meteor.Error(`${this.constructor.name} : path ${this.updateItemPath} should refers to an array`);
                }
            } catch(TypeError){
                throw new Meteor.Error(`${this.constructor.name} : path ${this.updateItemPath} should refers to an array`);
            }
        }

        template() {
            return 'selectComponent';
        }

        collectionSelectedItems() {
            return this.optionCollection.find({
                _id: {
                    $in: this.optionsToUpdate()
                }
            });
        }

        isChecked() {
            var isChecked = (this.optionsToUpdate().indexOf(this.currentData()._id) !== -1) ? true : false;

            if (this.isRendered) {
                //checkbox need to be updated by jQuery and not DOM. DOM can only be used to init checkbox state
                //a trick to find the dom of the popover, not very strong
                this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content li input#" + this.currentData()._id).prop('checked', isChecked);
            }
            //still need DOM data for re-creating popover each time it is displayed
            return (isChecked) ? "checked" : "";
        }

        updateOption(newOptions) {
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

            if (cb.is(":checked"))
                this.addOption(_id);
            else
                this.removeOption(_id);
        }

        addOption(addedOptionId) {
            var optionsToUpdate = this.optionsToUpdate();
            optionsToUpdate.push(addedOptionId);
            this.updateOption(optionsToUpdate);
        }

        removeOption(removedOptionId) {
            var optionsToUpdate = this.optionsToUpdate();
            optionsToUpdate = _.without(optionsToUpdate, removedOptionId);
            this.updateOption(optionsToUpdate);
        }
    }

MultipleSelectComponent.register('MultipleSelectComponent');