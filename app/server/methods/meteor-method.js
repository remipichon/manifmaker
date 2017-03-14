import {InjectDataServerService} from "../service/InjectDataServerService"
import {InjectDataHelperServerService} from "../service/InjectDataHelperServerService"
import {SecurityServiceServer} from "../service/SecurityServiceServer"
import {ServerUserService} from "../service/ServerUserService"
import {JwtService} from "../service/JwtService";


Meteor.methods({
     injectData: function(){
         SecurityServiceServer.isItProd("inject data from front");
         Meteor.isStartingUp = true;
         InjectDataHelperServerService.deleteAll();
         InjectDataHelperServerService.initAccessRightData();
         Meteor.injectDataServerService.injectAllData();
         Meteor.isStartingUp = false;
     },
    updateUserName: function(userId,newUsername){
        ServerUserService.updateUserName(userId,newUsername)
    },
    updateUserEmail: function(userId,newUserEmail){
        ServerUserService.updateUserEmail(userId,newUserEmail)
    },
    sendVerificationEmail: function(userId){
        ServerUserService.sendVerificationEmail(userId)
    },
    getVersion: function () {
        var pjson = require('/package.json');
        console.log(pjson.version); // This will print the version
        return pjson.version;
    },
    sendEmail: function (to, subject, text) {
        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();
        Email.send({
            to: to,
            from: "no-reply@manifmaker.com",
            subject: subject,
            text: text
        });
    },
    signExportUrl: function (target) {
        //TODO check that user has EXPORTASSIGNMENT role
        return JwtService.sign({"target":target, type:"url"})
    },
    verifyExportUrl: function (jwtString) {
        var payload = JwtService.verify(jwtString);
        console.log("payload",payload)
        var userId = payload.target.match("user/(.*)/export")[1];
        var user = Meteor.users.findOne(userId);
        return {
            payload: payload,
            token: user.loginToken
        }
    },
});

