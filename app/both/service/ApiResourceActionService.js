import {Schemas} from '../collection/model/SchemasHelpers'


ApiResourceAction = {
    activities:{
        "list": function(){
            return JSON.stringify({statusCode: 200, data: ApiResourceActionService.readData(Schemas.Activities, Activities)}, null, '\t');
        }
    },
    teams:{
        "list": function(){
            return JSON.stringify({statusCode: 200, data: ApiResourceActionService.readData(Schemas.references.Teams, Teams)}, null, '\t');
        }
    },
    places:{
        "list": function(){
            return JSON.stringify({statusCode: 200, data: ApiResourceActionService.readData(Schemas.references.Places, Places)}, null, '\t');
        }
    },
    'web-categories':{
        "list": function(){
            return JSON.stringify({statusCode: 200, data: ApiResourceActionService.readData(Schemas.references.WebCategories, WebCategories)}, null, '\t');
        }
    },
    'android-categories':{
        "list": function(){
            return JSON.stringify({statusCode: 200, data: ApiResourceActionService.readData(Schemas.references.AndroidCategories, AndroidCategories)}, null, '\t');
        }
    }
};

export class ApiResourceActionService {

    static readExportAttributes(attributes, iteratorPrefix, iterator, schema) {
        iterator.forEach(key => {
            var def = schema.getDefinition(iteratorPrefix + key);
            if (def.jsonExport) {
                attributes[key] = 1;
            } else {
            }
        });
        return attributes;
    }

    static readData(SchemasDefinition, CollectionInstance, query = {}) {
        //read schema to know keys to extract
        var attributes = ApiResourceActionService.readExportAttributes({}, "", SchemasDefinition._schemaKeys, SchemasDefinition);
        console.log(`Get data from '${CollectionInstance._name}' using projection ${Object.keys(attributes)}`);
        if (Object.keys(attributes).length === 0)
            throw new Meteor.Error("500", `${CollectionInstance._name} schemas is not defined to export JSON`);
        //query DB
        var resources = CollectionInstance.find(query, {fields: attributes}).fetch();
        //replace if needed
        Object.keys(attributes).forEach(attribute => {
            var def = SchemasDefinition.getDefinition(attribute);
            if (def.jsonExportCustom) {
                resources.forEach(resource => {
                    var iterator = resource;
                    var iteratorParent = iterator;
                    var split = attribute.split('.');
                    split.forEach(attr => {
                        iteratorParent = iterator;
                        iterator = iterator[attr]
                    });
                    var newKeyValue = def.jsonExportCustom(iterator)
                    if(newKeyValue.newKey && newKeyValue.newValue) {
                        delete iteratorParent[split[split.length - 1]];
                        iteratorParent[newKeyValue.newKey] = newKeyValue.newValue
                    } else
                        iteratorParent[split[split.length - 1]] = newKeyValue
                });
            }

        });
        //return JSON
        return resources;
    }

}
