import {TimeSlotService} from "./TimeSlotService"

export class AvailabilityService {
  /**
   * @memberOf AvailabilityService
   * @summary For a giver user get availability which start at least before param start and end at most after end param.
   * @locus Anywhere
   * @param {User} user
   * @param {Date}start
   * @param {Date} end
   * @returns {availability|null}
   */
  static getSurroundingAvailability(user, start, end) {
    console.info("AvailabilityService.getAvailability start:", start, "end", end, "for user", user);
    var found;
    var start = new moment(start);
    if (typeof end === "undefined") var end = new moment(start);
    else
      var end = new moment(end);
    var end = new moment(end);
    user.availabilities.forEach(availability => {
      var availabilityStart = new moment(availability.start);
      var availabilityEnd = new moment(availability.end);
      if (( availabilityStart.isBefore(start) || availabilityStart.isSame(start))
        && (availabilityEnd.isAfter(end) || availabilityEnd.isSame(end) )) {
        found = availability;
        return false;
      }
    });
    return found;
  }

  /**
   * @memberOf AvailabilityService
   * @summary For a giver user get availability index which start at least before param start and end at most after end param.
   * @locus Anywhere
   * @param {User} user
   * @param {Date}start
   * @param {Date} end
   * @returns {availabilityId|null}
   */
  static getIndexOfSurroundingAvailability(user, start, end) {
    console.info("AvailabilityService.getAvailability start:", start, "end", end, "for user", user);
    var found = null;
    var start = new moment(start);
    if (typeof end === "undefined") var end = new moment(start);
    else
      var end = new moment(end);
    var end = new moment(end);
    user.availabilities.forEach(function (availability, index, availabilities) {
      var availabilityStart = new moment(availability.start);
      var availabilityEnd = new moment(availability.end);
      if (( availabilityStart.isBefore(start) || availabilityStart.isSame(start))
        && (availabilityEnd.isAfter(end) || availabilityEnd.isSame(end) )) {
        found = index;
        return false;
      }
    });
    return found;
  }

  /**
   * @memberOf AvailabilityService
   * @summary For a giver user splice and merge availabilities in order to make him unavailable between start and end params.
   * @locus Anywhere
   * @param {User} user
   * @param {Date}start
   * @param {Date} end
   */
  static removeAvailabilities(user, start, end) {
    console.info("AvailabilityService.splitAvailabilities for user", user, " from", start, "to", end);
    var availabilities = user.availabilities;

    var availabilityIndex = AvailabilityService.getIndexOfSurroundingAvailability(user, start, end);
    //remove old availability
    var availability = availabilities.splice(availabilityIndex, 1)[0];
    //add new availabilities and prevent creating a 0minutes availability
    if (!new moment(availability.start).isSame(new moment(start)))
      availabilities.push({
        start: availability.start,
        end: start
      });
    if (!new moment(end).isSame(new moment(availability.end)))
      availabilities.push({
        start: end,
        end: availability.end
      });

    Meteor.users.update({_id: user._id}, {$set: {availabilities: availabilities}});

  }

  /**
   * @memberOf AvailabilityService
   * @summary Read the name...
   * @locus Anywhere
   * @param {User} user
   * @param {Date}start
   * @returns {availability|null}
   */
  static getIndexOfAvailabilityWhichEndWhenParamStart(user, start) {
    console.info("AvailabilityService.getIndexOfAvailabilityWhichEndWhenParamStart start:", start, "for user", user);
    var found;
    var start = new moment(start);

    user.availabilities.forEach(function (availability, index, availabilities) {
      var availabilityEnd = new moment(availability.end);
      if (availabilityEnd.isSame(start)) {
        found = index;
        return false;
      }
    });
    return found;
  }

  /**
   * @memberOf AvailabilityService
   * @summary Read the name...
   * @locus Anywhere
   * @param {User} user
   * @param {Date}start
   * @returns {availabilityId|null}
   */
  static getIndexOfAvailabilityWhichStartWhenParamEnd(user, end) {
    console.info("AvailabilityService.getIndexOfAvailabilityWhichStartWhenParamEnd end:", end, "for user", user);
    var found;
    var end = new moment(end);

    user.availabilities.forEach(function (availability, index, availabilities) {
      var availabilityStart = new moment(availability.start);
      if (availabilityStart.isSame(end)) {
        found = index;
        return false;
      }
    });
    return found;
  }

  /**
   * @memberOf AvailabilityService
   * @summary For a giver user add and merge availabilities in order to make him available between start and end params
   * @description If existing availabilities will be overlapped by start-end, they are deleted, if existing availabilities starts
   * when end param is or ends when start param is, existing availability will be merged with start-date.
   * @locus Anywhere
   * @param {User} user
   * @param {Date}start
   * @param {Date} end
   */
  static addAvailabilities(user, start, end) {

    //clean availabilities that will be include between start and end
    var availabilities = Meteor.users.findOne(user._id).availabilities;
    var availabilityToRemove = []; //will store all indexes to remove
    availabilities.forEach((availability, index) => {
      if (TimeSlotService.isOverlapping(availability.start, availability.end, start, end)) {
        availabilityToRemove.push(index);
      }
    });

    while (availabilityToRemove.length !== 0) {
      var lastIndex = _.last(availabilityToRemove); //we need to iterate in reverse to delete higher index firsts
      availabilityToRemove.pop();
      availabilities.splice(lastIndex, 1);
    }


    Meteor.users.update({_id: user._id}, {$set: {availabilities: availabilities}});


    var term = AssignmentTerms.findOne({
      teams: {$in: user.teams},
      start: {$lte: start},
      end: {$gte: end},
      $or: [
        {
          assignmentTermPeriods: []
        },
        {
          assignmentTermPeriods: {
            $elemMatch: {
              start: {$lte: start},
              end: {$gt: end}
            }
          }
        }
      ]
    });

    if (term) { //availability is either in a term or in a term's period if term has periods
      AvailabilityService.restoreAvailabilities(Meteor.users.findOne(user._id), start, end);
    } else { //remove availability parts that are not part of an assignment term periods
      term = AssignmentTerms.findOne({
        teams: {$in: user.teams},
        start: {$lte: start},
        end: {$gte: end},
      });

      //lets say an availabity start will always match a period start
      //(just because UI will never allow it)

      start = new moment(start);
      end = new moment(end);

      //we have the term, let's find the period
      var period = _.find(term.assignmentTermPeriods, function (period) {
        return new moment(period.start).isSame(start);
      });

      //let's assume that period end is before availability end
      //we had the whole period has it
      AvailabilityService.restoreAvailabilities(Meteor.users.findOne(user._id), period.start, period.end);

      //we know need to know where the availabilty ended
      var periods = _.filter(term.assignmentTermPeriods, function (period) {
        return new moment(period.start).isAfter(start) && //strictly after period start (to not add the same as previously)
          ( new moment(period.end).isBefore(end) || new moment(period.end).isSame(end) );
      });

      periods.forEach(period => {
        AvailabilityService.restoreAvailabilities(Meteor.users.findOne(user._id), period.start, period.end);
      });
    }
  }

  /**
   * @memberOf AvailabilityService
   * @summary For a giver user add and merge availabilities in order to make him available between start and end params (un-assignment workflow)
   * @description if an existing availability starts when end param is or ends when start param is, existing availability will
   * be merge with start-end params. This function does not manage overlapping availability. See AvailabilityService.addAvailabilities
   * if needed.
   * @locus Anywhere
   * @param {User} user
   * @param {Date}start
   * @param {Date} end
   */
  static restoreAvailabilities(user, start, end) {
    console.info("AvailabilityService.restoreAvailabilities for user", user, " from", start, "to", end);
    var availabilities = user.availabilities;
    var previousAvailability, nextAvailability;

    //if exits, get direct previous availabilty
    var previousAvailabilityIndex = AvailabilityService.getIndexOfAvailabilityWhichEndWhenParamStart(user, start);

    //if exits, get direct next availabilty
    var nextAvailabilityIndex = AvailabilityService.getIndexOfAvailabilityWhichStartWhenParamEnd(user, end);


    //if possible

    //remove old availability(ies)
    if (typeof previousAvailabilityIndex !== "undefined") {
      previousAvailability = availabilities.splice(previousAvailabilityIndex, 1)[0];
    }
    if (typeof nextAvailabilityIndex !== "undefined") {
      nextAvailability = availabilities.splice(nextAvailabilityIndex, 1)[0];
    }

    var newAvailability = {};

    //merge availability
    if (previousAvailability) {
      newAvailability.start = previousAvailability.start;
    } else {
      newAvailability.start = start;
    }
    if (nextAvailability) {
      newAvailability.end = nextAvailability.end;
    } else {
      newAvailability.end = end;
    }

    availabilities.push(newAvailability);

    Meteor.users.update({_id: user._id}, {$set: {availabilities: availabilities}});

  }

  /**
   * @memberOf AvailabilityService
   * @summary Proxy for TimeSlotService.getTimeSlotByStart
   * @locus Anywhere
   * @param {Array<Availability>} availabilities
   * @param {Date}start
   * @return {timeSlot|null}
   */
  static getAvailabilityByStart(availabilities, start) {
    return TimeSlotService.getTimeSlotByStart(availabilities, start);
  }

  /**
   * @memberOf AvailabilityService
   * @summary Return true if user is available between start and end params.
   * @locus Anywhere
   * @param {Array<Availability>} availabilities
   * @param {Date}start
   * @param {Date} end
   * @return {boolean}
   */
  static checkUserAvailabilty(user, start, end) {
    console.info("AvailabilityService.checkUserAvailabilty for user", user, " from", start, "to", end);
    var availabilities = user.availabilities;

    var availabilityIndex = AvailabilityService.getIndexOfSurroundingAvailability(user, start, end);

    if (availabilityIndex == null) {
      return false;
    }
    return true;


  }
}
