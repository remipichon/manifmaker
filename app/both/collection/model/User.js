import {Schemas} from './SchemasHelpers'
import {TimeSlotService} from "../../../both/service/TimeSlotService"
import {PeopleNeedService} from "../../../both/service/PeopleNeedService"

//order matters !
Schemas.UserAvailabilities = new SimpleSchema({
    start: {
        type: Date,
        label: "User Availabilities Start Date",
        custom: function () {
            var start = new moment(this.value);
            var end = new moment(this.field(this.key.replace("start", "") + "end").value);
            if (start.isAfter(end))
                return "startAfterEnd";

            //check if new availability is overlapping with an assignment
            var userAssignment = Users.findOne(this.docId).assignments;

            console.log(userAssignment.length);
            console.log(start.toDate());
            console.log(end.toDate());

            if(TimeSlotService.areArrayStartEndOverlappingStartDate(userAssignment,start,end,"none")){
                return "availabilityOverlapAssignment";
            }


            var userTeams = Users.findOne(this.docId).teams;
            var start = this.value;

            if (!AssignmentTerms.findOne({
                    teams: {
                        $elemMatch: {
                            $in: userTeams
                        }
                    },
                        start: {
                            $lte: start
                        }
                })
            )
                return "availabilitiesNoInTerm"

        },
        autoform: {
            type: "datetime-local",
        }
    },
    end: {
        type: Date,
        label: "User Availabilities End Date",
        custom: function () {
            if (new moment(this.value).isSame(new moment(this.field(this.key.replace("end", "") + "start").value)))
                return "endBeforeStart"

            var userTeams = Users.findOne(this.docId).teams;
            var end = this.value;

            if (!AssignmentTerms.findOne({
                    teams: {
                        $elemMatch: {
                            $in: userTeams
                        }
                    },
                    end: {
                        $gte: end
                    }
                })
            )
                return "availabilitiesNoInTerm"
        },
        autoform: {
            type: "datetime-local",
        }
    }
});

Schemas.UserAssignment = new SimpleSchema({
    taskName: {
        type: String,
        label: "User assignment User Name"
    },
    start: {
        type: Date,
        label: "User Assignment Start Date"
    },
    end: {
        type: Date,
        label: "User Assignment End Date"
    },
    assignmentId: {
        type: SimpleSchema.RegEx.Id,
        label: "User assignment assignment id",
        custom: function () { //validate data is same as the real assignment
            var assignment = Assignments.findOne(this.value);
            if (!assignment)
                return "unknownId"
            var timeSlot = TimeSlotService.getTimeSlot(assignment.taskId,assignment.timeSlotId);
            if (Tasks.findOne(assignment.taskId).name !== this.field(this.key.replace("assignmentId", "") + "taskName").value
                || !new moment(timeSlot.start).isSame(new moment(this.field(this.key.replace("assignmentId", "") + "start").value))
                || !new moment(timeSlot.end).isSame(new moment(this.field(this.key.replace("assignmentId", "") + "end").value)))
                return "userAssignmentNotMatching"
        }
    }
});

Schemas.Users = new SimpleSchema({
    name: {
        type: String,
        label: "Users Name",
        max: 100
    },
    firstName: {
        type: String,
        label: "User first name",
        max: 100,
        optional: true,
        defaultValue: null
    },
    familyName: {
        type: String,
        label: "User family name",
        max: 100,
        optional: true,
        defaultValue: null
    },
    phoneNumber:{
        type: String,//SimpleSchema.RegEx.Phone,
        label: "User phone",
        optional: true,
        defaultValue: null,
        regEx: /^0{1}\d{10}$/
    },
    email:{
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "User email",
        optional: true,
        defaultValue: null
    },
    birthDate: {
        type: Date,
        label: "User birth date",
        optional: true,
        defaultValue: null
    },
    nickName: {
        type: String,
        label: "User nickname",
        optional: true,
        defaultValue: null,
        unique: true
    },
    //24h specific, will see later how to parametrize that

    departement: {
        type: String,
        label: "Department Insa",
        optional: true,
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allDepartementOptions
            }
        }
    },

    annee: {
        type: String,
        label: "Annnée Insa",
        optional: true,
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allAnneesOptions
            }
        }
    },

    comment: {
        type: String,
        label: "Comment",
        optional: true,
    },

    //end specific
    loginUserId: {
        label: "User login link to collection managed by Account package",
        type: SimpleSchema.RegEx.Id,
        optional: true
    },
    isReadyForAssignment: {
        label: "User assignment ready state",
        type: Boolean,
        defaultValue: false,
        custom: function () {
            if(this.isUpdate)
            if(this.value === false){
                if(Users.findOne(this.docId).assignments && Users.findOne(this.docId).assignments.length !== 0){
                    return "userHasAssignments"
                }
            }
        }
    },
    groupRoles: {
        label: "User roles to gain a set of less or more data and features",
        type: [SimpleSchema.RegEx.Id],
        optional: true,
        custom: function () {
            this.value = _.compact(this.value);
            if(GroupRoles.find({_id:{$in:this.value}}).fetch().length !== this.value.length)
                return "unknownIdOrDuplicateId"
        }
    },
    'groupRoles.$': {
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allGroupRolesOptions
            }
        }
    },
    teams: {
        label: "User teams",
        type: [SimpleSchema.RegEx.Id],
        optional: true,
        custom: function () {
            this.value = _.compact(this.value);
            if(Teams.find({_id:{$in:this.value}}).fetch().length !== this.value.length)
                return "unknownIdOrDuplicateId"
        },
        autoValue: function () {
            if (this.isInsert) {
                //trick pour les filtres, tous les users appartiennement au moins à l'équipe ASSIGNMENTREADYTEAM
                var assignmentReadyTeam = Teams.findOne({name: ASSIGNMENTREADYTEAM});
                if(!this.value)
                    this.value = [];
                else if (!_.contains(this.value,assignmentReadyTeam._id)) //we don't add it we it already have it (when autoform do the check several times)
                    this.value.push(assignmentReadyTeam._id);
                return this.value;
            }

            if(this.isUpdate){
                if(this.field("teams").isSet){
                    if(this.field("teams").operator === "$pull"){
                        var teamRemoved = this.field("teams").value;
                        //TODO check if the user has skills that he will loose

                        //check if the user has one assignment that needed the deleted team
                        var userAssignments = Assignments.find({
                            userId:this.docId
                        }).fetch();

                        userAssignments.forEach(userAssignment => {
                            var peopleNeedAssigned = PeopleNeedService.getPeopleNeedByIdAndTask(userAssignment.peopleNeedId,Tasks.findOne(userAssignment.taskId)).peopleNeed;

                            if(peopleNeedAssigned.teamId === teamRemoved){
                                if(Meteor.isClient)
                                    sAlert.error(`You can not remove this team, user has already assignments that needed the removed team.
                                You can try to add remove user's assignment that need the deleted team`,{timeout:7000});

                                this.unset();
                                throw new Meteor.Error("403", `Forbidden, user has already assignments that needed the removed team.`);
                            }
                        });


                        //check if the user has one availability that are within the deleted team's assignment term
                        var user = Users.findOne(this.docId);
                        console.log(teamRemoved, "has been removed from",user);

                        var userTeams = user.teams;
                        userTeams.splice(userTeams.indexOf(teamRemoved),1);

                        //assignmentTerms that the user will actually lose (because he doesn't have another team covering it)
                        var assignmentTerms = AssignmentTerms.find({
                            $and : [
                                {
                                    teams: teamRemoved
                                },
                                {
                                    teams: {
                                        $not: {$in: userTeams}
                                    }
                                }
                            ]
                        }).fetch();

                        //all periods that the user will lose
                        var allPeriods = [];
                        assignmentTerms.forEach(assignmentTerm => {
                            if(assignmentTerm.assignmentTermPeriods.length !== 0){
                                allPeriods.concat(assignmentTerm.assignmentTermPeriods);
                            } else {
                                allPeriods.push({
                                    start: assignmentTerm.start,
                                    end: assignmentTerm.end
                                })
                            }
                        });

                        //check if user has one availability included in one of the periods he will lose
                        var availabilities = user.availabilities;
                        user.availabilities.forEach(availability => {
                            allPeriods.forEach(period => {
                                if(TimeSlotService.isOverlapping(availability.start,availability.end,period.start,period.end)){
                                    //includeInAPeriod = true;
                                    if(Meteor.isClient)
                                        sAlert.error(`You can not remove this team, user has already add availabilities in one a the team assignment term.
                                You can try to add another team whose assignment terms cover the existing user's availabilities.`,{timeout:7000});

                                    this.unset();
                                    throw new Meteor.Error("403", `Forbidden, user still have availability in at least one term that he will lose if team is removed`);
                                }
                            });
                        });
                    }
                }

            }
        },
    },
    'teams.$': {
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allTeamsOptions
            }
        }
    },
    skills: {
        label: "User Skills",
        type: [SimpleSchema.RegEx.Id],
        optional: true,
        defaultValue: [],
        custom: function () {
            this.value = _.compact(this.value);
            if(Skills.find({_id:{$in:this.value}}).fetch().length !== this.value.length)
                return "unknownIdOrDuplicateId"

            var user = Users.findOne(this.docId);
            if(this.isUpdate && user.isReadyForAssignment && user.isReadyForAssignment === true)
                return "userHasBeenValidatedNoSkillsUpdate"


        }
    },
    'skills.$': {
        custom: function(){
            var user = Users.findOne(this.docId);
            if(_.intersect(user.teams,Skills.findOne(this.value).teams).length === 0)
                return "userAccessToSkills"
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allSkillsOptions
            }
        }
    },
    availabilities: {
        type: [Schemas.UserAvailabilities],
        label: "User availabilities",
        optional: true,
        defaultValue: []
    },
    assignments: {
        type: [Schemas.UserAssignment],
        label: "User assignments",
        defaultValue: [],
        optional: true,
        autoform: {
            type: "hidden",
        }
    }
});