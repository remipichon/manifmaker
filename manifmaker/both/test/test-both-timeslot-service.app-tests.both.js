import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';

import {TimeSlotService} from "/both/service/TimeSlotService"

describe("B : TimeSlotService", () => {
    describe("getTimeSlot(task, timeSlotId)", () => {
        it("timeSlotId exists in task", () => {

           var task1 = Tasks.findOne({name:"task 1"});


        });

        it("timeSlotId doesn't exist in task", () => {

        });

        it("task is malformed", () => {

        });

        it("task is an object", () => {

        });

        it("task is an _id", () => {

        });
    })
});


//nominal case

//timeslotId doesn't match any in task

//task is malformed