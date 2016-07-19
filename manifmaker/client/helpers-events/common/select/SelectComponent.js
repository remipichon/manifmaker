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

        //TODO oCaA : optionCollection as array
        //TODO  nOC : no update collection
        initializeData() {

            /**
             * optionCollection
             * required
             * @type Mongo Collection in the window scope(findAll will be used) OR array
             *
             * Les options du select
             */
            //TODO oCaA :que faire ????
            if (!this.data().optionCollection || !window[this.data().optionCollection])
                throw new Meteor.Error(this.constructor.name + " : optionCollection should be Collection instance in the window scope. Given :" + this.data().optionCollection);
            this.optionCollection = window[this.data().optionCollection]; //should be in window scope

            /**
             * optionCollectionIndex
             * required if optionCollection is a Collection Mongo
             * @type EasySearch.Index instance in the window scope
             */
            //TODO oCaA : que faire ????
            if (!this.data().optionCollectionIndex || !window[this.data().optionCollectionIndex])
                throw new Meteor.Error(this.constructor.name + " : optionCollectionIndex should be EasySearch.Index instance in the window scope. Given :" + this.data().optionCollectionIndex);
            this.optionCollectionIndex = window[this.data().optionCollectionIndex];

            /**
             * optionValueName
             * default if optionCollection is a Collection Mongo else don't set it: "name"
             * @type {string}
             *
             * Name of the field where the label of the option will be found to be displayed in the popover
             */
            //TODO oCaA : que faire ????
            this.optionValueName = this.data().optionValueName || "name";

            //TODO  nOC : insert an item in the TempCollection as {_id: generated, selectedOption: null}
            if (!this.data().updateCollection || !window[this.data().updateCollection])
                throw new Meteor.Error(this.constructor.name + " : updateCollection should be Collection instance in the window scope");

            /**
             * Mongo Collection in the window scope
             *
             * Mongo Collection from which an item will be automacally updated when select changes.
             * If not provided, you should use an updateCallback to handle yourself whatever you want to do with the custom select.
             */
            this.updateCollection = this.data().updateCollection; 
            /**
             * mongoId
             * required if updateCollection is provided
             * 
             * _id of the item to be updated (need to be in updateCollection, of course)
             */
            //TODO  nOC : set to the item._id inserted previously
            this.updateItemId = this.data().updateItemId;
            /**
             * path to an array
             * required if updateCollection is provided and pathWithArray is not
             *
             * dot path to nested field to be updated
             */
            //TODO  nOC : set to "selectedOption"
            this.updateItemPath = this.data().updateItemPath; //path to an array
            /**
             * 
             * required if updateCollection is provided and updateItemPath is not
             *
             * JSON object to update a nested field which is itself in an array of object with an unique _id.
             * See optionsToUpdate for more information
             */
            //TODO  nOC : unused
            this.pathWithArray = this.data().pathWithArray || null;
            

            if (this.data().quickSelectLabel && (this.data().quickSelectIds || this.data().quickSelectId)) {
                this.quickSelectId = this.data().quickSelectId || null;
                this.quickSelectIds = this.data().quickSelectIds || null;
                this.quickSelectLabel = this.data().quickSelectLabel;
            }

            /**
             *  required if updateCollection is not provided
             *  function
             *
             *  Called with an error object as the first argument and, if no error, the number of affected documents as the second and an array of the selected options as the third.
             *  Required if updateCollection is not provided but can be used even if updateCollection is provided
             */
            //TODO  nOC : it's required
            this.updateCallback = this.data().updateCallback;

            /**
             * title
             * default : "Update " + optionCollection
             * @type {string}
             *
             * Popover title
             */
            this.title = this.data().title || "Update " + this.data().optionCollection;

            /**
             * selectLabel
             * default : title
             * @type {string}
             *
             * Label of the select component (not the popover title)
             */
            this.selectLabel = this.data().selectLabel || this.data().updateCollection + "' " + this.data().optionCollection;

            /**
             * default Filter by  + optionValueName
             * @type {string}
             *
             * Search input text placeholder
             */
            this.filterPlaceHolder = this.data().filterPlaceHolder || "Filter by " + this.optionValueName;

            /**
             * default : Nothing yet selected
             * @type {string}
             */
            this.nothingSelectedLabel = this.data().nothingSelectedLabel || "Nothing yet selected";

            /**
             * default : false
             * @type {boolean}
             *
             * Compact form where selectLabel is not used
             */
            this.withoutLabel = this.data().withoutLabel || false;

            var value = parseInt(this.data().maxSelectedOptionDisplayed);
            /**
             * default -1
             * @type {number}
             *
             * Number of selected options displayed. If -1, all selected options are displayed. If 0, so selected options are displayed. Else, if more than
             * maxSelectedOptionDisplayed options are selected, a count is displayed with maxSelectedOptionDisplayedLabel. 
             * 
             * Note : Any value greater than 0 are unless if the component is a SingleSelectComponent as no more than one selected options will ever be displayed. 
             */
            if(value === 0) //0 is a falsy value
                this.maxSelectedOptionDisplayed = value;
            else
                this.maxSelectedOptionDisplayed = value || -1;

            /**
             * default optionCollection + selected
             * @type {string}
             * 
             * label to display if maxSelectedOptionDisplayed is reached. Number of selected options will be added
             * ad the beginning of the string. 
             */
            this.maxSelectedOptionDisplayedLabel = this.data().maxSelectedOptionDisplayedLabel || " " + this.data().optionCollection + " selected";

            /**
             * default false
             * @type {boolean}
             *
             * If true, selected options are on top of the popover list
             */
            //TODO selectedOptionSortedOnTopOfList : TOUT
            this.selectedOptionSortedOnTopOfList = this.data().selectedOptionSortedOnTopOfList || false;


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

        maxSelectedOptionDisplayedReached(){
            if(this.maxSelectedOptionDisplayed === -1) return false;
            return this.collectionSelectedItems().fetch().length > this.maxSelectedOptionDisplayed;
        }

    }

