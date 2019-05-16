'use strict';

const Alexa = require("ask-sdk");

const constants    = require('./constants.js');
const customhelpers = require('./customhelpers.js');

const AWS = constants.AWS;
const recipesTable = constants.DDB_TABLE;
const voiceName = constants.VOICE;

const smallImageUrl = 'https://s3.amazonaws.com/chief-alex/small-chief.jpg';
const largeImageUrl = 'https://s3.amazonaws.com/chief-alex/large-chief.jpg';

const recipes = [
  {
    name: 'Pear salad',
    ingredients: [
      '3 pears',
      '2 bunches of lettuce',
      '150 gramms of Roquefort cheese',
      'a handful of mint',
      '10 walnuts',
      'juice of half of lemon',
      '4 table spoons of olive oil',
      '1 table spoon of honey'
    ],
    steps: [
      'Fry the walnuts in honey, put them on a plate or a metal baking sheet covered with baking paper. Ensure nuts do not stick to each other.',
    	'finely chop the Lettuce.',
      'Cut the pears into thin slices and lightly sprinkle with lemon.',
    	'Cut the cheese into slices.',
    	'Mix pears with lettuce, add cheese and mint.',
    	'Prepare the dressing by combining the remaining lemon juice, olive oil, salt and freshly ground pepper.',
    	'Pour over salad dressing, mix, sprinkle with nuts on top.'
    ]
  },
  {
    name: 'Salad from Mushrooms and Avocado',
    ingredients: [
      '300 gramms white Champignons or any other similar freshly edible mushrooms',
      '1 avocado',
      '1 lemon juice',
      '3 table spoons of olive oil',
      'handful of mint leaves'
    ],
    steps: [
      'Wash champignons, peel, cut into thin slices and sprinkle lightly with lemon juice.',
      'Prepare the dressing from the remaining lemon juice, olive oil, pepper and salt and pour over the mushrooms.',
      'Peel avocados, remove the bone and cut into small slices.',
      'Add the avocado to the mushrooms and mix.',
      'Sprinkle with mint leaves.'
    ]
  },
  {
    name: 'Salad with grapefruit',
    ingredients: [
      'any salad leaves',
      '100 grams of pine nuts',
      '1 grapefruit',
      '4 table spoons of olive oil'
    ],
    steps: [
      'Fry the pine nuts in a dry frying pan until golden.',
      'Peel the grapefruit, split half of the pulp into slices and peel off the films.',
      'From the second half of grapefruit squeeze the juice, add olive oil, salt and pepper.',
      'Mix the salad leaves with grapefruit slices, sprinkle with dressing, stir again and sprinkle with pine nuts.'
    ]
  },
  {
    name: 'Salad with chili pepper and chicken',
    ingredients: [
      '2 chicken breasts',
      '1 grapefruit',
      '1 red chilli pepper',
      '1 green chili pepper',
      'handful of mint leaves and cilantro',
      '1 table spoon of any vegetable oil',
      '3 table spoons of soy sauce',
      '2 table spoons of sesame oil'
    ],
    steps: [
      'Boil chicken for 25 minutes, cut into large cubes.',
      'Peel the grapefruit, divide it into slices and free it from the films, keep the juice.',
      'remove the seeds from Red and green chili peppers, cut into fine rings.',
      'Stir chicken, cilantro leaves and mint leaves, chopped chili peppers in a dry frying pan for 1 minutes.',
      'Add sesame and vegetable oil, soy sauce, juice and pulp of grapefruit and mix again.'
    ]
  },
  {
    name: 'Crayfish soup',
    ingredients: [
      '6 small beetroots',
      '30 crayfish',
      '3 eggs',
      '6 cucumbers',
      'bunch of dried dill',
      'bunch of fresh dill',
      'small bunch of spring onions',
      '500 grams sour cream',
      '10 sweet-scented peppercorns'
    ],
    steps: [
      'Boil the beetroots for 30 minutes, peel, grate on a coarse grater and pour over 2 litres of cold boiled water, put away in the fridge.',
      'Boil eggs for 10 minutes, clean and cut in halves.',
      'Boil water in a large saucepan, add 2 tablespoons of salt, sweet-scented peppercorns and a bunch of dry dill, put the crayfish and boil for 35–45 minutes, peel.',
      'peel Cucumbers , finely chop.',
      'finely chop Chives and fresh dill.',
      'Take the beets broth from the fridge, salt, add cucumbers, herbs and sour cream, mix everything.',
      'Pour the soup by plates, add half of an egg and 3-5 crayfish in the centre of every plate.'
    ]
  }
];

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
	return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        var pureText = 'Hi. Chief Alex is here. You can get a recipe by ingredient or by name. Or I can surprise you';
	var speechText = '<voice name="Matthew">' + pureText + '</voice>';
	return handlerInput.responseBuilder
	    .speak(speechText)
	    .reprompt(speechText)
      	    .withStandardCard('Chief Alex', pureText, smallImageUrl, largeImageUrl)
	    .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
	return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
	       handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
	var pureText = 'You can say "surprise me" or "find me a receipt of something"';
	return handlerInput.responseBuilder
	    .speak(voiced(pureText))
	    .reprompt(pureText)
      	    .withStandardCard('Chief Alex', pureText,  smallImageUrl, largeImageUrl)
	    .getResponse();
    }
}

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = '<voice name="Matthew">Ok. Goodbye!</voice>';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withStandardCard('Chief Alex', "Ok. Goodbye!", smallImageUrl, largeImageUrl)
      .getResponse();
  }
};

const SurpriseMeIntentHandler = {
    canHandle(handlerInput) {
	    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
	       handlerInput.requestEnvelope.request.intent.name === 'SurpriseMeIntent';
    },
    handle(handlerInput) {
      let recipeId = Math.floor((Math.random()*recipes.length))
      let recipe = recipes[recipeId];
    
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      sessionAttributes.mode = 'surpriseMe';
      sessionAttributes.lastRecipeId = recipeId; 
      sessionAttributes.lastRecipe = recipe;
      sessionAttributes.step = -1;

      var pureText = 'Let\’s make ' + recipe.name + ' maybe?';
	  
      return handlerInput.responseBuilder
	      .speak(voiced(pureText))
	      .reprompt(speechText)
              .withStandardCard('Chief Alex', pureText, smallImageUrl, largeImageUrl)
	      .getResponse();
    }
}

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};


const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //any cleanup logic goes here
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.lastRecipeId = null; 
    sessionAttributes.lastRecipe = null;
    sessionAttributes.step = null;
    sessionAttributes.lastSpeech = null;
    sessionAttributes.mode = null;
    return handlerInput.responseBuilder.getResponse();
  }
};


const YesIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const attributesManager = handlerInput.attributesManager;
    const sa = attributesManager.getSessionAttributes();
    
    var responseText = 'OK';

    if (sa.step < 0 && sa.lastRecipe) {
      var r = sa.lastRecipe;
      responseText = 'To make ' + r.name + ' you need the following ingredients. ' + r.ingredients.join(' <break time="600ms"/> ') + '. Are you ready to make it?';
      sa.step = 0;
    }
    else if (sa.step >= 0 && sa.lastRecipe){
      if (sa.lastRecipe.steps[sa.step]) {
        responseText = sa.lastRecipe.steps[sa.step];
        sa.step = sa.step + 1;
      }
      else {
        responseText = 'You are all done';
      }
    }

    sa.lastSpeech = responseText;

    return handlerInput.responseBuilder
      .speak('<voice name="' + voiceName + '">' + responseText + '</voice>')
      .reprompt('You should say Yes or Next or Cancel')
      .getResponse();
  },
};


const NoIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const attributesManager = handlerInput.attributesManager;
    const sa = attributesManager.getSessionAttributes();
    
    if (sa.mode === 'surpriseMe') {
      let recipeId = Math.floor((Math.random()*recipes.length))
      let recipe = recipes[recipeId];
      
      sa.mode = 'surpriseMe';
      sa.lastRecipeId = recipeId; 
      sa.lastRecipe = recipe;
      sa.step = -1;
      
      responseText = 'Okay. I\'ll find something better. ' +
        'How about ' + recipe.name + '?';
    }

    return handlerInput.responseBuilder
      .speak('<voice name="' + voiceName + '">' + responseText + '</voice>')
      .reprompt('You should say something')
      .getResponse();
  },
};


const RepeatIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const attributesManager = handlerInput.attributesManager;
    const sa = attributesManager.getSessionAttributes();
  
    if (sa.lastSpeech)
      responseText = sa.lastSpeech;
    else
      responseText = 'Sorry. There is nothing to repeat';

    return handlerInput.responseBuilder
      .speak('<voice name="' + voiceName + '">' + responseText + '</voice>')
      .reprompt('You should say something')
      .getResponse();
  },
};


const NextIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NextIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
    const attributesManager = handlerInput.attributesManager;
    const sa = attributesManager.getSessionAttributes();
    
    responseText = '';

    if (sa.mode === 'surpriseMe') {
      if (sa.step >= 0 && sa.lastRecipe){
        if (sa.lastRecipe.steps[sa.step]) {
          responseText = sa.lastRecipe.steps[sa.step];
          sa.step = sa.step + 1;
        }
        else {
          responseText = 'You are all done';
        }
      }
    }

    return handlerInput.responseBuilder
      .speak('<voice name="' + voiceName + '">' + responseText + '</voice>')
      .reprompt('You should say Yes or Next or Cancel')
      .getResponse();
  },
};


const SearchByNameIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'SearchByNameIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const slots = request.intent.slots;
    let recipeName = slots.RecipeName.value;

    console.log('Attempting to read data');

    return new Promise((resolve) => {
      customhelpers.getRecipe(recipeName, r => {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

	      var say = ''
        if (r) {
          sessionAttributes.mode = 'searchByName';
          //sessionAttributes.lastRecipeId = recipeId; 
          sessionAttributes.lastRecipe = r;
          sessionAttributes.step = -1;
          say += 'Okay. Let\’s make ' + r.name + '. Are you ready?';
	      }
        else {
          say += 'Sorry. I don\'t know how to cook ' + recipeName;
        }
        var speechText = '<voice name="Matthew">'+say+'</voice>';
        resolve(handlerInput.responseBuilder
	        .speak(speechText)
	        .reprompt('Try again. ' + speechText)
      	        .withStandardCard('Chief Alex', say, smallImageUrl, largeImageUrl)
	        .getResponse()
        );
      });
    })
  }
};


const SearchByIngredientIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'SearchByIngredientIntent';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const slots = request.intent.slots;
    let ingredientName = slots.IngredientName.value;

    console.log('Attempting to read data');

    return new Promise((resolve) => {
      customhelpers.getRecipeByIngredient(ingredientName, r => {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        var say = ''
        if (r.length > 0) {
          sessionAttributes.mode = 'searchByIngredient';
//          sessionAttributes.lastRecipeId = r.id; 
//          sessionAttributes.lastRecipe = r;
//          sessionAttributes.step = -1;
          //say += 'Okay. Let\’s make ' + r.name + '. Are you ready?';
          const reducer = (accumulator, currentValue) => accumulator + ' <break time="600ms"/> ' + currentValue.name;
          var recipes_list = r.reduce(reducer, '');
          say += 'I have ' + recipes_list + ', what do you want to cook?';
        }
        else {
          say += 'Sorry. I don\'t know recipes with ' + ingredientName;
        }
        var speechText = '<voice name="Matthew">'+say+'</voice>';
        resolve(handlerInput.responseBuilder
	        .speak(speechText)
	        .reprompt('Try again. ' + speechText)
                .withStandardCard('Chief Alex', say, smallImageUrl, largeImageUrl)
	        .getResponse()
        );
      });
    })
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    YesIntentHandler,
    NoIntentHandler,
    RepeatIntentHandler,
    NextIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    SurpriseMeIntentHandler,
    SearchByNameIntentHandler,
    SearchByIngredientIntentHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
