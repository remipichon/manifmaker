import {BaseCalendarComponent} from "../common/BaseCalendarComponent"
import {AssignmentService} from "../../../both/service/AssignmentService"
import {AvailabilityService} from "../../../both/service/AvailabilityService"
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {AssignmentServiceClient} from "../../../client/service/AssignmentServiceClient"
import {AssignmentReactiveVars} from "./AssignmentReactiveVars"
import {CalendarServiceClient} from "../../../client/service/CalendarServiceClient"


class AssignmentCalendarComponent extends BaseCalendarComponent {
    constructor() {
        super();
        this.peopleNeedAssignedClick = 0; //to double click purpose..
        this.isPopOverOpened = new ReactiveVar(false);
        this.activeTimeSlot = new ReactiveVar(0);
    }


    events() {
        return super.events().concat({
            "click .popOver .peopleNeed": this.peopleNeedOnClick,
            "click .popOver .peopleNeed.assigned": this.peopleNeedAssignedOnClick,
            "click .creneau": this.openPopOver,
            "click .calendar": this.closePopOver,
            "click .close-popover": this.closePopOver,
            "click .popOver": this.stopPropa,
            "click .heure": this.heureOnClick
        })
    }



    getActiveTimeSlot(){
        return this.activeTimeSlot.get();
    }
    popOverIsOpen(){
        return this.isPopOverOpened.get();
    }
    labelSkills() {
        return Skills.findOne({_id: this.currentData().toString()}).label;
    }

    userName() {
        return Meteor.users.findOne({_id: this.currentData().userId}).username;
    }

    displayAssignedUser() {
        var assignment = Assignments.findOne({peopleNeedId:this.currentData()._id})
        return Meteor.users.findOne({_id: assignment.userId}).username;
    }

    teamName() {
        return Teams.findOne({_id: this.currentData().teamId}).name;
    }

    enableAction(date, timeHours){
        var startDate = this.getCalendarDateTime(date, timeHours, 0);
        var endDate = new moment(startDate).add(1,"hour");

        if (AssignmentTerms.findOne({
                $and:[
                    {
                        start: {
                            $lte: startDate.toDate()
                        }
                    },
                    {
                        end: {
                            $gte: endDate.toDate()
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
                                            $lte: startDate.toDate()
                                        }
                                    },
                                    {
                                        end: {
                                            $gte: endDate.toDate()
                                        }
                                    }
                                ],
                            }
                        }
                    }
                ]
            })
        )
            return true;

        return false;

    }

    //works for .heure et .quart d'heure
    isSelected(date, timeHours) {
        if (this.getCalendarDateTime(date, timeHours, 0).isSame(AssignmentReactiveVars.SelectedDate.get())) {
            return "selected"
        }
        return ""
    }

    isTaskToUser(){
        return AssignmentReactiveVars.CurrentAssignmentType.get() === AssignmentType.TASKTOUSER;
    }


    timeSlot(date, timeHours, idTask) {
        var minutes = this.currentData().quarter;
        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours,minutes);
        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

        var data = {},baseOneHourHeight,accuracy,end,start,duration,height,founded;

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                var user = AssignmentReactiveVars.SelectedUser.get() == null ? null : Meteor.users.findOne(AssignmentReactiveVars.SelectedUser.get());
                if (user === null) return [];


                var availabilityFound = AvailabilityService.getAvailabilityByStart(user.availabilities, startCalendarTimeSlot);
                var userAssignments = AssignmentService.getAssignmentForUser(user);
                var assignmentFound = AssignmentService.getAssignmentByStart(userAssignments, startCalendarTimeSlot);

                if (availabilityFound === null && assignmentFound === null) return [];
                if (availabilityFound !== null && assignmentFound !== null) {
                    console.error("Calendar.timeSlot : error while displaying user info, both availability and assignment has been found. \nuser", user, " => availability", availabilityFound, " and assignment", assignmentFound);
                    return [];
                }

                baseOneHourHeight = 40;
                accuracy = AssignmentCalendarDisplayedAccuracy.findOne().accuracy;

                if (availabilityFound !== null) {
                    data.state = "available";
                    data.name = user.username;

                    founded = availabilityFound;
                } else if (assignmentFound !== null) {
                    data.name = assignmentFound.taskName;
                    data.state = "affecte";

                    founded = assignmentFound;

                    data.taskName = founded.taskName;
                }

                _.extend(data, founded);
                data.height = CalendarServiceClient.computeTimeSlotAvailabilityHeight(founded,startCalendarTimeSlot) + "px";

                break;
            case AssignmentType.TASKTOUSER:
                var task = AssignmentReactiveVars.SelectedTask.get() == null ? null : Tasks.findOne(AssignmentReactiveVars.SelectedTask.get());
                if (!task) return [];

                var result = CalendarServiceClient.computeTimeSlotData(task,startCalendarTimeSlot);
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
            return Assignments.findOne({peopleNeedId:peopleNeed._id}) != null;
        });
    }

    peopleNeededAssigned(){
        return _.reject(this.currentData().peopleNeeded,function(peopleNeed){
            return Assignments.findOne({peopleNeedId:peopleNeed._id}) == null;
        });
    }

    peopleNeedAssignedOnClick(event) {
        AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
    }

    openPopOver(event) {
        event.stopPropagation();
        this.activeTimeSlot.set(this.currentData()._id);
        this.isPopOverOpened.set(true);
    }
    closePopOver(event) {
        event.stopPropagation();
        this.isPopOverOpened.set(false);
    }

    stopPropa(event){
        event.stopPropagation();
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


    heureOnClick(){
        //what time did we click on ?
        console.log("heureOnClick");

        var $target = $(event.target);

        this.filterTaskList($target)
    }


    //userToTask (we click on a creneau, not on the entire availability)
    quartHeureOnClick(event) {
        //TODO gerer le double click pour la desaffectation
        console.log("quartHeureOnClick");

        //what time did we click on ?
        var $target = $(event.target);

        this.filterTaskList($target)
    }

    filterTaskList($target){

        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected availability slot

                var selectedDate = null;
                if (typeof $target.attr("hours") !== "undefined") {
                    selectedDate = new moment(new Date($target.attr("hours")));
                } else if (typeof $target.attr("quarter") !== "undefined") {
                    selectedDate = new moment(new Date($target.attr("quarter")));
                }
                AssignmentReactiveVars.SelectedDate.set(selectedDate);

                var userId = AssignmentReactiveVars.SelectedUser.get()._id;
                var user = Meteor.users.findOne({_id: userId});
                var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);

                if (typeof availability === "undefined") {
                    AssignmentServiceClient.taskToUserPerformUserFilterRemoveAssignment();
                    return;
                } else {
                    AssignmentReactiveVars.IsUnassignment.set(false)
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

                var timeSlotsFilter = {
                    $elemMatch: {
                        $or:[
                            //userIdFilter,
                            //skillsFilter,
                            //noSkillsFilter
                        ]
                    }
                };

                timeSlotsFilter.$elemMatch.$or.push(
                    {
                        //userId filter
                        peopleNeeded: {
                            $elemMatch: {
                                userId: user._id
                            }
                        },
                        //availabilities filter
                        start: {$gte: availability.start, $lte: selectedDate.toDate()},
                        end: {$gt: selectedDate.toDate(), $lte: availability.end}
                    }
                );
                timeSlotsFilter.$elemMatch.$or.push(
                    {
                        //skills filter
                        peopleNeeded: {
                            $elemMatch: {
                                skills: {
                                    $elemMatch: {
                                        $in: user.skills
                                    }
                                },
                                teamId: {
                                    $in: (user.teams.length === 0) ? [null] : user.teams
                                }
                            }
                        },
                        //availabilities filter
                        start: {$gte: availability.start, $lte: selectedDate.toDate()},
                        end: {$gt: selectedDate.toDate(), $lte: availability.end}
                    }
                );
                timeSlotsFilter.$elemMatch.$or.push(
                    {
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
                );
                //aggregate is not supported by mini mongo


                AssignmentReactiveVars.TaskFilter.set(timeSlotsFilter);
                break;
            case
            AssignmentType.TASKTOUSER:
                //only display users that have at least one availability matching the selected time slot
                //we let the event bubbles to the parent
                return [];
        }
    }

    percentAffected(){
        var nbr_assigned = this.peopleNeededAssigned().length;
        var nbr_total = this.currentData().peopleNeeded.length;
        if(nbr_total > 0)
            return 100* nbr_assigned/nbr_total;
        else
        return 0;
    }


}
AssignmentCalendarComponent.register("AssignmentCalendarComponent");





