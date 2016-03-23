SelectComponent =
    class SelectComponent extends BlazeComponent {

        checkItemPath() {
            //to implement
        }

        template() {
            //to implement
        }

        collectionSelectedItems() {
            //to implement
        }

        isChecked() {
            //to implement
        }

        updateOption(newOptions) {
            //to implement
        }

        onCheckboxOptionsChange(e) {
            //to implement and use updateOption
        }

        //TODO could'nt figure out how to use constructor with this.data
        fakeConstructorWithDataArguments() {
            //select popover init arguments
            if (!this.data().optionCollection || !window[this.data().optionCollection])
                throw new Meteor.Error(this.constructor.name + " : optionCollection should be Collection instance in the window scope. Given :" + this.data().optionCollection);
            this.optionCollection = window[this.data().optionCollection]; //should be in window scope
            if (!this.data().optionCollectionIndex || !window[this.data().optionCollectionIndex])
                throw new Meteor.Error(this.constructor.name + " : optionCollectionIndex should be EasySearch.Index instance in the window scope. Given :" + this.data().optionCollectionIndex);
            this.optionCollectionIndex = window[this.data().optionCollectionIndex];
            this.optionValueName = this.data().optionValueName || "name";
            this.title = this.data().title || "Update " + this.data().optionCollection;
            this.selectLabel = this.data().selectLabel || this.data().updateCollection + "' " + this.data().optionCollection;
            this.filterPlaceHolder = this.data().filterPlaceHolder || "Filter by " + this.optionValueName;
            this.nothingSelectedLabel = this.data().nothingSelectedLabel || "Nothing yet selected";
            this.withoutLabel = this.data().withoutLabel || false;

            //item update arguments
            if (!this.data().updateCollection || !window[this.data().updateCollection])
                throw new Meteor.Error(this.constructor.name + " : updateCollection should be Collection instance in the window scope");
            this.updateCollection = this.data().updateCollection; //should be in window scope
            this.updateItemId = this.data().updateItemId; //mongoId
            this.updateItemPath = this.data().updateItemPath; //path to an array

            this.checkItemPath();
        }


        constructor() {
            super();
            this.isRendered = false;
            this.searchQuery = new ReactiveVar("");
        }

        onRendered() {
            //this.$(".custom-select-label-wrapper[data-popover]").on("show.bs.popover",this.onPopoverShow);
            this.$('.custom-select-label-wrapper[data-popover]').popover({html: true, trigger: 'click', placement: 'bottom', delay: {show: 50, hide: 400}});
            if(this.withoutLabel)
            this.$(".custom-select-icon").click("on",_.bind(function(e){
                e.stopPropagation();
                this.$('.custom-select-label-wrapper[data-popover]').popover("show");
            },this));
            this.isRendered = true;
        }

        onPopoverShow() {
            this.searchQuery.set("");
        }

        collectionItems() {
            return this.optionCollection.find();
        }

        /**
         * because popover, that's why
         */
        cloneSearchResultInPopover() {
            var searchQuery = this.searchQuery.get();

            if (searchQuery === this.previousSearchQuery) return; //this reactivity context has been fired but no needs to do anything if search query doesn't change
            this.previousSearchQuery = searchQuery;

            var tmpl = Template.instance();
            if (tmpl.view.isRendered) {

                var data = this.optionCollectionIndex.search(searchQuery).fetch();

                //a trick to find the dom of the popover, not very strong
                var parentNode = this.$(`.custom-select-label-wrapper[data-popover]`).parent().find(".popover .popover-content").find(".custom-select-options");

                if (!this.blazeView) //popover has just been created (just been shown again), we clear the init list
                    parentNode.empty()
                else //we remove previous blaze view list
                    Blaze.remove(this.blazeView)

                this.blazeView = Blaze.renderWithData(Template.customSelectPopoverOption, {collectionItemsPopover: data}, parentNode[0]);
            }
        }

        optionsToUpdate() {
            var leaf = Leaf(window[this.updateCollection].findOne(this.updateItemId), this.updateItemPath);
            return leaf;
        }

        optionValue() {
            return this.currentData()[this.optionValueName];
        }

        events() {
            //to concat if needed
            return [{
                'change .custom-select-options :checkbox': this.onCheckboxOptionsChange,
                'input .search-input': this.performSearch,
                "show.bs.popover .custom-select-label-wrapper[data-popover]": this.onPopoverShow
            }];
        }

        performSearch(e) {
            this.searchQuery.set($(e.target).val());
        }

    }

