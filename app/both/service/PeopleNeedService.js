import {TimeSlotService} from "./TimeSlotService"
import {ValidationService} from "./ValidationService"

export class PeopleNeedService {

        /**
         * @memberOf PeopleNeedService
         * @summary For a give timeSlot, user peopleNeedHunter._id to get the index of the people need.
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {peopleNeed} peopleNeedHunter
         * @returns {peopleNeed|null}
         */
        static getPeopleNeedIndex(timeSlot, peopleNeedHunter) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                if (peopleNeed._id === peopleNeedHunter._id) {
                    found = index;
                }
            });
            return found;


        }

        static getPeopleNeedByIndex(timeSlot, peopleNeedId) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                if (peopleNeed._id === peopleNeedId) {
                    found = peopleNeed;
                }
            });
            return found;


        }

        /**
         * @memberOf PeopleNeedService
         * @summary Find people need and time slot id for a given task by people need id.
         * @locus Anywhere
         * @param {MongoId} peopleNeedId
         * @param {Task} task
         * @returns {{timeSlotId: {MongoId}, peopleNeed: {PeopleNeed}}}
         */
        static getPeopleNeedByIdAndTask(peopleNeedId,task) {
            var found;
            var timeSlotIdFound;

            task.timeSlots.forEach(timeSlot => {
                timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                    if (peopleNeed._id === peopleNeedId) {
                        found = peopleNeed;
                    }
                });
                if(!timeSlotIdFound && found)
                    timeSlotIdFound = timeSlot._id;

            });

            return {
                timeSlotId: timeSlotIdFound,
                peopleNeed: found
            };


        }



        /**
         * @memberOf PeopleNeedService
         * @summary For a given timeSlot, user peopleNeedHunter._id to get the people need.
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {peopleNeed} peopleNeedHunter
         * @returns {peopleNeed|null}
         */
        static getAssignedPeopleNeedIndex(timeSlot, peopleNeedHunter) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                if (peopleNeed._id === peopleNeedHunter._id) {
                    found = index;
                }
            });
            return found;


        }


        /**
         * @memberOf PeopleNeedService
         * @summary Assign peopleNeeded.assignedUserId
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {Task} task
         * @param {TimeSlot} timeSlot
         * @param {PeopleNeed} peopleNeed
         * @param {MongoId} userId
         */
        static assignedPeopleNeeded(task, timeSlot, peopleNeed, userId) {
            console.info("PeopleNeedService.assignedPeopleNeeded for task", task, "when", timeSlot, "and need", peopleNeed);
            //we have the task
            var timeSlots = task.timeSlots; //all its timeslots

            var timeSlotToUpdateIndex = TimeSlotService.getTimeSlotIndex(task, timeSlot._id);
            var timeSlotToUpdate = timeSlots[timeSlotToUpdateIndex];
            var peopleNeedToRemoveIndex = PeopleNeedService.getPeopleNeedIndex(timeSlotToUpdate, peopleNeed);

            return Tasks.update({_id: task._id},
                {
                    $set: {
                        ["timeSlots."+timeSlotToUpdateIndex+".peopleNeeded."+peopleNeedToRemoveIndex+".assignedUserId"] : userId
                    }
                });

        }

        /**
         * @memberOf PeopleNeedService
         * @summary Check if people need match user (userId or teamId and/or skills). True is user match people need.
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {Task} task
         * @param {TimeSlot} timeSlot
         * @param {PeopleNeed} peopleNeed
         * @param {User} user
         * @return {boolean}
         */
        static checkPeopleNeedForUser(task, timeSlot, peopleNeed, user) {
            console.info("PeopleNeedService.checkPeopleNeed for task", task, "when", timeSlot, "and need", peopleNeed, "for user", user);


            if (peopleNeed.userId) {
                if (peopleNeed.userId === user._id) {
                    return true;
                } else {
                    return false;
                }
            } else if (peopleNeed.teamId) {

                if (!_.contains(user.teams, peopleNeed.teamId)) {
                    return false;
                }
            }
            if (peopleNeed.skills.length == 0) return true;

            var userHasAllSkills = true;
            _.each(peopleNeed.skills, (skill) => {
                if (!_.contains(user.skills, skill)) {
                    userHasAllSkills = false;
                }
            });
            return userHasAllSkills;
        }

        /**
         * @memberOf PeopleNeedService
         * @summary Find people need by _id from time slot
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {TimeSlot} timeSlot
         * @param {MongoId} peopleNeed
         * @return {PeopleNeed}
         */
        static getPeopleNeedById(timeSlot, _id) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                if (peopleNeed._id === _id) {
                    found = peopleNeed;
                }
            });
            return found;
        }

        /**
         * @memberOf PeopleNeedService
         * @summary Set peopleNeeded.assignedUserId to null
         * @locus Anywhere
         * @param {Task} task
         * @param {timeSlot} timeSlot
         * @param {PeopleNeed} peopleNeed
         * @param {MongoId} userId
         */
        static restorePeopleNeed(task, timeSlot, peopleNeed, userId) {
            console.info("PeopleNeedService.restorePeopleNeed for task", task, "when", timeSlot, "and need", peopleNeed);
            //we have the task
            var timeSlots = task.timeSlots; //all its timeslots

            var updatedTimeslot = timeSlot;

            var timeSlotToUpdateIndex = TimeSlotService.getTimeSlotIndex(task, timeSlot._id);
            var timeSlotToUpdate = timeSlots[timeSlotToUpdateIndex];

            var peopleNeedToRemoveIndex = PeopleNeedService.getAssignedPeopleNeedIndex(timeSlotToUpdate, peopleNeed);

            Tasks.update({_id: task._id},
                {
                    $set: {
                        ["timeSlots."+timeSlotToUpdateIndex+".peopleNeeded."+peopleNeedToRemoveIndex+".assignedUserId"] : null
                    }
                });
        }

        static removePeopleNeed(task, timeSlot, peopleNeed){
            console.info("PeopleNeedService.removePeopleNeed for task", task, "when", timeSlot, "and need", peopleNeed);
            //we have the task
            var timeSlots = task.timeSlots; //all its timeslots

            var timeSlotToUpdateIndex = TimeSlotService.getTimeSlotIndex(task, timeSlot._id);
            var timeSlotToUpdate = timeSlots[timeSlotToUpdateIndex];
            var peopleNeedToRemoveIndex = PeopleNeedService.getPeopleNeedIndex(timeSlotToUpdate, peopleNeed);
            //remove peopleNeed assigned
            timeSlotToUpdate.peopleNeeded.splice(peopleNeedToRemoveIndex, 1);

            Tasks.update({_id: task._id},
                {
                   $set: {
                       ["timeSlots."+timeSlotToUpdateIndex+".peopleNeeded"] : timeSlotToUpdate.peopleNeeded
                       //$pull doesn't work with nested array (["timeSlots."+timeSlotToUpdateIndex+".peopleNeeded"])
                   }
                });

            //Tasks.update({_id: task._id}, {
            //    $pull: {
            //        ["timeSlots." + timeSlotToUpdateIndex + ".peopleNeeded"]: {_id: peopleNeed._id}
            //    }
            //});
        }


        static schemaCustomPeopleNeed(schemaContext){
            if (schemaContext.isUpdate) {
                var task = Tasks.findOne(schemaContext.docId);

                if(schemaContext.key.indexOf("assignedUserId") !== -1){
                    //assignedUserId : non editable sauf si READY
                    if(schemaContext.value !== null && task.timeSlotValidation.currentState !== ValidationState.READY) {
                        //Mongo doesn't support $pull with nested arrays meaning that a $set on the whole array is used.
                        //All people need are updated when one is deleted causing a problem for all people need already assigned
                        //below we check that the 'new' assignedUserId is the same as the 'old' one (we can update as long as we don't modify it....)
                        //TODO avec ca on peut mettre à jour les autres fields (userId, skills, teamId) d'un people need deja affecté sans pour autant changer le assignedUserId
                        //est ce qu'on s'en fout ? Ca ne pose de probleme que si on desaffecte le assignedUserId, le peopleNeed sera de nouveau dispo mais
                        //avec des specs qui n'étaient pas les premieres mises. Un moindre mal...
                        var split = schemaContext.key.split(".");
                        var oldValue = Tasks.findOne(schemaContext.docId).timeSlots[split[1]].peopleNeeded[split[3]].assignedUserId;
                        if(oldValue !== schemaContext.value)
                            return "updateNotAllowed"
                    }
                } else {
                    //array, userId, skills, teamId : non editable si pas OPEN ou REFUSED
                    if(!ValidationService.isUpdateAllowed(task.timeSlotValidation.currentState))
                        return "updateNotAllowed"
                }

            }

        }
    }
