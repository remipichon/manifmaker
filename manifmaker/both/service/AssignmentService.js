import {TimeSlotService} from "./TimeSlotService"
import {PeopleNeedService} from "./PeopleNeedService"

export class AssignmentService {

        /**
         * @memberOf AssignmentService
         * @summary Get time slot by _id from a task
         * @locus Anywhere
         * @param task
         * @param timeSlotId
         * @returns {timeSlot|null}
         */
        static getTimeSlot(task, timeSlotId) {
            for (var timeSlot in task.timeSlots) {
                if (timeSlot._id === timeSlotId) {
                    return timeSlot;
                }
            }
            return null;
        }

        /**
         * @memberOf AssignmentService
         * @summary Proxy for TimeSlotService.getTimeSlotByStart
         * @locus Anywhere
         * @param assignment
         * @param start
         * @param several
         * @returns {timeSlot|null}
         */
        static getAssignmentByStart(assignment, start, several) {
            return TimeSlotService.getTimeSlotByStart(assignment, start, several);
        }


        /**
         * @memberOf AssignmentService
         * @summary Read from popover to perform filter on user list in task to user mode only.
         * Reactive Var :
         *  - Set AssignmentReactiveVars.SelectedPeopleNeed
         *  - Set AssignmentReactiveVars.SelectedTimeSlot
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
        if(isAssigned){
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