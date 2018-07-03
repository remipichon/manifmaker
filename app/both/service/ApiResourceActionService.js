import {Schemas} from '../collection/model/SchemasHelpers'


ApiResourceAction = {
  activities: {
    "list": function () {
      return JSON.stringify({
        statusCode: 200,
        data: ApiResourceActionService.readData(Schemas.Activities, Activities)
      }, null, '\t');
    }
  },
  teams: {
    "list": function () {
      return JSON.stringify({
        statusCode: 200,
        data: ApiResourceActionService.readData(Schemas.references.Teams, Teams)
      }, null, '\t');
    }
  },
  places: {
    "list": function () {
      return JSON.stringify({
        statusCode: 200,
        data: ApiResourceActionService.readData(Schemas.references.Places, Places)
      }, null, '\t');
    }
  },
  'web-categories': {
    "list": function () {
      return JSON.stringify({
        statusCode: 200,
        data: ApiResourceActionService.readData(Schemas.references.WebCategories, WebCategories)
      }, null, '\t');
    }
  },
  'android-categories': {
    "list": function () {
      return JSON.stringify({
        statusCode: 200,
        data: ApiResourceActionService.readData(Schemas.references.AndroidCategories, AndroidCategories)
      }, null, '\t');
    }
  }
};

export class ApiResourceActionService {

  /**
   * @summary return model attributes with 'jsonExport' set to true
   * @param attributes      Object of existing attributes, return value will add new attributes to it
   * @param iteratorPrefix  String, no idea what is it for
   * @param iterator        Object of all schema keys
   * @param schema          SimpleSchema object
   * @returns all attributes with 'jsonExport' == true from given schema
   */
  static readExportAttributes(attributes, iteratorPrefix, iterator, schema) {
    iterator.forEach(key => {
      var def = schema.getDefinition(iteratorPrefix + key);
      if (def.jsonExport) {
        attributes[key] = 1;
      }
    });
    return attributes;
  }

  static readData(SchemasDefinition, CollectionInstance, query = {}) {
    //read schema to know keys to extract
    var attributes = ApiResourceActionService.readExportAttributes({}, "", SchemasDefinition._schemaKeys, SchemasDefinition);
    console.info(`Get data from '${CollectionInstance._name}' using projection '${Object.keys(attributes)}'`);
    if (Object.keys(attributes).length === 0)
      throw new Meteor.Error("500", `${CollectionInstance._name} schemas is not defined to export JSON`);
    //query DB
    var resources = CollectionInstance.find(query, {fields: attributes}).fetch();
    //replace if needed
    Object.keys(attributes).forEach(attribute => {
      var def = SchemasDefinition.getDefinition(attribute);
      if (def.jsonExportCustom) {
        resources.forEach(resource => {
          //compute new custom value
          let split = attribute.split('.');
          let iterator = ApiResourceActionService.walkInDepth(resource, split);
          var newKeyValue = def.jsonExportCustom(iterator);

          if (newKeyValue.newKey && newKeyValue.newValue) {
            //remove automatically generated value;
            let lastDot = split.pop();
            iterator = ApiResourceActionService.walkInDepth(resource, split);
            delete iterator[lastDot];
            //insert new custom according to custom key
            split = newKeyValue.newKey.split('.');
            lastDot = split.pop();
            iterator = ApiResourceActionService.walkInDepth(resource, split);
            iterator[lastDot] = newKeyValue.newValue;
          } else{
            //replace value by custom value
            let lastDot = split.pop();
            iterator = ApiResourceActionService.walkInDepth(resource, split);
            iterator[lastDot] = newKeyValue
          }
        });
      }

    });
    //return JSON
    return resources;
  }

  static walkInDepth(objectToWalkIn, listOfSuccessiveAttributes) {
    let iterator = objectToWalkIn;
    listOfSuccessiveAttributes.forEach(attr => { //expanding dot notation to depth lookout
      iterator = iterator[attr]
    });
    return iterator;
  }

}
