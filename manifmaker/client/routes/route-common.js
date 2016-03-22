Router.configure({
    layoutTemplate: 'wrapper'
});

//hide menu for each new route
Router.onAfterAction(function () {
    $('#button-collapse-left-menu').sideNav('hide');
});


//hide topNavBar to each expect assignment
Router.onAfterAction(function () {
        this.render("", {to: "topNavBar"});

        assignmentCalendarIsRendered = false;
    },
    {
        except: [
            'assignment.calendar',
            'assignment.calendar.user',
            'assignment.calendar.userToTask',
            'assignment.calendar.userToTask.user',
            'assignment.calendar.userToTask.user.date',

            'assignment.calendar.taskToUser',
            'assignment.calendar.taskToUser.task',
            'assignment.calendar.taskToUser.task.timeSlot',

            'assignment.calendar.task.search'

        ]
    }
);

/**
 * @memberOf Route
 * @summary Homepage
 * @locus client
 * @name home  /
 */
var justForDoc = {};
Router.route('/', function () {
        this.wait(Meteor.subscribe('users'));

        if (this.ready()) {
            this.render('home', {to: 'mainContent',
            data:{
                user1Id : Users.findOne({name:"user1"})._id,
                user2Id : Users.findOne({name:"user2"})._id
            }});
        } else {
            console.log("Route / : waiting users_custom data"); //TODO add a spinner
        }


    },
    {name: 'home'}
);