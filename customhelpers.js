const constants = require('./constants.js');
const AWS = constants.AWS;
const recipesTable = constants.DYNAMODB_TABLE;

module.exports = {
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

        var recipe = data.Items[0];
        callback(recipe);
      }
    });
  }
}
