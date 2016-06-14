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

        this.render('home', {to: 'mainContent'});

    },
    {name: 'home'}
);


/**
 * @memberOf Route
 * @summary Homepage
 * @locus client
 * @name home  /
 */
var justForDoc = {};
Router.route('/demo-select', function () {
        this.wait(Meteor.subscribe('users'));
        this.wait(Meteor.subscribe('tasks'));
        this.wait(Meteor.subscribe('teams'));
        this.wait(Meteor.subscribe('skills'));
        this.wait(Meteor.subscribe('power-supplies'));

        if (this.ready()) {
            this.render('demo-select', {to: 'mainContent',
            data:{
                user1Id : Users.findOne({name:"user1"})._id,
                user2Id : Users.findOne({name:"user2"})._id,
                task2Id : Tasks.findOne({name:"task 2"})._id,
                team1Id : Teams.findOne({name:"team1"})._id,
                team1Idteam2Id: [Teams.findOne({name:"team1"})._id, Teams.findOne({name:"team2"})._id],
                skill1Idskill2Id: [Skills.findOne({"label" : "Responsable tache 1"})._id, Skills.findOne({"label" : "Responsable tache 2"})._id],
                powersupply1 : PowerSupplies.findOne({name:"powerSupply1"})._id
            }});
        } else {
            console.log("Route / : waiting users_custom data"); //TODO add a spinner
        }


    },
    {name: 'demo-select'}
);

Router.route('/inject-data', function () {
        if (Meteor.isDevelopment) {
            Accounts.logout();
            $("#result").html("please wait while injecting data, you are now logged out");
            Meteor.call("injectData",function(error, result){
                if(error){
                    $("#result").html(error);
                } else {
                    $("#result").html("inject happened without error, please log in");
                }
            })
        } else {
            console.error("/inject-data is a dev only route")
        }
    },
    {name: 'inject-data'}
)

Router.route('/delete-all', function () {
        if (Meteor.isDevelopment) {
            Accounts.logout();
            $("#result").html("please wait while deleting data, you are now logged out");
            Meteor.call("deleteAll",function(error, result){
                if(error){
                    $("#result").html(error);
                } else {
                    $("#result").html("deleteAll happened without error, you should use /init-access-right-data to be able to log in");
                }
            })
        } else {
            console.error("/delete-all is a dev only route")
        }
    },
    {name: 'delete-all'}
)


Router.route('/init-access-right-data', function () {
        if (Meteor.isDevelopment) {
            Accounts.logout();
            $("#result").html("please wait while injecting data, you are now logged out");
            Meteor.call("initAccessRightData",function(error, result){
                if(error){
                    $("#result").html(error);
                } else {
                    $("#result").html("initAccessRightData happened without error, please log in");
                }
            })
        } else {
            console.error("/init-access-right-dat is a dev only route")
        }
    },
    {name: 'init-access-right-data'}
)

Router.route('/populate-data', function () {
        if (Meteor.isDevelopment) {
            Accounts.logout();
            $("#result").html("please wait while injecting data, you are now logged out");
            Meteor.call("populateData",function(error, result){
                if(error){
                    $("#result").html(error);
                } else {
                    $("#result").html("populateData happened without error, please log in");
                }
            })
        } else {
            console.error("/populate-data is a dev only route")
        }
    },
    {name: 'populate-data'}
)


