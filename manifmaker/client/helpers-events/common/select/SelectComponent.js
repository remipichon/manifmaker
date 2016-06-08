export class SelectComponent extends BlazeComponent {

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

        quickSelect() {
            //to implement
        }

        updateOption(newOptions) {
            //to implement
        }

        onCheckboxOptionsChange(e) {
            //to implement and use updateOption
        }

        initializeData() {
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
            this.pathWithArray = this.data().pathWithArray || null;

            //quick select arguments
            if (this.data().quickSelectLabel && (this.data().quickSelectIds || this.data().quickSelectId)) {
                this.quickSelectId = this.data().quickSelectId || null;
                this.quickSelectIds = this.data().quickSelectIds || null;
                this.quickSelectLabel = this.data().quickSelectLabel;
            }

            this.updateCallback = this.data().updateCallback;

            this.checkItemPath();
        }  


        constructor() {
            super();
            this.isRenderedBoolean = false;
            this.searchQuery = new ReactiveVar("");
        }

        onRendered() {
            //this.$(".custom-select-label-wrapper[data-popover]").on("show.bs.popover",this.onPopoverShow);
            this.$('.custom-select-label-wrapper[data-popover]').popover({html: true, trigger: 'click', placement: 'bottom', delay: {show: 50, hide: 400}});
            if (this.withoutLabel)
                this.$(".custom-select-icon").click("on", _.bind(function (e) {
                    e.stopPropagation();
                    this.$('.custom-select-label-wrapper[data-popover]').popover("show");
                }, this));
            this.isRenderedBoolean = true;
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

        /**
         * either extract from the updateItemPath or form pathWithArray and updateItemPath
         *
         * updateItemPath alone :
         *
         *      User object + pathToUpdate="userId" => extract the value stored in userId
         *      Task object + pathToUpdate="timeSlots.0.peopleNeeded.1.skills" => extract skills array of second peopleNeeded from first timeSlots of the task
         *
         *  pathWithArray and updateItemPath :
         *
         *      Task object + pathWithArray = [
         *            {
         *                path: "timeSlots",
         *                _id: "0f89d7491be7cc4977fe85e9"
         *            },
         *            {
         *                path: "peopleNeeded",
         *                _id:"4c1ed4cdf1c83e946ed9a38b"
         *            }
         *            ];
         *          + pathToUpdate =  "userId"
         *      => extract userId value from people needed identified by its _id from time slot identified by its _id
         *
         *
         * @returns {nested}
         */
        optionsToUpdate() {
            if (this.pathWithArray) {
                var leaf = Tasks.findOne(this.updateItemId);
                _.each(this.pathWithArray, function (pathObj) {
                    leaf = _.findWhere(Leaf(leaf, pathObj.path), {_id: pathObj._id});
                });
                return leaf[this.updateItemPath];

            } else {
                var leaf = Leaf(window[this.updateCollection].findOne(this.updateItemId), this.updateItemPath);
                return leaf;
            }

        }


        /**
         * if pathWithArray, generate a query object to update and a update key for $set.
         *
         *     ex : from pathWithArray = [
         *            {
         *                path: "timeSlots",
         *                _id: "0f89d7491be7cc4977fe85e9"
         *            },
         *            {
         *                path: "peopleNeeded",
         *                _id:"4c1ed4cdf1c83e946ed9a38b"
         *            }
         *            ];
         *          + pathToUpdate =  "userId"
         *
         *           generate  ==> "timeSlots.1.peopleNeeded.0.userId
         *
         *
         * @param newOptions
         */
        updateOption(newOptions) {
            var previousOptions = this.optionsToUpdate();
            if (previousOptions === newOptions) {
                console.info("single select, nothing to update");
                return;
            }

            var pathOrPathWithIndex,index,array;

            if (this.pathWithArray) {
                //creation du 'path' avec des index...

                pathOrPathWithIndex = "";
                var leaf = Tasks.findOne(this.updateItemId);
                _.each(this.pathWithArray, function (pathObj) {
                    array = leaf;
                    leaf = _.findWhere(Leaf(leaf, pathObj.path), {_id: pathObj._id});
                    index = _.indexOf(array[pathObj.path],leaf);
                    pathOrPathWithIndex += pathObj.path + "." + index + ".";
                });

                pathOrPathWithIndex += this.updateItemPath

            } else
                pathOrPathWithIndex = this.updateItemPath;

            window[this.updateCollection].update(this.updateItemId, {
                    $set: {
                        [pathOrPathWithIndex]: newOptions
                    }
                },this.updateCallback
            );
        }

        optionValue() {
            return this.currentData()[this.optionValueName];
        }

        events() {
            //to concat if needed
            var events = [{
                'change .custom-select-options :checkbox': this.onCheckboxOptionsChange,
                'input .search-input': this.performSearch,
                "show.bs.popover .custom-select-label-wrapper[data-popover]": this.onPopoverShow
            }];
            if (this.quickSelectLabel) {
                events.push({
                    "click .quick-select": this.quickSelect
                });
            }
            return events;
        }

        performSearch(e) {
            this.searchQuery.set($(e.target).val());
        }

    }

