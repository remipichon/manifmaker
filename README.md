
# Installation

* install meteor itself : https://www.meteor.com/install
* fetch this repo
* cd REPO/manifmaker
* meteor

visit localhost:3000


# Contribution

Usual merge request stuff

# Teckos Documentation

## Data test
When Meteor restart, all data are erased and some are added

### at startup data (populate-data-helper.js)

* role
* user
  * admin/admin
  * hard/hardhard
  * bureau/bureaubureau
  * resplog/resplogresplog
  * respsecu/respsecurespsecu
  * humain/humainhumain
  * soft/softsoft
* customUser
  * user1
  * user2
  * user3

TODO

## JSDoc

TODO


file watchers

https://github.com/thomasfl/filewatcher

filewatcher '**/*.js' 'echo buidling docs; meteor-jsdoc build'

## How to use home-made stuff

### CustomSelect

TODO

### Add a reference collection

Add the schema to /both/collection/schema/schema-references.js (to create Schema and Mongo Collection and generatares every needed routes)

* PLURAL_REFERENCE_URL : url for the list (GET)
* REFERENCE_URL: url to create (POST), update and delete
* REFERENCE_COLLECTION_NAME: Mongo Variable Collection name
* REFERENCE_MONGO_COLLECTION_NAME: Collection Name in MongoDb
* REFERENCE_LABEL: How the collection will be named in html
* TEMPLATE_ROW: the template to render one row of the list


See Schemas.references.Teams for a minimal collection reference example. 


If you want to reference one of the users references collections, you should add a field like name as :

CollectionName_Id  : eg  EquipmentCategories_Id 

It will display the "name" field of the references collection in the list

Basic references field with custom verification that the _id actually exists and autoform to generate the dropdown

EquipmentCategories_Id: {
        type: SimpleSchema.RegEx.Id,
        label: "Equipment Category",
        custom: function () {
            if (!EquipmentCategories.findOne(this.value))
                return "unknownId";
            return 1
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allEquipmentCategoriesOptions
            }
        },
    },



 
Please note that you need to add the following fields to have the "update" button working (sorry...)

baseUrl: { 
        type: String,
        label: "Team base URL",
        defaultValue: "team"
}


Please note that you need to add the following fields to have the "remove" button working (sorry...)

 type: { 
        type: String,
        label: "Teams type",
        defaultValue: "Teams"
    },


Add the newly created Mongo Collection to the AllCollections array in /client/routes/config/route-collection-references.js
(can't be put in another place as this project don't have any dependency manager)


Add your specific template to each of the files in /client/templates/references/ (just copy/paste and update the existing templates to your needs. Be careful with
singular and plural to have everything correctly generated)

* insert.html : template to create a new reference document
* update.html :  template to update a reference document


and add your new Collection to publish/subscribe policy


You should follow the current populate/clean policy






