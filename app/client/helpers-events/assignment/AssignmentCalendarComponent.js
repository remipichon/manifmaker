import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AssignmentServiceClient} from "../../../client/service/AssignmentServiceClient"
import {AssignmentReactiveVars} from "./AssignmentReactiveVars"
import {TimeSlotCalendarServiceClient} from "../../../client/service/TimeSlotCalendarServiceClient"


class AssignmentCalendarComponent extends BaseCalendarComponent {
    constructor() {
        super();
        this.peopleNeedAssignedClick = 0; //to double click purpose..
    }


    labelSkills() {
        return Skills.findOne({_id: this.currentData().toString()}).label;
    }

    userName() {
        return Users.findOne({_id: this.currentData().userId}).name;
    }

    displayAssignedUser() {
        return Users.findOne({_id: this.currentData().assignedUserId}).name;
    }

    teamName() {
        return Teams.findOne({_id: this.currentData().teamId}).name;
    }

    //works for .heure et .quart d'heure
    isSelected(date, timeHours) {
        if (this.getCalendarDateTime(date, timeHours, 0).isSame(AssignmentReactiveVars.SelectedDate.get())) {
            return "selected"
        }
        return ""
    }


    timeSlot(date, timeHours, idTask) {
        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours);
        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

        var data = {},baseOneHourHeight,accuracy,end,start,duration,height,founded;

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                var user = AssignmentReactiveVars.SelectedUser.get() == null ? null : Users.findOne(AssignmentReactiveVars.SelectedUser.get());
                if (user === null) return [];


                var availabilityFound = AvailabilityService.getAvailabilityByStart(user.availabilities, startCalendarTimeSlot);
                var assignmentFound = AssignmentService.getAssignmentByStart(user.assignments, startCalendarTimeSlot);

                if (availabilityFound === null && assignmentFound === null) return [];
                if (availabilityFound !== null && assignmentFound !== null) {
                    console.error("Calendar.timeSlot : error while displaying user info, both availability and assignment has been found. \nuser", user, " => availability", availabilityFound, " and assignment", assignmentFound);
                    return [];
                }

                baseOneHourHeight = 40;
                accuracy = AssignmentCalendarDisplayedAccuracy.findOne().accuracy;

                if (availabilityFound !== null) {
                    data.state = "available";
                    data.name = user.name;

                    founded = availabilityFound;
                } else if (assignmentFound !== null) {
                    data.name = assignmentFound.taskName;
                    data.state = "affecte";

                    founded = assignmentFound;

                    data.taskName = founded.taskName;
                }

                _.extend(data, founded);
                data.height = TimeSlotCalendarServiceClient.computeTimeSlotAvailabilityHeight(founded,startCalendarTimeSlot) + "px";

                break;
            case AssignmentType.TASKTOUSER:
                var task = AssignmentReactiveVars.SelectedTask.get() == null ? null : Tasks.findOne(AssignmentReactiveVars.SelectedTask.get());
                if (!task) return [];

                var result = TimeSlotCalendarServiceClient.computeTimeSlotData(task,startCalendarTimeSlot);
                if(!result) return [];
                else data = result;

                break;
            case AssignmentType.ALL:
                return [];
        }


        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }


    peopleNeededNonAssigned(){
        return _.reject(this.currentData().peopleNeeded,function(peopleNeed){
            return peopleNeed.assignedUserId !== null;
        });
    }

    peopleNeededAssigned(){
        return _.reject(this.currentData().peopleNeeded,function(peopleNeed){
            return peopleNeed.assignedUserId === null;
        });
    }

    peopleNeedAssignedOnClick(event) {
        event.stopPropagation();
        this.peopleNeedAssignedClick++;
        if (this.peopleNeedAssignedClick == 1) {
            setTimeout(_.bind(function () {
                if (this.peopleNeedAssignedClick == 1) {
                    sAlert.info('Double click to perform remove assignment')
                } else {
                    AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
                }
                this.peopleNeedAssignedClick = 0;
            }, this.currentData()), 300);
        }

    }

    peopleNeedOnClick(event){
        AssignmentReactiveVars.SelectedPeopleNeed.set(this.currentData());
        AssignmentReactiveVars.SelectedTimeSlot.set(TimeSlotService.getTaskAndTimeSlotAndPeopleNeedByPeopleNeedId(this.currentData()._id).timeSlot);
        AssignmentServiceClient.taskToUserPerformUserFilter();
    }

    //taskToUser (we click on a complete task time slot)
    creanOnClick() {

        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                console.error("Template.assignmentCalendar.events.click .creneau", "User can't normally click on this kind of element when in userToTask");
                return;
                break;
            case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                break;
        }
    }

    //userToTask (we click on a creneau, not on the entire availability)
    quartHeureOnClick(event) {
        //TODO gerer le double click pour la desaffectation

        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected availability slot

                //what time did we click on ?
                var $target = $(event.target);

                var selectedDate = null;
                if (typeof $target.attr("hours") !== "undefined") {
                    selectedDate = new moment(new Date($target.attr("hours")));
                } else if (typeof $target.attr("quarter") !== "undefined") {
                    selectedDate = new moment(new Date($target.attr("quarter")));
                }
                AssignmentReactiveVars.SelectedDate.set(selectedDate);


                var userId = AssignmentReactiveVars.SelectedUser.get()._id;
                var user = Users.findOne({_id: userId});
                var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);

                if (typeof availability === "undefined") {
                    console.error("Template.assignmentCalendar.events.click .heure, .quart_heure", "User can't normally click on this kind of element when in userToTask");
                    return;
                }
                AssignmentReactiveVars.SelectedAvailability.set(availability);


                /*
                 ** Skills filter
                 User is eligible for a task if he has all skills for at least one task' people need's skills.
                 The query looks like something like this : 'foreach timeSlot foreach peopleNeeded foreach skills' = at least user.skills
                 ** Availabilities filter :
                 Task whose have at least one timeSlot (to begin, just one) as
                 user.selectedAvailabilities.start <= task.timeslot.start <= selectedDate and
                 selectedDate <=  task.timeslot.end <=  user.Dispocorrespante.end
                 Foreach task's time slot, we need a matching skills and a matching availability
                 */

                var newFilter = {
                    $or: [ //$or does't work on $elemMatch with miniMongo, so we use it here
                        { //userId filter
                            timeSlots: {
                                $elemMatch: {
                                    //skills filter
                                    peopleNeeded: {
                                        $elemMatch: {
                                            userId: user._id
                                        }
                                    },
                                    //availabilities filter
                                    start: {$gte: availability.start, $lte: selectedDate.toDate()},
                                    end: {$gt: selectedDate.toDate(), $lte: availability.end}
                                },
                            }
                        },
                        {
                            $or: [ //either we match skills requirement or there is no skills requirement (and we don't care)
                                { //skills filter
                                    timeSlots: {
                                        $elemMatch: {
                                            //skills filter
                                            peopleNeeded: {
                                                $elemMatch: {
                                                    skills: {
                                                        $elemMatch: {
                                                            $in: user.skills
                                                        }
                                                    },
                                                    teamId: {
                                                        $in: (user.teams.length === 0)? [null] : user.teams
                                                    }
                                                }
                                            },
                                            //availabilities filter
                                            start: {$gte: availability.start, $lte: selectedDate.toDate()},
                                            end: {$gt: selectedDate.toDate(), $lte: availability.end}
                                        }
                                    }
                                },
                                {//no-skills filter
                                    timeSlots: {
                                        $elemMatch: {
                                            //skills filter
                                            peopleNeeded: {
                                                $elemMatch: {
                                                    skills: { // $eq : [] doesn't work with miniMongo, here is a trick
                                                        $not: {
                                                            $ne: []
                                                        }
                                                    },
                                                    teamId: {
                                                        $in: user.teams
                                                    }
                                                }
                                            },
                                            //availabilities filter
                                            start: {$gte: availability.start, $lte: selectedDate.toDate()},
                                            end: {$gt: selectedDate.toDate(), $lte: availability.end}
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                };
                //aggregate is not supported by mini mongo


                AssignmentReactiveVars.TaskFilter.set(newFilter);
                break;
            case
            AssignmentType.TASKTOUSER:
                //only display users that have at least one availability matching the selected time slot
                //we let the event bubbles to the parent
                return [];
        }
    }


}
AssignmentCalendarComponent.register("AssignmentCalendarComponent");





