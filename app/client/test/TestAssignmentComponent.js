class TestAssignmentComponent extends BlazeComponent {

    constructor() {
        super();

        if (!Meteor.userId()) {
            Meteor.loginWithPassword("superadmin", "superadmin");
        }

    }




    remove_assign_nominal_case() {
        //conf
        var testName = "remove_assign_nominal_case";

        //prerequisite
        var task1 = Tasks.findOne({name: "task 1"});
        var user1 = Meteor.users.findOne({username: "user1"});
        var timeslot2h4h = task1.timeSlots[0];
        var peopleNeedNoSkillsTeam1 = timeslot2h4h.peopleNeeded[0];

        //this.printBeforeTest(testName,this.assignmentResultToString(user1,task1,timeslot2h4h,peopleNeedNoSkillsTeam1));

        //test
        Meteor.call("removeAssignUserToTaskTimeSlot", peopleNeedNoSkillsTeam1._id, user1._id, _.bind(function (error, result) {
            if(error){
                //this.printErrorTest(testName,error)
            }
        },this));

        //synchronous result
        //this.printAfterTest(testName,"result");
    }

    //asynchronous result (because Collection Hooks occur some time later)
    remove_assign_nominal_case_after(){
        return "After : "+this.assignmentResultToString(
            Meteor.users.findOne({name: "user1"}),
            Tasks.findOne({name: "task 1"}),
            Tasks.findOne({name: "task 1"}).timeSlots[0],
            Tasks.findOne({name: "task 1"}).timeSlots[0].peopleNeeded[0]
        );
    }






    assign_nominal_case() {
        //conf
        var testName = "assign_nominal_case";

        //prerequisite
        var task1 = Tasks.findOne({name: "task 1"});
        var user1 = Meteor.users.findOne({name: "user1"});
        var timeslot2h4h = task1.timeSlots[0];
        var peopleNeedNoSkillsTeam1 = timeslot2h4h.peopleNeeded[0];

        this.printBeforeTest(testName,this.assignmentResultToString(user1,task1,timeslot2h4h,peopleNeedNoSkillsTeam1));

        //test
        Meteor.call("assignUserToTaskTimeSlot", peopleNeedNoSkillsTeam1._id, user1._id, _.bind(function (error, result) {
            if(error){
                this.printErrorTest(testName,error)
            }
        },this));

        //synchronous result
        //this.printAfterTest(testName,"result");
    }

    //asynchronous result (because Collection Hooks occur some time later)
    assign_nominal_case_after(){
        return "Befpre "+ this.assignmentResultToString(
            Meteor.users.findOne({name: "user1"}),
            Tasks.findOne({name: "task 1"}),
            Tasks.findOne({name: "task 1"}).timeSlots[0],
            Tasks.findOne({name: "task 1"}).timeSlots[0].peopleNeeded[0]
        );
    }




    

    printBeforeTest(testName,label){
        $("#"+ testName +"_before").append("Before "+label);
    }
    printAfterTest(testName,label){
        $("#"+ testName +"_after").html("After "+label);
    }
    printErrorTest(testName,label){
        $("#"+ testName +"_after").append("Error "+label);
    }


    injectData(){
        $("#inject_data_result").html(`injecting data... please wait`);
        Meteor.call("injectData", _.bind(function (error,result) {
            Meteor.loginWithPassword("superadmin", "superadmin");
            $("#inject_data_result").html(`error : ${error} and result : ${result}`);
        }, this));
    }

    assignmentResultToString(user,task,timeSlot,peopleNeed){
        return "User : " +this.userAvailabilitiesToString(user) +
            "Task : " +this.timeSlotPeopleNeededtoString(timeSlot)+
            "Assignment : " + this.assignmentToString(user, task,timeSlot,peopleNeed);

    }

    assignmentToString(user,task,timeSlot,peopleNeed){
        var res = "assignment : ";

        if(!user || !task || !timeSlot || !peopleNeed){
            res += "not found [ERROR]"
        } else {
            var assignment = Assignments.findOne({userId: user._id, taskId: task._id, timeSlotId: timeSlot._id, peopleNeedId: peopleNeed._id});

            if (assignment) {
                res += " found : " + assignment._id
            } else {
                res += "not found"
            }
        }

        return res;
    }

    userAvailabilitiesToString(user){
        var res = "availabilities : ";
        user.availabilities.forEach(availability => {
            res += `${availability.start} => ${availability.end}`;
            res += " | ";
        });
        return res;
    }

    timeSlotPeopleNeededtoString(timeSlot){
        var res = "timeSlot.peopleNeeded : ";
        timeSlot.peopleNeeded.forEach(peopleNeed => {
            res += `teamId : ${peopleNeed.userId} teamId : ${peopleNeed.teamId} skills : ${peopleNeed.skills.length} userAssignedId : ${peopleNeed.assignedUserId}`;
            res += " | ";
        });
        return res;


    }


    template() {
        return "testAssignmentComponent";
    }

    events() {
        return [
            {
                "click #assign_nominal_case": this.assign_nominal_case,
                "click #remove_assign_nominal_case": this.remove_assign_nominal_case,
                "click #inject_data": this.injectData
            }]
    }


}

TestAssignmentComponent.register('TestAssignmentComponent');
