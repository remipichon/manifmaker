import {ActivityScenarioServiceClient} from "./ActivityScenarioServiceClient";
import {TaskScenarioServiceClient} from "./TaskScenarioServiceClient";
import {UserScenarioServiceClient} from "./UserScenarioServiceClient";
import {GuidedTourServiceClient} from "./GuidedTourServiceClient";

export class PlayTourServiceClient2 {

  static playScenarii(speed = 1) {
    let options = {
      year: "2018",
      activityName: "Sandcastle On The Beach " + new moment().format("hhmmss"),
      taskName: "Pile Up Sand" + new moment().format("hhmmss"),
      regularUser: {  //ACTIVITY RW TASK RW
        email: "superadmin@yopmail.com",
        pwd: "superadmin"
      },
      equipmentUser: {  //ACTIVITY RW TASK RW EQUIPMENTVALIDATION ACTIVIITYGENERALVALIDATION CONFMAKER
        email: "superadmin@yopmail.com",
        pwd: "superadmin"
      },
      assignmentUser: {  //ACTIVITY RW TASK RW ASSIGNMENTVALIDAITON  ASSIGNMENTTASKUSER
        email: "superadmin@yopmail.com",
        pwd: "superadmin"
      },
      volunteerUser: {  //part of team with access to terms, already validated (son planning et ses fiches tches)
        email: "hard@yopmail.com",
        pwd: "hard",
        availabilities: [
          "Wed Jun 16 2021 02:00:00 GMT+0200",
          "Wed Jun 16 2021 04:00:00 GMT+0200",
          "Wed Jun 16 2021 06:00:00 GMT+0200",
          "Wed Jun 16 2021 08:00:00 GMT+0200",
          "Wed Jun 16 2021 10:00:00 GMT+0200",
          "Wed Jun 16 2021 14:00:00 GMT+0200",
          "Wed Jun 16 2021 16:00:00 GMT+0200",
        ]
      },
      term: {
        name: "Premanif"
      },
      timeSlot: {
        start: "Wed Jun 16 2021 04:00:00 GMT+0200",
        start2: "Wed Jun 16 2021 02:00:00 GMT+0200" //tricks
      }
    };
    $("#guided-tour-overlapp").addClass("visible");
    console.log("using", options);

    //:contains( and multiline doesn't work

    var activityScenario = [
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["Nous allons nous connecter en tant que Bob l'Eponge, notre premier protagoniste, pour créer une animation.", 7000 * speed, "center", "medium"]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'instantLogout',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'login',
        'params': [speed, options.regularUser,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["Créons une activité pour décrire notre animation.", 3000 * speed, "center", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'openMenu',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["#sidebar-activity", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["[href='/activity']", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': ["General information",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Voici le formulaire de création où nous renseignons uniquement les informations principales.</p>" +
        "<p>Bien plus à venir...</p>", 3000 * speed, "center", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': [options.activityName, "[for=first_name] ~ input", 50 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Team", "confiance", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["User responsible", "hard3", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [{findComponentByContent: "Insert"},]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': ["There is errors in the form",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Oopsie , il semblerait qu'ils y aient des erreurs...</p>", speed * 1000, "right-vertical-align-.alert.alert-danger", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Live event responsible", "bureau", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Place", "Bocal", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': ["Insert",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [{findComponentByContent: "Insert"},]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': ["Delete " + options.activityName,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Bravo ! Première activité créé (facile hein), voyons tout ce que nous pouvons configurer désormais.</p>" +
        "<p>Tout est optionnel, tu configures à ta guise. </p>", 10000 * speed, "center", "medium"]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectDate',
        'params': [".date-time-picker-update-activity-start input", "10/02/" + options.year, "Sep", "10", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectDate',
        'params': [".date-time-picker-update-activity-end input", "10/02/" + options.year, "Sep", "18", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': ["<p>Concours de chateau de sable ! </p>" +
        "<p>Il y aura des tas de sable sur la page , prenez en un et utiliser les pelles et sauts à disposition</p>" +
        "<p>Le plus beau chateau sera récompensé d'un beau trésor des mers !</p>", "[name=description]", 10 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [500 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'scrollIfTargetOutOfWindow',
        'params': [".panel-heading:contains(Equipment)"]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Water supply", "AIP", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [500 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'scrollIfTargetOutOfWindow',
        'params': [".panel-heading:contains(Validation)"]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Une fois l'animation configurée, elle doit passer par une série de validation, il y en a trois sortes.</p>" +
        "<p>1. Validation des informations générales, utilisées nottament pour afficher sur le site web ou l'application</p>" +
        "<p>2. Validation du matériel pour vérifier sa conformité et les stockes" +
        "<p>3. Validation des pass d'accès, si besoin en sécurité. A Bikini Bottom, tout le monde est gentil, pas besoin de sécurité</p>" +
        "<p>Chaque validation peut se faire par des personnes différentes, en fonction de leur droit. Voyons d'abord comment soumettre en validation</p>", 40000 * speed, "center", "big"
        ]
      },
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': ["Normalement je n'ai pas fais de fautes d'ortografes. ", ".validation-comment-input[for='General Information'] input", 50 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".validation-comment-input[for='General Information'] .askforvalidation-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [300 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': ["Les chaisses longues c'est en bonus , supprime les si c'est en trop", ".validation-comment-input[for='Equipment'] input", 50 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".validation-comment-input[for='Equipment'] .askforvalidation-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient', 'methodName': 'sleep', 'params': [300 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Validons cette animation ! Entre en jeux Patrick l'Etoile de Mer , expert en matériel qui va pouvoir confirmer les besoins de Bob l'Eponge.",
          speed * 10000, "center", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'logout',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'login',
        'params': [speed, options.equipmentUser,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'openMenu',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["#sidebar-activity", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["#sidebar-activity ~.dropdown-menu [href='/activities']", speed,]
      }, {'className': 'GuidedTourServiceClient', 'methodName': 'waitFor', 'params': ["Activities List",]}, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Tu peux chercher dans et filtrer cette liste à ta guise , concentrons nous sur celle dont l'équipement doit etre validée.</p>",
          speed * 7000, "center", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["#advanced-search-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [100 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Validation Status", "Equipment validation In validation process", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [100 * speed,]
      },
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [`td:contains(${options.activityName}) ~ td .btn[title=Edit]`, speed]
      },
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': [`Delete ${options.activityName}`,]
      },
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'scrollIfTargetOutOfWindow',
        'params': [".panel-heading:contains(Validation)"]
      },
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': ["Pas de soucis , tu peux avoir les chaises longues", ".validation-comment-input[for='Equipment'] input", 0 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".validation-comment-input[for='Equipment'] .close-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [300 * speed,]
      },
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'scrollIfTargetOutOfWindow',
        'params': [".panel-heading:contains(Equipments)"]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Maintenant que le matériel est validé, il ne peut plus etre modifié." +
        "Au besoin, la validation peut etre refusée pour modifier les quantitiés.", speed, "top-right", "medium"]
      },
    ];


    let taskScenario = [
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["Nous allons nous revenir avec Bob l'Eponge pour créer une fiche tache qui prepera l'animation des chateaux de sables.",
          10000 * speed, "center", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'instantLogout',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'openMenu',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'login',
        'params': [speed, options.regularUser,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'openMenu',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["#sidebar-task", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["[href='/task']", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': ["General information",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Meme histoire que pour les animations , uniquement les informations générales ici</p>", 3000 * speed, "center", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': [options.taskName, "[for=first_name] ~ input", 50 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Team", "confiance", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["User responsible", "hard3", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Rendez-vous point", "Petite scene", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Live event responsible", "bureau", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': ["Insert",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [{findComponentByContent: "Insert"}]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': ["Delete " + options.taskName,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Linked Activity", options.activityName, speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': ["<p>Avec le fenwick et les pelles en plastiques disponobles , il faut faire des tres gros tas de sables.</p>" +
        "<p>Le mieux c'est d'en faire a droite et a gauche ainsi que au millieu , devant et derriere.</p>" +
        "<p>Oubliez pas les cotés ! Il faut faire des tas haut mais pas trop. </p>" +
        "<p>Vive la plage ! </p>",
          "[name=description]", 10 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [500 * speed,]
      },
      {
        'className': 'GuidedTourServiceClient',
        'methodeName': '',
        'params': []
      },
      //      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Equipment)"))

      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeEquipment',
        'params': [10, "colson", 300 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeEquipment',
        'params': [5, "fenwick", 300 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [500 * speed,]
      },


      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Les créneaux sont la partie la plus importante de la taches. Ici nous définissons quand aura lieu la tache et de qui aura t'elle besoin.</p>" +
        "<p>Commencons par choisir le quand.</p>" +
        "<p>Un evenement complexe peut etre divisé en plusieurs périodes de durées variables. Choissisons la période de la 'journée plage'.</p>",
          17000 * speed, "center", "large",]
      },
      //      .then(() => GuidedTourServiceClient.clickOn(`.assignments-terms-button:contains('${options.term.name}')`, speed))
      {
        'className': 'GuidedTourServiceClient',
        'methodeName': '',
        'params': []
      },
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': [`.calendar .quart_heure[quarter='${options.timeSlot.start2}']`,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [`.calendar .quart_heure[quarter='${options.timeSlot.start2}']`, 0,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': [`.calendar .quart_heure[quarter='${options.timeSlot.start}']`,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [`.calendar .quart_heure[quarter='${options.timeSlot.start}']`, speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-time-slot .done-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      },
      // .then(() => GuidedTourServiceClient.alert("<p>Le quand, c'est fait. Maintenant le avec qui.</p>" +
      //   "<p>Les besoins en organisteurs peuvent demander n'importe qui d'une équipe, ou alors une personne avec certaines compétences voir meme cummuler les deux. " +
      //   "Il est également possible de demander quelqu'un en particulier.</p>", speed * 25000, "center", "small"))
      {
        'className': 'GuidedTourServiceClient',
        'methodeName': '',
        'params': []
      },

      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-people-need .add-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Need a specific team", "hard", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-people-need .done-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["Hop , on copie un besoin orgas !", 500 * speed, "center", "small",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".people-need .duplicate", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".people-need .duplicate", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".people-need .duplicate", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-people-need .add-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Need of set of skills", "Responsable", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-people-need .done-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      },
      //annoying to when duplicating while testing
      /*{
       'className': 'GuidedTourServiceClient',
       'methodName': 'clickOn',
       'params': [".add-people-need .add-button", speed,]
       }, {
       'className': 'GuidedTourServiceClient',
       'methodName': 'standardSleep',
       'params': [speed,]
       }, {
       'className': 'GuidedTourServiceClient',
       'methodName': 'selectOption',
       'params': ["Need a specific user", "Sticky Expert", speed * 300,]
       }, {
       'className': 'GuidedTourServiceClient',
       'methodName': 'standardSleep',
       'params': [speed,]
       }, {
       'className': 'GuidedTourServiceClient',
       'methodName': 'clickOn',
       'params': [".add-people-need .done-button", speed,]
       },
       */
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'scrollIfTargetOutOfWindow',
        'params': [".add-time-slot .duplicate-button[title=duplicate]",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["Sur le calendrier nous pouvons voir un petit résumé des besoins pour avoir un rapide coup d'oeil.", 10000 * speed, "left-align-horizontal-.updateTimeSlotCalendar", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-time-slot .duplicate-button[title=duplicate]", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-time-slot .done-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [300 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': [".add-time-slot .duplicate-button[title=duplicate]",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-time-slot .duplicate-button[title=duplicate]", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".add-time-slot .done-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      },
      //make the ui buggy
      /*{
       'className': 'GuidedTourServiceClient',
       'methodName': 'waitFor',
       'params': [`.calendar .quart_heure[quarter='${options.timeSlot.start}']`,]
       }, {
       'className': 'GuidedTourServiceClient',
       'methodName': 'clickOn',
       'params': [`.calendar .quart_heure[quarter='${options.timeSlot.start}'] .creneau .creneau-to-affect`, speed,]
       }, {
       'className': 'GuidedTourServiceClient',
       'methodName': 'selectDate',
       'params': [".from-date-time-picker-update-time-slot input", null, null, "02", 200 * speed,]
       },
       */
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [400 * speed,]
      },

      {
        'className': 'GuidedTourServiceClient',
        'methodeName': '',
        'params': []
      },
      //      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Il n'y a que deux validations pour les fiches taches</p>" +
        "<p>1. Validation Equipement</p> " +
        "<p>2. Validation Creneaux</p>" +
        "Nous allons nous concentrer sur l'affectation...", 10000 * speed, "center", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': [" ", ".validation-comment-input[for='Time Slot'] input", 50 * speed,]
      },

      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".validation-comment-input[for='Time Slot'] .askforvalidation-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [300 * speed,]
      },






      {
        'className': 'GuidedTourServiceClient',
        'methodeName': '',
        'params': []
      },
      // GuidedTourServiceClient.alert("Comme pour l'animation, nous allons valider la tache avec Sandy qui sera responsable de l'affectation (ce pourquoi tu es venu ici...)",
      //   speed * 13000, "center", "medium")
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'logout',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'login',
        'params': [speed, options.assignmentUser,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'openMenu',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["#sidebar-task", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'standardSleep',
        'params': [speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["#sidebar-task ~.dropdown-menu [href='/tasks']", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': ["Tasks List",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'alert',
        'params': ["<p>Hop , nous voulons uniquement les taches dont les creneaux sont a valider.</p>",
          speed * 4000, "center", "medium",]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': ["#advanced-search-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [100 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'selectOption',
        'params': ["Validation Status", "Assignment validation In validation process", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [100 * speed,]
      },
      //      .then(() => GuidedTourServiceClient.clickOn(`td:contains('${options.taskName}') ~ td .btn[title=Edit]`, speed))
      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'waitFor',
        'params': [`Delete ${options.taskName}`,]
      },
      //      .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(".panel-heading:contains(Validation)"))

      {
        'className': 'GuidedTourServiceClient',
        'methodName': 'typeText',
        'params': ["Ready for assignment , yeah !", ".validation-comment-input[for='Time Slot'] input", 0 * speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'clickOn',
        'params': [".validation-comment-input[for='Time Slot'] .close-button", speed,]
      }, {
        'className': 'GuidedTourServiceClient',
        'methodName': 'sleep',
        'params': [300 * speed,]
      },
    ]

    console.log("size", taskScenario.length)

    let list = [];
    list = list.concat(activityScenario);
    list = list.concat(taskScenario);

    PlayTourServiceClient2.loop(list, 0, options, speed)


  }

  static loop(list, index, options, speed) {
    const next = (index < list.length - 1)
      ? () => PlayTourServiceClient2.loop(list, index + 1, options, speed)
      : () => {
      };

    PlayTourServiceClient2.runAction(list[index], options, speed).then(next);
  }

  static runAction(action, options, speed) {
    action.params.forEach((param, index) => {
      if (typeof param == "object" && param.findComponentByContent) {
        action.params[index] = GuidedTourServiceClient.findComponentByContent(param.findComponentByContent)
      }
    })
    switch (action.className) {
      case "GuidedTourServiceClient":
        return GuidedTourServiceClient[action.methodName].apply(this, action.params);
      case "UserScenarioServiceClient":
        return UserScenarioServiceClient[action.methodName].apply(this, action.params);
      case "TaskScenarioServiceClient":
        return TaskScenarioServiceClient[action.methodName].apply(this, action.params);
      case "UserScenarioServiceClient":
        return UserScenarioServiceClient[action.methodName].apply(this, action.params);
    }
  }


}