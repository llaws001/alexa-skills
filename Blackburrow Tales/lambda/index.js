/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk');
const util = require('./util.js');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.gameState = 'New';
        
        
        const audioUrl = util.getS3PreSignedUrl("Media/intro-1.mp3").replace(/&/g,'&amp;');
        const speakOutput = switchVoice(`<audio src="${audioUrl}"/>Welcome to Blackburrow Tales. You can say "list tales" for a list of available stories for play.`, "Justin");

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const ListTalesHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
        && request.intent.name === 'ListTalesIntent';
    },
    handle(handlerInput){
        const speakOutput = switchVoice(`The following tales are available for play: Full moon. You can start a tale by saying "lets play" and then the name of the tale. For an explanation on how to play, say "tutorial".`, "Justin");
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
};

const TutorialHandler = {
    canHandle(handlerInput){
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
        && request.intent.name === 'TutorialIntent';
    },
    handle(handlerInput){
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
       
        const speakOutput = switchVoice(`"Blackburrow Tales" is an interactive horror experience. Each tale is a horror story controlled by you. Choices will be presented to you at key points in the story. 
        At these points, several options will be available. All you need to do is speak your desired choice, and the story will continue. 
        Your decisions will determine the outcome of the story, so choose wisely. You can say repeat at these key points to hear your potential choices again.
        
        You can say "list tales" for a list of available stories for play.`, "Justin");
        
        
        sessionAttributes.lastResponse = speakOutput;   
        handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(switchVoice('You can say, "list tales" for a list of available stories for play.', "Justin"))
        .getResponse();
    }
};



//full Moon

const FullMoonHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
        && request.intent.name === 'FullMoonIntent';
    },
     handle(handlerInput){
         
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.gameState = 'Full Moon'; 
        sessionAttributes.gameStatus = 'start'; 
         
         
        const audioUrl = util.getS3PreSignedUrl("Media/story-intro-1.mp3").replace(/&/g,'&amp;');
        
        let speakOutput = switchVoice(`<audio src="${audioUrl}"/>Your name is Arthur Dean. You are a detective in the dejected city of Blackburrow. 
        In this city, the supernatural becomes natural. Today, your chief has put you on a new case. You are to investigate the killings of several of Blackburrow’s citizens. 
        Each of which has been carried out in a ghastly and inhuman manner. The chief has provided you with a case file and a location of the last known killing. 
        
        The case file lies on your desk. It is full of photos and information regarding the killings. Do you read through it, or do you go to the last known location of a victim?`, "Justin");
    
        sessionAttributes.lastResponse = speakOutput;   
        handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
    
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
     }
};

const FullMoonDecisionHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
        && request.intent.name === 'FullMoonDecisionIntent';
    },
    handle(handlerInput){
    
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();  
      
        
    if(sessionAttributes.gameState === 'Full Moon'){
        
        //const userInputFullMoon = handlerInput.requestEnvelope.request.intent.slots.userInputFullMoon.value;
        const userInputFullMoon = slotValue(handlerInput.requestEnvelope.request.intent.slots.userInputFullMoon);
        
        
         if (userInputFullMoon === "case file"){
            
            sessionAttributes.readCaseFile = true;
            sessionAttributes.gameStatus = 'caseFile';
            
            
            const audioUrl = util.getS3PreSignedUrl("Media/page_turning-1.mp3").replace(/&/g,'&amp;');
            
            let speakOutput = switchVoice(`<audio src="${audioUrl}"/> You read the case file. As you mull through the photographs of the victims, you start to get queasy. 
            The victims have been dismembered and gored. Their heads twisted and their stomachs opened. Each victim suffered a terrible fate. 
            
            A map marking the location of the killings and a timeline are a part of the report. As you look over the map and timeline, you begin to notice a pattern. 
            The killings all occured around the time of a full moon and they were all within a 10 mile radius of each other. A realization dawns on you, a full moon will occur in 2 days. 
            
            Utilizing this new found pattern, you are able to deduce when and possibly where the next attack will occur. You want to play this safe, but you also want to catch the culprit. 
            Do you want to wait until the full moon and go to the expected attack site, or do you want to go now and scope out the place?`, "Justin");
            
            sessionAttributes.lastResponse = speakOutput;   
            handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
            
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        } else if (userInputFullMoon === "location"){
            
            sessionAttributes.gameStatus = 'location';
            
            let speakOutput = switchVoice(`You arrive at the location of the last known victim, a dreary alleyway near the channel of water running through the center of the city. 
            There are still bloodstains on the ground from the victim. You look over the scene and notice that the splatter of blood from the victim goes two different directions. 
            You investigate further, and notice a small trail of droplets leading away from the scene. Eventually you come to a dead end, but you do find another clue. 
            There are claw marks that dig deep in the brick along the wall.
            
            At this point, you start to wonder if you should follow the claw marks to the rooftop, or go back and read the case file in case you missed something useful. What would you like to do?`, "Justin");
            
            sessionAttributes.lastResponse = speakOutput;   
            handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
            
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        } else if (userInputFullMoon === "claw marks") {
            
            if(sessionAttributes.gameStatus === 'location'){
                
                sessionAttributes.gameStatus = 'marks';
                const audioUrl = util.getS3PreSignedUrl("Media/bell-1.mp3").replace(/&/g,'&amp;');
                
            
                let speakOutput = switchVoice(`You see that the claw marks continue up the wall to the roof. You decide to head to the roof of the building. 
                Once you reach the roof, you look around with dismay, there is little to be found. But wait, upon further examination, you see a small clump of hair caught within a gutter. 
                You pick it up and notice how course it is. The hair is unlike any you have ever felt before. You decide to take it to an old friend of yours, Terrance. He is an animal specialist on the east side of the city.
                You arrive at Terrance’s office. A small quaint office fit for a humble man. As you walk in, a bell rings notifying the practitioner of your arrival. <audio src="${audioUrl}"/> Terrance walks into the room, surprised to see his old friend.` + 
                
                switchVoice(`“What can I do for you today, Arthur”.`, "Matthew") +
                
                `You show him the fur and you request that he examine it. Terrance takes the fur to his lab in the back. 
                He returns several minutes later and explains that the fur resembles that of a wild dog, yet it is more dense. He mentions that he does not know of an animal in the area with similar fur. 
                At this point, you are at a loss for how to proceed. You feel the desire for a stiff drink. You can go to the tavern downtown, or you can notify the chief of your findings. What do you do?`, "Justin");
                
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
    
        } else if (userInputFullMoon === "notify chief"){
            
            if(sessionAttributes.gameStatus === 'marks'){
                const audioUrl = util.getS3PreSignedUrl("Media/gunfire-1.mp3").replace(/&/g,'&amp;');
            
            
                let speakOutput = switchVoice(`You return to the precinct to notify the chief of your findings. You explain to him that it appears you are hunting a wild animal. 
                You request that a notice be put out to warn the public of an animal on the prowl within Blackburrow. A couple of days pass, and you begin to wonder if the animal has left town.
            
                All of a sudden a stranger sprints into the precinct crying of a wild animal terrorizing the west side of the city. 
                You gather a party of your finest officers and head out for the west side of town. 
                You arrive at the last known location of the beast. Blood litters the ground, and you hear cries coming from an alleyway nearby. You ask the officers to be alert, and you slowly make your way towards the alleyway.
                Upon entering the corridor, you see it.  A monstrosity stands before you. Its eyes yellow and glowing in the moonlight. Its fangs as long as knives. Fur as black as night and claws covered in gore. It looms over a corpse, gnawing at its prey. 
                Terror penetrates your mind, and without thinking, you shout, FIRE! <audio src="${audioUrl}"/> You and your officers open fire on the beast. A spray of bullets penetrates its flesh. 
                It roars in anger and begins to charge. Do you run, or do you continue firing?`, "Justin");
                
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
            
        } else if (userInputFullMoon === "continue firing"){
            
            const audioUrl = util.getS3PreSignedUrl("Media/gunfire-1.mp3").replace(/&/g,'&amp;');
            const end = util.getS3PreSignedUrl("Media/finish-1.mp3").replace(/&/g,'&amp;');
            
           if(sessionAttributes.gameStatus === 'marks'){
        
                let speakOutput = switchVoice(`You keep shooting. <audio src="${audioUrl}"/> The beast begins to close in, tearing apart officers along the way. When it finally reaches you, you begin to fret that the creature is unkillable. 
                It grabs you with its claws and bites into your neck. Pain radiates throughout your body, and you begin to scream. Officers continue to shoot the beast, and the creature drops you. 
                The pain eventually turns to warmth and you fall unconscious. Several days later you awaken in the hospital to the presence of your chief. He informs you that the creature disappeared. 
                They only found the corpses of its victims. With sadness in his voice, he explains that the party of officers perished in the fight and he mentions that it appears a civilian was caught in the crossfire. 
                You lie there and acknowledge him with a brief nod. Pain overtakes your neck, and you cry for a nurse.
                Several weeks later, you awaken in the woods, shirtless and covered in blood. Suddenly, a feeling of epiphany overcomes you. You are now that which you hunted. A creature of the night. 
                A hell-beast. A werewolf.  <audio src="${end}"/>`, "Justin");
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
           } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else if (userInputFullMoon === "run"){
            
            const audioUrl = util.getS3PreSignedUrl("Media/growl-1.mp3").replace(/&/g,'&amp;');
            const badEnd = util.getS3PreSignedUrl("Media/death-1.mp3").replace(/&/g,'&amp;');
            
            if(sessionAttributes.gameStatus === 'marks'){
            
                let speakOutput = switchVoice(`You turn to run. You can hear the sound of the beast barreling towards you. 
                As you run, you turn to look behind you. Doing so was a fatal mistake. You trip over a loose stone in the road. 
                Dazed and confused, you look up and see the creature. Fangs bared and claws out, the monstrosity lets out a roar  <audio src="${audioUrl}"/> and swipes your neck with its claw. 
                There is pain, and then the feeling of warmth. Eventually, darkness begins to descend upon you, and then there is nothingness. Arthur Dean, has fallen. <audio src="${badEnd}"/>`, "Justin");
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else if(userInputFullMoon === "go to tavern") {
            
            const audioUrl = util.getS3PreSignedUrl("Media/bar-1.mp3").replace(/&/g,'&amp;');
            
            if(sessionAttributes.gameStatus === 'marks'){
                
                sessionAttributes.gameStatus = 'tavern';
                
                let speakOutput = switchVoice(`You go to the tavern downtown. <audio src="${audioUrl}"/> It is bustling with the denizens of blackburrow. 
                
                
                You take a seat at the bar and order your drink of choice, whiskey. 
                
                While there, you overhear a patron talking about the recent killings. He mentions that he thinks it has to do with the gypsies on the outskirts of town. He spoke of a burley black bear travelling with them.
                You start to wonder if this is the animal you are seeking. You break out a map, and ask the patron to point to the gypsy camp. Reluctantly, he does so. 
                Now that you know the location of the gypsy camp, you believe you may actually be able to solve this mystery. Do you tell the chief about the camp, or do you go to the camp now?`, "Justin");
                
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                return handlerInput.responseBuilder 
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else if (userInputFullMoon === "tell the chief") {
            
            const badEnd = util.getS3PreSignedUrl("Media/death-1.mp3").replace(/&/g,'&amp;');
            const gunfire = util.getS3PreSignedUrl("Media/many_gunshots-1.mp3").replace(/&/g,'&amp;');
            const car = util.getS3PreSignedUrl("Media/old_car-1.mp3").replace(/&/g,'&amp;');
            
            if(sessionAttributes.gameStatus === 'tavern'){
                
                let speakOutput = switchVoice(`You head to the precinct to tell the chief about the gypsy camp. He tells you that the gypsies have been in town for quite some time. His face scrunches up, and you can tell he is in deep thought. 
                After several minutes, he says that the killings actually started at the time that they came into town. 
                He sends you to the camp with two other officers, Officer Jonas and Officer Perez. 
                
                <audio src="${car}"/>
                
                You arrive at the camp. It is clear that your party is unwelcome. All of the gypsies have their eyes on you. You announce that you are there because you are pursuing a lead regarding a rampaging animal. You tell them that you believe it to be the bear traveling with them. 
                Their leader approaches you, and tells you that their bear is not to blame. A beast from the dark depths of hell is the one carrying out the attack. Officer Jonas, a young hot shot, laughs, storms up to the Gypsy leader , and threatens her.
                Jonas’s threat causes a stir in the camp, and in the blink of an eye, the gypsies have their weapons aimed at you.
                Jonas and Perez draw their weapons, and you can see the fear in their eyes. All is quiet. <audio src="${gunfire}"/>
                You do not know which side fired first, but the scene quickly turns into a blood bath. Officers firing upon gypsies, and gypsies upon officers. You see Perez take a bullet to the head, and Jonas a bullet to the shoulder. Unfortunately, you are caught in the middle. 
                Several bullets penetrate your chest, and you fall to the ground. The last thought that crosses your mind is that you should have come alone. <audio src="${badEnd}"/>`, "Justin");
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
            
                return handlerInput.responseBuilder 
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else if (userInputFullMoon === "go to camp"){
             
            const car = util.getS3PreSignedUrl("Media/old_car-1.mp3").replace(/&/g,'&amp;');
            const howl = util.getS3PreSignedUrl("Media/werewolf-howl-1.mp3").replace(/&/g,'&amp;'); 
            
            if(sessionAttributes.gameStatus === 'tavern'){
                if(sessionAttributes.readCaseFile === true){
                    
                    let speakOutput = switchVoice(`<audio src="${car}"/> You make your way to the camp, and it is clear upon arrival that you are not welcome. All eyes are on you as you walk into the camp. With hesitation, you reach into your coat. 
                    
                        
                    This action triggers fear within the encampment. Several of the gypsies draw their weapon and aim it at you.
                    
                    With your hand still in your pocket, you explain that you are only there to ask a simple question. You do not want to cause any trouble. The item in your pocket is for reference. 
                    The gypsies, lower their weapons. You pull out the fur and ask if this belongs to the bear in their encampment. The gypsy closest to you, takes the fur and looks it over. 
                    You see a glint of fear in her eyes. She takes you to their camp leader.Once in the presence of their leader, you recall your journey up to this point. 
                    
                    The leader looks over the fur and explains that it belongs to a creature of hell. She tells you that the creature can only be killed with silver. 
                    
                    She pulls out a small wooden box, opens it, and reveals several silver bullets. She holds one up and explains that this bullet is your only path to success.
                    
                    She gives you the bullets, and tells you that the creature will present itself at the time of a full moon. 
                    
                    You notify the chief of your findings. He looks at you in disbelief and scoffs at this gypsy hocus pocus. He tells you that you are on your own to pursue such a ridiculous lead.
                    
                    With dismay, you head back to your office. Pondering over what the gypsy said, you come to the conclusion that you need to locate the creature on a full moon. 
                    
                    Remembering the case file, you decide to head to the location of the next possible attack. 
                    
                    Several hours pass before you go to the location.
                    
                    Once there, there does not appear to be any sign of the creature when all of a sudden you hear it 
        
                    <audio src="${howl}"/>
                    
                    You look up to the rooftop of the nearest building, and you see it barrelling across it. A towering figure with claws the size of daggers. 
                    
                    You pull out your gun and load it with the silver bullets.The creature appears to be too far to shoot, but you think you can hit it.
                    
                    Do shoot the beast, or do you chase it? `, "Justin");
                    
                    sessionAttributes.lastResponse = speakOutput;   
                    handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                    
                    
                    return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
                }  else {   
                    let speakOutput = switchVoice(`<audio src="${car}"/>You make your way to the camp, and it is clear upon arrival that you are not welcome. All eyes are on you as you walk into the camp. With hesitation, you reach into your coat. 
                    
                    This action triggers fear within the encampment. Several of the gypsies draw their weapon and aim it at you.
                    
                    With your hand still in your pocket, you explain that you are only there to ask a simple question. You do not want to cause any trouble. The item in your pocket is for reference. 
                    The gypsies, lower their weapons. You pull out the fur and ask if this belongs to the bear in their encampment. The gypsy closest to you, takes the fur and looks it over. 
                    You see a glint of fear in her eyes. She takes you to their camp leader.Once in the presence of their leader, you recall your journey up to this point. 
                    
                    The leader looks over the fur and explains that it belongs to a creature of hell. She tells you that the creature can only be killed with silver. 
                    
                    She pulls out a small wooden box, opens it, and reveals several silver bullets. She holds one up and explains that this bullet is your only path to success.
                    
                    She gives you the bullets, and tells you that the creature will present itself at the time of a full moon. 
                    
                    You notify the chief of your findings. He looks at you in disbelief and scoffs at this gypsy hocus pocus. He tells you that you are on your own to pursue such a ridiculous lead.
                    
                    With dismay, you head back to your office. Pondering over what the gypsy said, you come to the conclusion that you need to locate the creature on a full moon. 
                    
                    You see the case file on your desk, you think it may be wise to read it at this time. 
                    
                    You read the case file. It contains a timeline of the killings and a map of their locations. You begin to notice a pattern. After a short while, you believe that you have figured out where the next attack will occur. 
                    
                    Several hours pass, and you head to the location where you believe the next attack will occur.
                    
                    Once there, there does not appear to be any sign of the creature when all of a sudden you hear it 
        
                    <audio src="${howl}"/>
                    
                    You look up to the rooftop of the nearest building, and you see it barrelling across it. A towering figure with claws the size of daggers. 
                    
                    You pull out your gun and load it with the silver bullets.The creature appears to be too far to shoot, but you think you can hit it.
                    
                    Do shoot the beast, or do you chase it? `, "Justin");
                    
                    sessionAttributes.lastResponse = speakOutput;   
                    handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                        
                    
                    return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
                    }
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else if (userInputFullMoon === "shoot the beast"){
            
            const end = util.getS3PreSignedUrl("Media/finish-1.mp3").replace(/&/g,'&amp;');
            const audioUrl = util.getS3PreSignedUrl("Media/gunfire-1.mp3").replace(/&/g,'&amp;'); 
            const bones = util.getS3PreSignedUrl("Media/bones_breaking-1.mp3").replace(/&/g,'&amp;');
            
            if(sessionAttributes.gameStatus === 'tavern'){ 
                let speakOutput = switchVoice(`With divine aim, you shoot at the beast <audio src="${audioUrl}"/> and hit it. It collapses on the roof, wounded. It gets up and growls in anger. It turns and focuses on you. 
    
                The creature lets out a brief howl, leaps from the rooftop to the street, and charges you. You continue shooting.
                
                The silver bullets penetrate the creature's thick black coat. It falls to the ground, whimpering. You feel a sense of pity, but you quickly brush it off once you remember what it has done. 
                
                You walk up to it, and with your last silver bullet, you end its life. 
                
                You stand there in awe of the lifeless creature. The gypsy was not kidding. It truly is a creature from hell. You let out a sigh of relief, but then you notice the creature begins to change. 
                
                Bones snap <audio src="${bones}"/>, and its hair regresses.  Several minutes go by and what was once a hell-beast is now a woman. You simply stare in amazement. The tales are true. Werewolves do in fact exist, and you have slayed one. 
                
                The awe begins to fade, and the only thought you are left with is how to explain this to your chief. <audio src="${end}"/>`, "Justin");
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else if (userInputFullMoon === "chase it"){
            
            const audioUrl = util.getS3PreSignedUrl("Media/gunfire-1.mp3").replace(/&/g,'&amp;'); 
            const snarl = util.getS3PreSignedUrl("Media/growl-1.mp3").replace(/&/g,'&amp;');
            const badEnd = util.getS3PreSignedUrl("Media/death-1.mp3").replace(/&/g,'&amp;');
            
            if(sessionAttributes.gameStatus === 'tavern'){ 
            
                let speakOutput = switchVoice(`You chase the beast, but it is too fast for you. You aim your weapon and open fire <audio src="${audioUrl}"/>
                
                You miss. It turns in frustration and charges you. 
    
                You continue to fire, but you are now too terrified to aim with precision. The beast reaches you, and leaps at you, knocking you to the ground. It stands over you, snarling <audio src="${snarl}"/> 
                
                You notice its wolf-like features before it bites deep into your neck. Life begins to fade from you, as darkness settles in, you wish that you had just taken the shot. 
                
                <audio src="${badEnd}"/>`, "Justin");
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else if (userInputFullMoon === "wait until full moon"){
            const audioUrl = util.getS3PreSignedUrl("Media/handgun_fire-1.mp3").replace(/&/g,'&amp;'); 
            const badEnd = util.getS3PreSignedUrl("Media/death-1.mp3").replace(/&/g,'&amp;');
            const guts = util.getS3PreSignedUrl("Media/guts-1.mp3").replace(/&/g,'&amp;');
            
            if(sessionAttributes.gameStatus === 'caseFile'){
            
                let speakOutput = switchVoice(`You wait until the full moon, and head to the location. As you investigate, you hear a load of commotion near by. You place your hand on your holster, and walk towards it.
                
                You enter a long corridor. At the end of it is a monstrosity as black as night. Its yellow eyes staring you down. It begins to charge.
                
                You quickly pull out your weapon and open fire <audio src="${audioUrl}"/> but your bullets seem to be doing nothing. The creature quickly reaches you and swipes your stomach with its claws <audio src="${guts}"/> 
                
                You look down and see your intestines lying on the ground. You fall down and all turns to black. <audio src="${badEnd}"/>`, "Justin");
                
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                return handlerInput.responseBuilder 
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else if (userInputFullMoon === "scope it out"){
            
            const audioUrl = util.getS3PreSignedUrl("Media/bar-1.mp3").replace(/&/g,'&amp;'); 
            
            if(sessionAttributes.gameStatus === 'caseFile'){
                
                sessionAttributes.gameStatus = 'tavern';
                
                let speakOutput = switchVoice(`You head to the location to scope it out. After a great deal of looking around, you deduce that there is not much of significance here. 
                All you notice is that the area is rather quiet with little traffic. With little to be found, you decide to head to a tavern for a much needed drink. 
                
                You go to the tavern downtown.  <audio src="${audioUrl}"/>  It is bustling with the denizens of blackburrow 
                
                You take a seat at the bar and order your drink of choice, whiskey. 
    
                While there, you overhear a patron talking about the recent killings. He mentions that he thinks it has to do with the gypsies on the outskirts of town. He spoke of a burley black bear travelling with them.
    
                You start to wonder if this is the animal you are seeking. You break out a map, and ask the patron to point to the gypsy camp. Reluctantly, he does so. 
    
                Now that you know the location of the gypsy camp, you believe you may actually be able to solve this mystery. Do you tell the chief about the camp, or do you go there now?`, "Justin");
                
                
                 
                sessionAttributes.lastResponse = speakOutput;   
                handlerInput.attributesManager.setSessionAttributes( sessionAttributes );
                
                
                return handlerInput.responseBuilder 
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
            } else {
                
                let speakOutput = switchVoice(`You have not reached this point of the game. Please try again.`, "Justin")
                
                 return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
                
            }
        } else {
            
            let speakOutput = switchVoice(`I'm sorry, I didn't quite get that. Please say your choice again.`, "Justin");
            
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }
        
    } else {
        
        let speakOutput = switchVoice(`Please say let's play and then the name of a tale to start`, "Justin");
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(switchVoice(`Please say let's play and then the name of a tale to start. You can say "list tales" for a list of available stories for play.`, "Justin"))
        .getResponse();
    }
  }
};



//functions
function switchVoice(text,voice_name) {
  if (text){
    return "<voice name='" + voice_name + "'>" + text + "</voice>"
  }
}

function slotValue(slot, useId){
    let value = slot.value;
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code === 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
    }
    return value;
}


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'To start a game, say "lets play" followed by the name of the game.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ListTalesHandler,
        TutorialHandler,
        HelpIntentHandler,
        FullMoonHandler,
        FullMoonDecisionHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();