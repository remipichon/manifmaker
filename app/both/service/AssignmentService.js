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
         * @returns {timeSlot|null}
         */
        static getAssignmentByStart(assignment, start) {
            return TimeSlotService.getTimeSlotByStart(assignment, start);
        }


    }