import {ServerService} from "./service/ServerService";
import {Inject24h43emeDataServerService} from "./service/Inject24h43emeDataServerService";
import {Inject24hDataServerService} from "./service/Inject24hDataServerService";
import {InjectDataHelperServerService} from "./service/InjectDataHelperServerService";
import {InjectDataServerService} from "./service/InjectDataServerService";
import {InjectGuidedTourDataServerService} from "./service/InjectGuidedTourDataServerService";
var pjson = require('/package.json');

InjectDataInfo = new Mongo.Collection("inject_data_infos");

Meteor.startup(function () {

  console.log("***********************************************************************");
  console.log("***********************************************************************");
  console.log("*");
  console.log("*");
  console.log("*");
  console.log("*");
  console.log("*");
  console.info(`Manifmaker is starting '${pjson.version}'`);
  console.log("*");
  console.log("*");
  console.log("*");
  console.log("*");
  console.log("*");
  console.log("*");
  console.log("***********************************************************************");
  console.log("***********************************************************************");

  var mailGunPassword = process.env.MAILGUN_PASSWORD
  if (mailGunPassword) {
    process.env.MAIL_URL = `smtp://postmaster@mail.manifmaker.com:${mailGunPassword}@smtp.mailgun.org:587`;
    console.info("MAIL_URL has been set to " + process.env.MAIL_URL);
  } else
    console.info("MAILGUN_PASSWORD is not defined, this app will not be able to send mail");

  if (!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY) {
    console.warn("JWT_PRIVATE_KEY and JWT_PUBLIC_KEY are not defined");
    console.info("JWT_PRIVATE_KEY and JWT_PUBLIC_KEY set to random secret");
    process.env.JWT_PRIVATE_KEY = process.env.JWT_PUBLIC_KEY = new Mongo.ObjectID()._str;
  }

  //how to reach node-export-pdf app
  if (process.env.EXPORT_PDF_ENDPOINT)
    Meteor.exportPdfEndpoint = process.env.EXPORT_PDF_ENDPOINT;
  else
    Meteor.exportPdfEndpoint = "http://localhost:3030/export";

  //will be use to generate the download URL
  if (process.env.NGINX_ENDPOINT)
    Meteor.nginxEndpoint = process.env.NGINX_ENDPOINT;
  else
    Meteor.nginxEndpoint = "http://localhost:8080/pdf/";

  //how can node-export-pdf reach back manifmaker to get the HTML page
  if (process.env.MANIFMAKER_ENDPOINT)
    Meteor.manifmakerEndpoint = process.env.MANIFMAKER_ENDPOINT;
  else
    Meteor.manifmakerEndpoint = "http://localhost:3000"; //or docker0 IP if node-export-pdf is run as a Docker

  //configure Third party authent
  if (process.env.GOOGLE_CLIENTID && process.env.GOOGLE_SECRET) {
    console.info("Using given GOOGLE_CLIENTID and GOOGLE_SECRET to enable Google third party authentication");
    ServiceConfiguration.configurations.remove({
      service: 'google'
    });
    ServiceConfiguration.configurations.insert({
      service: 'google',
      clientId: process.env.GOOGLE_CLIENTID,
      secret: process.env.GOOGLE_SECRET
    });
  }
  if (process.env.FACEBOOK_APPID && process.env.FACEBOOK_SECRET) {
    console.info("Using given FACEBOOK_APPID and FACEBOOK_SECRET to enable Facebook third party authentication");
    ServiceConfiguration.configurations.remove({
      service: 'facebook'
    });

    ServiceConfiguration.configurations.insert({
      service: 'facebook',
      appId: process.env.FACEBOOK_APPID,
      secret: process.env.FACEBOOK_SECRET
    });
  }


  Meteor.isStartingUp = true;

  ServerService.addCollectionHooks();

  let envReport = {
    //frequency
    dataInjectOnce: (typeof process.env.DATA_INJECT_ONCE != "undefined") ? process.env.DATA_INJECT_ONCE == "true" : true,
    dataInjectEverytime: process.env.DATA_INJECT_EVERYTIME == "true",
    //what
    dataInjectClass: process.env.DATA_INJECT_CLASS,
    //production
    skipInitAccessRight: process.env.SKIP_INIT_ACCESS_RIGHT == "true",
    itIsNotProductionItsOkToDeleteData: process.env.IT_IS_NOT_PRODUCTION_IT_IS_OK_TO_DELETE_DATA == "truetrue",
    iKnowWhatIAmDoing: process.env.IT_IS_REALLY_NOT_PRODUCTION == "iknowwhatiamdoing"
  };
  if(!envReport.iKnowWhatIAmDoing) envReport.itIsNotProductionItsOkToDeleteData = false;

  console.info("Meteor.startup: using data inject configuration env ");
  console.info(envReport);

  let injectClasses = {
    injectData: new InjectDataServerService(),
    inject24hData: new Inject24hDataServerService(),
    inject24h43emeData: new Inject24h43emeDataServerService(),
    injectGuidedTour: new InjectGuidedTourDataServerService( {
      year: 2018,
      month: 10,
      date: 1,
      suffix: "_init"
    }, true)
  };


  let superadminpassword;
  if (Meteor.isProduction && !envReport.itIsNotProductionItsOkToDeleteData) {
    if (envReport.skipInitAccessRight) {
      console.info("Meteor.startup: production mode: init access right skipped because env SKIP_INIT_ACCESS_RIGHT");
    } else if (InjectDataInfo.findOne({triggerEnv: "DATA_INJECTED"})) {
      console.info("Meteor.startup: production mode: init access right skipped because it has already been done");
      return false;
    } else {
      console.info("Meteor.startup: production mode: init access right once");
      InjectDataInfo.insert({production: "DATA_INJECTED", date: new Date(), envReport: envReport});
      console.info("Meteor.startup: production mode: if injecting ");
      InjectDataHelperServerService.initAccessRightData();
    }

  } else if (Meteor.isDevelopment || envReport.itIsNotProductionItsOkToDeleteData) {
    if (!Meteor.isDevelopment) {
      console.warn("Meteor.startup: Meteor.isProduction has been forced to false because of IT_IS_NOT_PRODUCTION_IT_IS_OK_TO_DELETE_DATA");
      Meteor.isProduction = false;
    }
    if (InjectDataHelperServerService.isInjectDataRequired(envReport)) {
      console.info("Meteor.startup: dev mode: wipe out all data and inject minimum access right, aka a superadmin user ");
      InjectDataHelperServerService.deleteAll();
      InjectDataHelperServerService.initAccessRightData();
      InjectDataInfo.insert({triggerEnv: "DATA_INJECTED", date: new Date(), envReport: envReport});

      if (envReport.dataInjectClass != "") {
        if (injectClasses[envReport.dataInjectClass]) {
          console.info(`Meteor.startup: dev mode: inject data class ${envReport.dataInjectClass} (env DATA_INJECT_CLASS). Please note minimum access right should be present, you can use DATA_INJECT_MINIMUM_ACCESS_RIGHT.`);
          //no support for injecting several class so far
          //InjectDataInfo.insert({triggerEnv: envReport.dataInjectClass, date: new Date(), envReport: envReport});
          Meteor.injectDataServerService = injectClasses[envReport.dataInjectClass];
          Meteor.injectDataServerService.injectAllData();
        } else {
          console.info(`Meteor.startup: dev mode: inject data class ${envReport.dataInjectClass} doesn't exist (env DATA_INJECT_CLASS). No more data to add.`);
          console.info(`Meteor.startup: dev mode: available data class are ${Object.keys(injectClasses)}`)
        }
      }
    }
    if (!Meteor.isDevelopment) {
      Meteor.isProduction = true;
      console.warn("Meteor.startup: Meteor.isProduction has been forced back to true");
    }
  }

  if (superadminpassword) {
    InjectDataHelperServerService.printSuperAdmin(superadminpassword);
  }

  console.info("Meteor.isStarting is complete");
  Meteor.isStartingUp = false;
});












