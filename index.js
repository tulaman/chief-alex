'use strict';

const Alexa = require("ask-sdk");

const constants    = require('./constants.js');
const customhelpers = require('./customhelpers.js');

const AWS = constants.AWS;
const recipesTable = constants.DDB_TABLE;
const voiceName = constants.VOICE;

const smallImageUrl = 'https://s3.amazonaws.com/chief-alex/small-chief.jpg';
const largeImageUrl = 'https://s3.amazonaws.com/chief-alex/large-chief.jpg';

const appName = 'Chef Alex';

const recipes = [
{
"id": 30,
"ingredients_string": "chanterelles",
"name": "chanterelles salad",
"ingredients": [
  "500 grams   fresh chanterelles",
  "100 grams hard cheese",
  "100 grams of salad leaves (korn lettuce or similar)",
  "1 onion",
  "2 cloves of garlic",
  "half of juice of lemon",
  "7 table spoons of olive or any other vegetable oil"
],
"steps": [
  "Peel and chop the onion and garlic.",
  "wash and brush Chanterelles.",
  "Grate Cheese.",
  "Preheat 2 tablespoons of olive oil, lightly fry onions and garlic.",
  "Add the chanterelles to the pan, add a little salt and pepper and fry closing the lid.",
  "Prepare the dressing by mixing the remaining olive oil, lemon juice, salt and pepper.",
  "Cut salad leaves and pour dressing.",
  "Place chanterelles on lettuce leaves, sprinkle with grated cheese on top."
 
]
},

{
"id": 31,
"ingredients_string": "eggs, bacon, lettuce",
"name": "eggs and bacon salad",
"ingredients": [
  "1 loaf of stale white bread",
  "2 buns of leaf lettuce",
  "100 grams finely chopped bacon",
  "3 eggs",
  "50 grams hard cheese",
  "half of juice of lemon",
  "5 table spoons of olive oil"
],
"steps": [
  "Preheat the oven to 200 ° C .",
  "remove the bread crust, cut the loaf into several moderate size pieces, lay the a baking sheet with baking paper, put the bread pieces onto the baking sheet and sprinkle with olive oil.",
  "Top the bread with bacon and bake in a preheated oven for about 10 minutes.",
  "Boil the eggs for 5 minutes, peel, cut in halves.",
  "Grate cheese in large flakes (use a peeler).",
  "Coarsely chop the salad, add the remaining olive oil, lemon juice, salt, pepper, mix everything.",
  "Put on a plate salad leaves, then bread with bacon, eggs, sprinkle with cheese."
 
]
},

{
"id": 32,
"ingredients_string": "fennels, tomatoes, black olives, tarragon leaves",
"name": "fennel and tomatoes salad",
"ingredients": [
  "2 fennels",
  "24 yellow and red cherry tomatoes",
  "20 black olives",
  "100 milliliters of dry white wine",
  "a handful of tarragon leaves",
  "2 cloves of garlic",
  "3 table spoons of olive oil",
  "2 table spoons of butter",
  "pinch of dry marjoram"
],
"steps": [
  "Preheat the oven to 170 ° C .",
  "cut Fennel length wise into eight pieces and put them into the boiling water for 5 minutes.",
  "Scald the tomatoes, peel off the skin.",
  "Cut the olives in half.",
  "Peel and chop the garlic and season with olive oil.",
  "Put fennel, olives, tomatoes on a large baking sheet covered with baking paper, pour with wine, put butter onto the top of vegetables.",
  "Salt the vegetables and sprinkle with marjoram, pour olive oil with garlic, and then send to a preheated oven for 20 minutes.",
  "Take out, sprinkle with tarragon leaves."
 
]
},

{
"id": 33,
"ingredients_string": "onions, bacon, rocket salad",
"name": "salad with bacon",
"ingredients": [
  "2 bundles of rocket salad",
  "2 red onions",
  "150 grams bacon",
  "100 grams pine nuts",
  "50 grams hard cheese",
  "3 sprigs of basil",
  "2 table spoons of olive oil",
  "table spoon balsamic vinegar spoon",
  "pinch of dry Provencal herbs"
],
"steps": [
  "Peel the onions and cut each onion into eight pieces.",
  "Cut the bacon into long strips, fry in a dry frying pan until golden brown and put on a paper towel.",
  "Fry the onion in the pan left over from the bacon. When it becomes soft and golden, salt and add Provencal herbs.",
  "Heat olive oil in another pan, add pine nuts, balsamic vinegar, bacon and onion, salt and pepper.",
  "Grate cheese in large flakes (use a peeler).",
  "finely chop Basil leaves.",
  "Put rocket salad, onion and bacon with nuts on a large dish, sprinkle with cheese and basil."
 
]
},

{
"id": 34,
"ingredients_string": "champignons, spinach, sweet peppers, carrots, zucchini, celeries, ginger root",
"name": "stir fried vegetables",
"ingredients": [
  "500 grams Champignons",
  "200 grams spinach",
  "3 sweet peppers (preferably in different colours)",
  "2 small carrots",
  "1 small zucchini",
  "2 celeries",
  "1 fresh red chilli pepper",
  "1 small ginger root",
  "2 cloves of garlic",
  "2 table spoons of soy sauce",
  "2   tea spoons of sesame oil",
  "small bunch of mint",
  "small bunch of cilantro"
],
"steps": [
  "Peel carrots and zucchini and cut them diagonally in circles.",
  "Remove the seeds from Sweet peppers, cut into wide strips.",
  "Clean the champignons and cut them into 3 mm thick slices.",
  "Cut Celery into small pieces.",
  "Peel and chop the garlic.",
  "Peel and grate the ginger.",
  "finely chop the Chilli.",
  "Heat sesame oil in a wok and simmer garlic, ginger and chilli for 1 minute, then add carrots, after 2 minutes - zucchini, after 2 minutes - sweet pepper, after 2 minutes - mushrooms, after 2 minutes - celery and spinach and simmer 2-3 minutes.",
  "Cilantro and mint finely chopped, sprinkle with vegetables, pour in soy sauce, mix everything."
 
]
},

{
"id": 35,
"ingredients_string": "eggplants, cilantro",
"name": "baked eggplants",
"ingredients": [
  "3 eggplants",
  "cilantro bunch",
  "2 cloves of garlic",
  "half of juice of lemon",
  "2 table spoons of olive oil",
  "half of tea spoon of coriander seeds"
],
"steps": [
  "Preheat the oven to 200 ° C .",
  "Bake the whole eggplants in the preheated oven for 20–30 minutes until the skin is cracked.",
  "Peel the garlic and pass it through the garlic press.",
  "Prepare the dressing: rub the coriander seeds in a mortar, add garlic, salt, pepper, lemon juice and olive oil, mix everything.",
  "Peel hot eggplants, chop the flesh finely and mix with dressing.",
  "Finely chop the cilantro and sprinkle the eggplants."
 
]
},

{
"id": 36,
"ingredients_string": "onions, bacon",
"name": "baked onions",
"ingredients": [
  "6 onions",
  "150 grams bacon",
  "50 grams softened butter",
  "3 cloves of garlic"
],
"steps": [
  "Preheat the oven to 200 ° C .",
  "Peel the Onions, cut off the tops and bottoms so that the bulbs can stand, at the top to make a cross-wise cut almost to the bottom but not quite.",
  "Finely chop the bacon.",
  "Grind the garlic in a mortar with salt and pepper.",
  "Mix butter with bacon and garlic and fill in the middle of onions.",
  "Place the onions on a baking sheet covered with baking paper and bake in a preheated oven for 20-25 minutes."
 
]
},

{
"id": 37,
"ingredients_string": "pumpkin, cilantro and parsley, garlic",
"name": "baked pumpkin",
"ingredients": [
  "500 grams pumpkin",
  "handful of cilantro and parsley",
  "2 cloves of garlic",
  "half of juice of lemon",
  "2 table spoons of olive oil",
  "half of tea spoons of coriander seeds"
],
"steps": [
  "Preheat the oven to 200 ° C .",
  "Peel and grind the garlic in a mortar with salt, pepper, coriander and herbs.",
  "Add olive oil and lemon juice, mix everything.",
  "Cut the pumpkin into large pieces and rub with the mixture.",
  "Make a large pocket of foil, put in the pumpkin and bake in a preheated oven for 30–35 minutes."
 
]
},

{
"id": 38,
"ingredients_string": "beetroots, carrots, small tomatoes, cumin, coriander seeds",
"name": "baked mix of vegetables",
"ingredients": [
  "500 grams beetroots",
  "500 grams carrots",
  "500 grams small tomatoes",
  "8 table spoons of olive oil",
  "3 tea spoons balsamic vinegar",
  "tea spoon of cumin",
  "half of tea spoon of coriander seeds"
],
"steps": [
  "Preheat the oven to 200 ° C .",
  "Peel carrots and beetroots and cut into thin circles.",
  "Prepare dressing: grind cumin, coriander, salt and pepper in a mortar, pour in olive oil and balsamic vinegar, mix everything.",
  "Deep beetroots and carrots into a dressing, put on a baking sheet and bake in a preheated oven for 20 minutes, then turn over, add tomatoes and bake for 15-20 minutes until ready."
 
]
},

{
"id": 39,
"ingredients_string": "baby carrots, garlic, rosemary, red wine, olive oil",
"name": "baby carrots",
"ingredients": [
  "kilogram of baby carrots",
  "4 young garlic bulbs",
  "4 sprigs of rosemary",
  "100 milliliters of red wine",
  "4 table spoons of olive oil"
],
"steps": [
  "Cut carrots into thin slices diagonally.",
  "Peel and chop the garlic.",
  "Heat olive oil in a large frying pan, fry sliced ​​carrots on both sides, salt and pepper.",
  "Add 3 sprigs of rosemary to the pan, chopped garlic, pour in red wine and simmer for 5-7 minutes.",
  "Put the carrots in a salad bowl, sprinkle with the leaves of the remaining rosemary and serve."
]
},

{
"id": 40,
"ingredients_string": "zucchinis, eggplants, carrots, green beans, cauliflower, broccoli, wheat flour, corn flour",
"name": "tempura vegetables",
"ingredients": [
  "2 small zucchini",
  "1 eggplant",
  "200 grams carrots",
  "200 grams fresh green beans",
  "200 grams cauliflower",
  "200 grams broccoli",
  "1 half of cups wheat flour",
  "half of cup corn flour",
  "500ml of corn oil",
  "300ml of very cold sparkling water or beer"
],
"steps": [
  "Carrot, eggplant and zucchini cut into thin slices diagonally.",
  "Cauliflower and broccoli divided into small buds.",
  "Prepare the dough: mix wheat and corn flour, sift, add sparkling water or beer, salt and pepper. Make the dough, it should resemble liquid sour cream.",
  "Heat corn oil almost to a boil in a very deep frying pan (wok).",
  "Deep the pieces of vegetables into the dough, then put into the hot oil, fry in small portions for 2-3 minutes and spread on a paper towel to get rid of excess fat."
 
]
}


];

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}


function render(inputHandler, text) {
  var responseBuilder = inputHandler.responseBuilder;
  responseBuilder.withStandardCard(appName, text, smallImageUrl, largeImageUrl);

  if (customhelpers.supportsDisplay(inputHandler)) {
    const image = new Alexa.ImageHelper()
      .addImageInstance(smallImageUrl)
      .getImage();
    const bgImage = new Alexa.ImageHelper()
      .addImageInstance(largeImageUrl)
      .getImage();
    const title = appName;
    const primaryText = new Alexa.RichTextContentHelper()
      .withPrimaryText(text)
      .getTextContent();
    const bodyTemplate = 'BodyTemplate6';

    responseBuilder.addRenderTemplateDirective({
      type: bodyTemplate,
      backButton: 'hidden',
      backgroundImage: bgImage,
      image,
      title,
      textContent: primaryText,
    });
  }

  return responseBuilder;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
	  return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    var pureText = 'Hi. Chief Alex is here. You can get a recipe by ingredient or by name. Or I can surprise you';
	  var speechText = '<voice name="Matthew">' + pureText + '</voice>';
	  
    var builder = render(handlerInput, pureText);
    return builder
	    .speak(customhelpers.voiced(pureText))
	    .reprompt(customhelpers.voiced(pureText))
	    .getResponse();
    }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
	  return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
	    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
	  var pureText = 'You can say "surprise me" or "find me a recipe of something"';
    var builder = render(handlerInput, pureText);
	  return builder
	    .speak(customhelpers.voiced(pureText))
	    .reprompt(customhelpers.voiced(pureText))
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
    const pureText = 'Ok. Goodbye!';

    return handlerInput.responseBuilder
      .speak(customhelpers.voiced(pureText))
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
	  
      var builder = render(handlerInput, pureText);
      return builder
	      .speak(customhelpers.voiced(pureText))
	      .reprompt('Say "OK" if you want to cook ' + recipe.name)
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
    var pureText = '';
    var repromptText = 'say "Yes", "No" or "Cancel"';

    if (sa.step < 0 && sa.lastRecipe) {
      var r = sa.lastRecipe;
      responseText = 'To make ' + r.name + ' you need the following ingredients. ' + r.ingredients.join(' <break time="600ms"/> ') + '. Are you ready to make it?';
      pureText = "Ingredients:\n" + r.ingredients.join(",\n");
      sa.step = 0;
    }
    else if (sa.step >= 0 && sa.lastRecipe){
      if (sa.lastRecipe.steps[sa.step]) {
        responseText = sa.lastRecipe.steps[sa.step];
        pureText = "Step " + (sa.step+1) + " of " + sa.lastRecipe.steps.length + "\n" + sa.lastRecipe.steps[sa.step];
        sa.step = sa.step + 1;
        // add audio
        responseText = responseText + '<break time="3s"/> Take your time. When you\'ll be ready, say "Alexa, Next!" <audio src="https://chief-alex.s3.amazonaws.com/1-minute-of-silence.mp3"/> Repeat or Next?'
        repromptText = 'say "Repeat" or "Next"';
      }
      else {
        responseText = 'You are all done';
        pureText = 'You are all done';
        // add short audio
        responseText = responseText + "<audio src='soundbank://soundlibrary/musical/amzn_sfx_bell_timer_01'/>";
      }
    }

    sa.lastSpeech = responseText;

    var builder = render(handlerInput, pureText);
    return builder
      .speak(customhelpers.voiced(responseText))
      .reprompt(repromptText)
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
      
      var responseText = 'Okay. I\'ll find something better. ' +
        'How about ' + recipe.name + '?';
    }

    return handlerInput.responseBuilder
      .speak(customhelpers.voiced(responseText))
      .reprompt('You should say Yes or No')
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
  
    var responseText = '';

    if (sa.mode === 'surpriseMe' || sa.mode === 'searchByName' || sa.mode === 'searchByIngredient') {
      if (sa.step == -1 && sa.lastRecipe) { // repeat ingredients
        var r = sa.lastRecipe;
        responseText = 'To make ' + r.name + ' you need the following ingredients. ' + r.ingredients.join(' <break time="600ms"/> ') + '. Are you ready to make it?';
        pureText = "Ingredients:\n" + r.ingredients.join(",\n");
      }
      else { // repeat the last step 
        if (sa.lastSpeech)
          responseText = sa.lastSpeech;
        else
          responseText = 'Sorry. There is nothing to repeat';
      }
    }

    return handlerInput.responseBuilder
      .speak(customhelpers.voiced(responseText))
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
    
    var pureText = '';
    var responseText = '';
    var repromptText = 'say "Yes", "No" or "Cancel"';

    if (sa.mode === 'surpriseMe' || sa.mode === 'searchByName' || sa.mode === 'searchByIngredient') {
      if (sa.step >= 0 && sa.lastRecipe){
        if (sa.lastRecipe.steps[sa.step]) {
          pureText = "Step " + (sa.step+1) + " of " + sa.lastRecipe.steps.length + "\n" + sa.lastRecipe.steps[sa.step];
          responseText = sa.lastRecipe.steps[sa.step];
          sa.step = sa.step + 1;
          // add audio
          responseText = responseText + '<break time="3s"/> Take your time. When you\'ll be ready, say "Alexa, Next!" <audio src="https://chief-alex.s3.amazonaws.com/1-minute-of-silence.mp3"/> Repeat or Next?'
          repromptText = 'say "Repeat" or "Next"';
        }
        else {
          pureText = 'You are all done';
          responseText = 'You are all done';
          repromptText = 'Chief Alex is still here. You can get a recipe by ingredient or by name. Or I can surprise you';
          // add short audio
          responseText = "<audio src='soundbank://soundlibrary/musical/amzn_sfx_bell_timer_01'/>" + responseText;
        }
      }
    }

    sa.lastSpeech = responseText;

    var builder = render(handlerInput, pureText);
    return builder
      .speak(customhelpers.voiced(responseText))
      .reprompt(repromptText)
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
        var speechText = customhelpers.voiced(say);
        resolve(render(handlerInput, say)
	        .speak(speechText)
	        .reprompt('Try again. ' + speechText)
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

        var say = '';
        var show = '';
        if (r.length > 0) {
          sessionAttributes.mode = 'searchByIngredient';
//          sessionAttributes.lastRecipeId = r.id; 
//          sessionAttributes.lastRecipe = r;
//          sessionAttributes.step = -1;
          //say += 'Okay. Let\’s make ' + r.name + '. Are you ready?';
          const reducer = (accumulator, currentValue) => accumulator + ' <break time="600ms"/> ' + currentValue.name;
          const reducer1 = (accumulator, currentValue) => accumulator + ', ' + currentValue.name;
          const reducer2 = (accumulator, currentValue) => accumulator + ' or ' + currentValue.name;
          var recipes_list = r.reduce(reducer, '');
          var clean_recipes_list = r.reduce(reducer1, '');
          var alt_recipes_list = r.reduce(reducer2, '');
          say += 'I have ' + recipes_list + ', what do you want to cook?';
          show += 'I have ' + clean_recipes_list + ', what do you want to cook?';
        }
        else {
          say += 'Sorry. I don\'t know recipes with ' + ingredientName;
        }
        var speechText = customhelpers.voiced(say);
        resolve(render(handlerInput, show)
	        .speak(speechText)
	        .reprompt('Say: I want to cook ' + alt_recipes_list)
          .withStandardCard('Chief Alex', show, smallImageUrl, largeImageUrl)
	        .getResponse()
        );
      });
    })
  }
};

const CustomTestIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'CustomTestIntent';
  },
  handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;
  
    var responseText = 'This is a custom test';
    var repromptText = 'Try to test something';

    responseBuilder.withStandardCard('Chief Alex', responseText, smallImageUrl, largeImageUrl);

    if (customhelpers.supportsDisplay(handlerInput)) {
      const image = new Alexa.ImageHelper()
        .addImageInstance(smallImageUrl)
        .getImage();
      const bgImage = new Alexa.ImageHelper()
        .addImageInstance(largeImageUrl)
        .getImage();
      const title = 'Chief Alex';
      const primaryText = new Alexa.RichTextContentHelper()
        .withPrimaryText(responseText)
        .getTextContent();
      const bodyTemplate = 'BodyTemplate6';

      responseBuilder.addRenderTemplateDirective({
        type: bodyTemplate,
        backButton: 'visible',
        backgroundImage: bgImage,
        image,
        title,
        textContent: primaryText,
      });
    }

    return responseBuilder
      .speak(customhelpers.voiced(responseText))
      .reprompt(repromptText)
      .getResponse();
  },
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
    SearchByIngredientIntentHandler,
    CustomTestIntentHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
