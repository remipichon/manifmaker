import {AssignmentService} from "../../both/service/AssignmentService"
import {PeopleNeedService} from "../../both/service/PeopleNeedService"
import {TimeSlotService} from "../../both/service/TimeSlotService"
import {AssignmentReactiveVars} from "../../client/helpers-events/assignment/AssignmentReactiveVars"

/** @class AssignmentServiceClient */
export class AssignmentServiceClient {

    /**
     * @summary Filter user list in task to user mode only remove assignment only.
     * @description
     * Reactive Var :
     *
     *  - Get ReactiveVar AssignmentReactiveVars.SelectedPeopleNeed
     *  - Set AssignmentReactiveVars.SelectedTimeSlot
     *  - Set AssignmentReactiveVars.IsUnassignment
     *
     * @locus Anywhere
     * @returns {timeSlot|null}
     */
    static taskToUserPerformUserFilterRemoveAssignment() {
        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                console.error("Template.assignmentCalendar.events.dblclick .creneau", "User can't normally dlb click on this kind of element when in userToTask");
                return;
                break;
            case AssignmentType.TASKTOUSER:
                var peopleNeeded = AssignmentReactiveVars.SelectedPeopleNeed.get();

                var assignment = Assignments.findOne({
                    peopleNeedId: peopleNeeded._id
                });

                var newFilter = {
                    _id: assignment.userId
                };

                AssignmentReactiveVars.SelectedTimeSlot.set(TimeSlotService.getTaskAndTimeSlotAndPeopleNeedByPeopleNeedId(peopleNeeded._id).timeSlot);
                AssignmentReactiveVars.UserFilter.set(newFilter);
                AssignmentReactiveVars.IsUnassignment.set(true);
                break;
        }
    }

    /**
     * @summary Filter user list in task to user mode only.
     * Reactive Var :
     *
     *  - Get ReactiveVar AssignmentReactiveVars.SelectedPeopleNeed
     *  - Set AssignmentReactiveVars.SelectedTimeSlot
     *  - Set AssignmentReactiveVars.IsUnassignment
     *
     * @locus Anywhere
     * @returns {timeSlot|null}
     */
    static taskToUserPerformUserFilter() {
        /**
         *
         * By now, userId, teamId and skills can't be combined.
         * In particular we can't ask for a specific team and for specific skills (will be soon)
         *
         * Skills filter
         *
         * For selected task's time slot, the user must have all the required skills of at least
         * one of task's people need
         *
         */
        var peopleNeeded = AssignmentReactiveVars.SelectedPeopleNeed.get();
        var timeSlot = AssignmentReactiveVars.SelectedTimeSlot.get();
        AssignmentReactiveVars.IsUnassignment.set(false);

        var askingSpecificNeedAndSkills = [];
        if (peopleNeeded.userId) { //prior above teamId an skills
            askingSpecificNeedAndSkills.push({
                _id: peopleNeeded.userId
            });
        } else if (peopleNeeded.teamId && peopleNeeded.skills.length !== 0) {  //we combine teamId and skills
            askingSpecificNeedAndSkills.push({
                $and: [
                    {
                        teams: peopleNeeded.teamId
                    },
                    {
                        skills: {
                            $all: peopleNeeded.skills
                        }
                    }
                ]
            });
        } else if (peopleNeeded.teamId) { //we only use teamId
            askingSpecificNeedAndSkills.push({
                teams: peopleNeeded.teamId
            });
        } else if (peopleNeeded.skills.length !== 0) //if people need doesn't require any particular skills
            askingSpecificNeedAndSkills.push({skills: {$all: peopleNeeded.skills}});

        var userTeamsSkillsFilter;
        if (askingSpecificNeedAndSkills.length !== 0) //if all time slot's people need don't require any particular skills
            userTeamsSkillsFilter = {
                $or: askingSpecificNeedAndSkills
            };


        var availabilitiesFilter = {
            availabilities: {
                $elemMatch: {
                    start: {$lte: timeSlot.start},
                    end: {$gte: timeSlot.end}
                }
            }
        };

        /**
         * The user must be free during the time slot duration and have skills that match the required ones
         */
        var newFilter = {
            $and: [
                availabilitiesFilter,
                userTeamsSkillsFilter
            ]
        };


        AssignmentReactiveVars.UserFilter.set(newFilter);
    }

    /**
     * @summary On the assignment calendar, display more or less hours accuracy
     * @locus client
     * @param accuracy {CalendarAccuracy}
     */
    static setCalendarAccuracy(accuracy) {

        _.each(AssignmentCalendarDisplayedHours.find().fetch(), function (doc) {
            AssignmentCalendarDisplayedHours.remove(doc._id)
        });
        _.each(AssignmentCalendarDisplayedQuarter.find().fetch(), function (doc) {
            AssignmentCalendarDisplayedQuarter.remove(doc._id)
        });
        _.each(AssignmentCalendarDisplayedAccuracy.find().fetch(), function (doc) {
            AssignmentCalendarDisplayedAccuracy.remove(doc._id)
        });

        AssignmentCalendarDisplayedAccuracy.insert({accuracy: accuracy});

        var number = ((accuracy <= 1) ? 1 : accuracy);
        for (var i = 0; i < 24; i = i + number)
            AssignmentCalendarDisplayedHours.insert({date: i});

        var number2 = ((accuracy < 1) ? 60 * accuracy : 60);
        for (var i = 0; i <= 45; i = i + number2)
            AssignmentCalendarDisplayedQuarter.insert({quarter: i});

    }

    /**
     * @summary On the assignment calendar, all the days covered by the given assignment term
     * @locus client
     * @param _idAssignmentTerms {AssignmentTerms}
     */
    static setCalendarTerms(_idTerms) {
        _.each(AssignmentCalendarDisplayedDays.find().fetch(), function (doc) {
            AssignmentCalendarDisplayedDays.remove(doc._id)
        });

        var displayedTerm;
        if (!_idTerms) {
            var terms = AssignmentTerms.find({}).fetch();
            displayedTerm = terms[0];           //TODO which is default ?
        } else {
            displayedTerm = AssignmentTerms.findOne(_idTerms)
        }


        var start = new moment(displayedTerm.start);
        var end = new moment(displayedTerm.end);

        while (start.isBefore(end)) {
            AssignmentCalendarDisplayedDays.insert({
                date: start
            });
            start.add(1, 'days');
        }

    }

    /**
     * @summary Init Materialize multiselect HTML component on assignment page
     * @locus client
     */
    static initAssignmentSkillsFilter() {
        //init skills filter for assignment if we are on the assignment page
        $(document).ready(function () {
            $('#filter_skills_user').multiselect({
                enableFiltering: true,
                filterPlaceholder: 'Search for skills...',
                numberDisplayed: 2,
                nonSelectedText: 'Choose some skills',
                nSelectedText: ' skills selected'
            });
        });
        $(document).ready(function () {
            $('#filter_skills_task').multiselect({
                enableFiltering: true,
                filterPlaceholder: 'Search for skills...',
                numberDisplayed: 2,
                nonSelectedText: 'Choose some skills',
                nSelectedText: ' skills selected'
            });
        });
    }

    /**
     * @summary Init Materialize popover HTML component on assignment page and setup a custom leave which hide popover when mouse leave
     * @locus client
     */
    static initAssignmentPopover() {
        var originalLeave = $.fn.popover.Constructor.prototype.leave;
        $.fn.popover.Constructor.prototype.leave = function (obj) {
            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
            var container, timeout;

            originalLeave.call(this, obj);

            if (obj.currentTarget) {
                container = $(obj.currentTarget).siblings('.popover')
                timeout = self.timeout;
                container.one('mouseenter', function () {
                    //We entered the actual popover – call off the dogs
                    clearTimeout(timeout);
                    //Let's monitor popover content instead
                    container.one('mouseleave', function () {
                        $.fn.popover.Constructor.prototype.leave.call(self, self);
                    });
                })
            }
        };

        $('body').popover({
            html: true,
            selector: '.creneau[data-popover]',
            trigger: 'click hover',
            placement: 'auto',
            delay: {show: 50, hide: 400}
        });

        $(document).on("click", ".popover .peopleNeed.assigned", function (event) {
            AssignmentServiceClient.readSelectedPeopleNeedAndTimeSlotFromPopover(event, true);
            AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
        });

        $(document).on("click", ".popover .peopleNeed:not(.assigned)", function (event) {
            AssignmentServiceClient.readSelectedPeopleNeedAndTimeSlotFromPopover(event, false);
            AssignmentServiceClient.taskToUserPerformUserFilter();
        });
    }

    /**
     * @summary Manage the task list checkbox "display assigned task" according to ReactiveVar AssignmentReactiveVars.CurrentAssignmentType
     * @locus client
     */
    static disableDisplayAssignedCheckbox() {
        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();
        var checkbox = $("#display-assigned-task-checkbox");
        var label = $("#display-assigned-task-checkbox-label");
        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                checkbox.attr("disabled", true);
                label.css("opacity", 0.3);
                break;
            case AssignmentType.TASKTOUSER:
                checkbox.removeAttr("disabled");
                label.css("opacity", 1);
                break;
            case AssignmentType.ALL:
                checkbox.removeAttr("disabled");
                label.css("opacity", 1);
                break;
        }

    }


    /**
     * @summary Read from popover to perform filter on user list in task to user mode only.
     * Reactive Var :
     *
     *  - Set AssignmentReactiveVars.SelectedPeopleNeed
     *  - Set AssignmentReactiveVars.SelectedTimeSlot
     *
     * @locus Anywhere
     * @returns {timeSlot|null}
     */
    static readSelectedPeopleNeedAndTimeSlotFromPopover(event, isAssigned) {
        var target = $(event.target);

        var peopleNeedId;
        if (target.data('_id')) {
            peopleNeedId = target.data('_id');
        } else {
            peopleNeedId = $(target.parents(".peopleNeed")).data('_id');
        }

        var task, ret;
        if (isAssigned) {
            task = Tasks.findOne({
                timeSlots: {
                    $elemMatch: {
                        peopleNeededAssigned: {
                            $elemMatch: {
                                _id: peopleNeedId
                            }
                        },
                    }
                }
            });
            ret = PeopleNeedService.getAssignedPeopleNeedByIdAndTask(peopleNeedId, task);
        } else {
            task = Tasks.findOne({
                timeSlots: {
                    $elemMatch: {
                        peopleNeeded: {
                            $elemMatch: {
                                _id: peopleNeedId
                            }
                        },
                    }
                }
            });
            ret = PeopleNeedService.getPeopleNeedByIdAndTask(peopleNeedId, task);
        }

        var peopleNeeded = ret.peopleNeed;
        var timeSlot = TimeSlotService.getTimeSlot(task, ret.timeSlotId);
        AssignmentReactiveVars.SelectedPeopleNeed.set(peopleNeeded);
        AssignmentReactiveVars.SelectedTimeSlot.set(timeSlot);
    }
}

