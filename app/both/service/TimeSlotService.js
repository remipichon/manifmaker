import {ValidationService} from "./ValidationService"

export class TimeSlotService {


  /**
   * @memberOf TimeSlotService
   * @summary For a given task, get time slot by _id
   * @locus Anywhere
   * @param taskId or Task instance
   * @param timeSlotId
   * @returns {TimeSlot|null}
   */
  static getTimeSlot(task, timeSlotId) {
    if (typeof task !== "object")
      task = Tasks.findOne(task);
    var found;
    task.timeSlots.forEach(timeSlot => {
      if (timeSlot._id === timeSlotId) {
        found = timeSlot;//TimeSlotService.read(timeSlot);
        return false;
      }
    });
    return found;
  }

  /**
   * @memberOf TimeSlotService
   * @summary For a given task, get time slot index by _id
   * @locus Anywhere
   * @param task
   * @param timeSlotId
   * @returns {MongoId|null}
   */
  static getTimeSlotIndex(task, timeSlotId) {
    var found;
    var i = 0;
    task.timeSlots.forEach(timeSlot => {
      if (timeSlot._id === timeSlotId) {
        found = i;
        return false;
      }
      i++;
    });
    return found;
  }

  static getTimeResourcesStartingBetween(availabilitiesOrTimeSlotsOrAssignments, start, end) {
    return TimeSlotService.getTimeResourcesByDates(availabilitiesOrTimeSlotsOrAssignments,start, end)
  }

  static getTimeResourcesByStart(availabilitiesOrTimeSlotsOrAssignments, start) {
    return TimeSlotService.getTimeResourcesByDates(availabilitiesOrTimeSlotsOrAssignments,start)
  }

  /**
   * @memberOf TimeSlotService
   * @summary Get of all item of availabilitiesOrTimeSlotsOrAssignments whose start dates matches given start or is between start and end if given
   * @locus Anywhere
   * @param availabilitiesOrTimeSlotsOrAssignments {Array<Availability|TimeSlot|Assignment>}
   * @param start {Date}
   * @param end {Date} if not defined, will look for time resource whose start exactly matches given start
   * @returns {Array<TimeSlot> | TimeSlot  | null}
   */
  static getTimeResourcesByDates(availabilitiesOrTimeSlotsOrAssignments, start, end = null) {
    var founds = [];
    var startDate = new moment(new Date(start));
    let endDate;
    if (end) endDate = new moment(new Date(end));

    availabilitiesOrTimeSlotsOrAssignments.forEach(thing => {
      //we only take the first matching timeSlot, le css ne sait aps encore gerer deux data timeSlot sur un meme calendar timeSlot
      var thingStartDate = new moment(new Date(thing.start));
      var thingEndDate = new moment(new Date(thing.end));
      if (!endDate) {
        if (startDate.isSame(thingStartDate)) {
          founds.push(thing);
        }
      } else {
        //startDate <= thingDate < date + accuracy
        if (
          (startDate.isSame(thingStartDate) || startDate.isBefore(thingStartDate))
          &&
          thingStartDate.isBefore(endDate)
        ) {
          founds.push(thing);
        }
      }

      //is start midnight ? we should retrieve timeslot which started 'yesterday' and finish 'today' or later
      if (startDate.hour() === 0 && startDate.minute() === 0) {
        //=> is thing.start lt start and thing.end gt start ?
        if (thingStartDate.isBefore(startDate) && thingEndDate.isAfter(startDate)) {
          //=> => thing is a match
          founds.push(thing);
        }
      }
    });

    return founds;
  }


  /**
   * @memberOf TimeSlotService
   * @summary Get time slot by _id over all the Tasks (not very effective)
   * @locus Anywhere
   * @param timeSlotId {MondoId}
   * @returns {{timeSlot: *, task: *}}
   */
  static getTimeSlotById(timeSlotId) {
    var found;
    var taskFound;
    Tasks.find().fetch().forEach(task => {
      task.timeSlots.forEach(timeSlot => {
        if (timeSlot._id === timeSlotId) {
          found = timeSlot;//TimeSlotService.read(timeSlot);
        }
      });
      if (!taskFound && found)
        taskFound = task;

    });


    return {
      timeSlot: found,
      task: taskFound
    };
  }

  /**
   * @memberOf TimeSlotService
   * @summary Give a people need _id, looks over all Tasks to find and return people need, time slot and task
   * @locus Anywhere
   * @param peopleNeedId {MondoId}
   * @returns {{timeSlot: TimeSlot, task: Task, peopleNeed: PeopleNeed}}
   */
  static getTaskAndTimeSlotAndPeopleNeedByPeopleNeedId(peopleNeedId) {
    var timeSlotFound;
    var taskFound;
    var peopleNeedFound;
    Tasks.find().fetch().forEach(task => {
      // if (!taskFound)
      task.timeSlots.forEach(timeSlot => {
        //   if (!timeSlotFound)
        timeSlot.peopleNeeded.forEach(peopleNeed => {
          //       if (!peopleNeed)
          if (peopleNeed._id === peopleNeedId) {
            peopleNeedFound = peopleNeed;
          }
        });
        if (!timeSlotFound && peopleNeedFound)
          timeSlotFound = timeSlot;
      });
      if (!taskFound && timeSlotFound)
        taskFound = task;
    });

    return {
      timeSlot: timeSlotFound,
      task: taskFound,
      peopleNeed: peopleNeedFound
    };
  }

  static isOverlapping(startA, endA, startB, endB) {
    //overlapp (StartA <= EndB) and (EndA >= StartB)
    //proof http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap

    return new moment(startA).isBefore(endB) &&
      new moment(endA).isAfter(startB)
  }


  static areTimeSlotOverlappingWithQuery(timeSlots, start, end, queryTimeSlotId) {
    var okGod = true;
    timeSlots.forEach(_.bind(function (timeSlot) {
      if (!okGod || timeSlot._id === queryTimeSlotId)
        return;

      if (TimeSlotService.isOverlapping(start, end, timeSlot.start, timeSlot.end))
        okGod = false;

    }, this));

    return okGod
  }

  static areArrayStartEndOverlappingStartDate(arrayOfStartEnd, start, end) {
    var areOverlapping = false;
    arrayOfStartEnd.forEach(_.bind(function (startEnd) {
      if (areOverlapping)
        return;

      if (TimeSlotService.isOverlapping(start, end, startEnd.start, startEnd.end))
        areOverlapping = true;

    }, this));

    return areOverlapping
  }

  static schemaCustomTimeSlot(schemaContext) {
    //TODO $pull request doesn't use schema.custom...
    if (schemaContext.isUpdate) {
      var task = Tasks.findOne(schemaContext.docId);
      if (!ValidationService.isUpdateAllowed(task.timeSlotValidation.currentState)) {
        return "updateNotAllowed"
      }
    }

  }

  static timeSlotWithinAssignmentTerm(start, end) {
    return AssignmentTerms.findOne({
      $and: [
        {
          start: {
            $lte: start.toDate()
          }
        },
        {
          end: {
            $gte: start.toDate()
          }
        }
      ],
      $or: [
        {
          assignmentTermPeriods: {
            $size: 0
          }
        },
        {
          assignmentTermPeriods: {
            $elemMatch: {
              $and: [
                {
                  start: {
                    $lte: start.toDate()
                  }
                },
                {
                  end: {
                    $gte: end.toDate()
                  }
                }
              ],
            }
          }
        }
      ]
    });
  }
}
