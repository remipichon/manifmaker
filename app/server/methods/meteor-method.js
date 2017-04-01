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
        var userId = payload.target.match("user/(.*)/export")[1];
        var token = ServerUserService.generateNewLoginToken(userId)
        return {
            payload: payload,
            token: token
        }
    },
    /**
     *
     * @param options JSON [{url, filename}]
     */
    generatePdf: function (options) {
        console.info("generatePdf",options);

        //get JWT url
        var items = [];
        options.forEach(option => {
            var item = {};
            item.url = "http://192.168.192.4:3000/jwt/" + JwtService.sign({"target": "http://192.168.192.4:3000"+option.url, type:"url"});
            item.fileName = option.fileName;
            items.push(item);
        });
        console.info("Calling export pdf endpoint",Meteor.exportPdfEndpoint,"with",items);

        HTTP.call('POST', Meteor.exportPdfEndpoint, {
            data: {items:items}
        }, function(error, result) {
            if (error) {
                console.error("generatePdf",error)
            } else {
                console.info("generatePdf calling",Meteor.exportPdfEndpoint,"with result",result)
            }
        });
    }
});

