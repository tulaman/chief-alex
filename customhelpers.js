const constants = require('./constants.js');
const AWS = constants.AWS;
const recipesTable = constants.DYNAMODB_TABLE;

module.exports = {
  'voiced': function (txt) {
    return '<voice name="Matthew">' + txt + '</voice>'; 
  },
  'supportsDisplay': function(handlerInput) { // returns true if the skill is running on a device with a display (Echo Show, Echo Spot, etc.)
    const hasDisplay =                       //  Enable your skill for display as shown here: https://alexa.design/enabledisplay
      handlerInput.requestEnvelope.context &&
      handlerInput.requestEnvelope.context.System &&
      handlerInput.requestEnvelope.context.System.device &&
      handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
      handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;

    return hasDisplay;
  },
  'getRecipe': function (recipeName, callback) {
    var dynamoParams = {
      TableName: 'Recipes', //recipesTable,
      FilterExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': recipeName
      }
    };
    var docClient = new AWS.DynamoDB.DocumentClient();
    docClient.scan(dynamoParams, (err, data) => {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log('Get item succeeded', data);

        var recipe = data.Items[0];
        callback(recipe);
      }
    });
  },
  'getRecipeByIngredient': function (ingredientName, callback) {
    var dynamoParams = {
      TableName: 'Recipes', //recipesTable,
      FilterExpression: 'contains(#is, :ingredient)',
      ExpressionAttributeNames: {
        '#is': 'ingredients_string'
      },
      ExpressionAttributeValues: {
        ':ingredient': ingredientName
      }
    };
    var docClient = new AWS.DynamoDB.DocumentClient();
    docClient.scan(dynamoParams, (err, data) => {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log('Get item succeeded', data);

        var recipes = data.Items.length > 5 ? data.Items.splice(0,5) : data.Items;
        callback(recipes);
      }
    });
  }
}
