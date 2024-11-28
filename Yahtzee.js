// JavaScript source code, 20224612_cse2wdx_assignment2

//****************** GLOBAL VARIABLES ***********************
const diceImg = ["Images/1.png", "Images/2.png", "Images/3.png", "Images/4.png", "Images/5.png", "Images/6.png"];
const diceImgLocked = ["Images/1x.png", "Images/2x.png", "Images/3x.png", "Images/4x.png", "Images/5x.png", "Images/6x.png"];

let rollNo = 0;//current number of rolls
let locked = [];//array of dice locks
locked = [false, false, false, false, false];
let dice = [];//current array of dice values

//totals accumulating until page re-loads:
let upperSubtotal = 0;
let upperBonus = 0;
let upperTotal = 0;
let lowerTotal = 0;
let yahtzeePoints = 0;
let yahtzeeBonus = 0;
let totalScore = 0;
let lastButtonID = "";//ID of last-clicked button, used for manipulating SubmitButton

//********************************** FUNCTIONS *********************************************

//function preparing controls for rolling dice
function getReady() {
    $("button.RollButton").prop('disabled', false);
    $("button.RollAgain").prop('disabled', true);
    $("div.Attempts").html("Game on! You can roll dice three times<br><br>");
    rollNo = 0;
    locked = [false, false, false, false, false];
    //display blank dice as not clickable
    for (var i = 0; i < 5; ++i) {
        $("img.Dice" + (i + 1)).attr("src", "Images/q.png").attr("alt", "?");
        $(".Dice").css({ "pointer-events": "none" });
    }
    $("#SubmitYahtzee").show();//restoring Yahtzee button 
}

/* Function emulating rolling dice by saving five random 1-6 numbers in dice[] and displaying corresponding dice images. Locked dice are not rolled, their corresponding array values are passed to the new version of dice[]. */
function rollDice() {
    $(".Dice").css({ "pointer-events": "auto" });//restores dice as clickable
    for (var i = 0; i < 5; ++i) {
        //check if the dice is not locked and the game has not finished
        if (locked[i] == false && rollNo < 3) {
            //assign a random dice value
            dice[i] = Math.floor(Math.random() * 6) + 1;
            //display an image of dice (alternatively - its value)
            $("img.Dice" + (i + 1)).attr("src", diceImg[dice[i] - 1]).attr("alt", '"' + dice[i] + '"');
        } else {
            this.dice = dice[i];//if dice is locked, its existing value is passed to the new dice[] array under the same index
        }
    }
    rollNo++ //increase count of rolls by one
    $(".SubmitButton").prop("disabled", false);
    return dice;//dice[] array re-written
}

//shaking dice using api based on  https://api.jqueryui.com/shake-effect/
function shakeDice() {
    for (var i = 0; i < 5; ++i) {
        let delayValue = Math.floor(Math.random() * 250);//randomising timing of the effect 
        if (locked[i] == false) {
            $("img.Dice" + (i + 1)).delay(delayValue).effect("shake", { direction: "up" });
        }
    }
}

//function preventing clicked dice from rolling. Crossed image displayed
function lockDice(j) {
    $(".Dice" + j).click(function () {
        //check if the dice is not locked while the game has started and not finished
        if (locked[j - 1] == false && rollNo > 0 && rollNo < 4) {
            $(this).attr("src", diceImgLocked[dice[j - 1] - 1]).attr("alt", '"' + dice[j - 1] + ' LOCK"');
            locked[j - 1] = true;

        } else {
            $(this).attr("src", diceImg[dice[j - 1] - 1]).attr("alt", '"' + dice[j - 1] + '"');
            locked[j - 1] = false;
        }
    });
}

//function to display the number of rolls left and toggle active buttons
function showControls() {
    switch (rollNo) {
        case 0:
            $("div.Attempts").html("Lock any combination by clicking on the dice. You can roll dice two more times.<br><br>");
            $("button.RollAgain").prop('disabled', true);
            break;
        case 1:
            $("div.Attempts").html("Lock any dice combination. Last one roll left.<br><br>");
            break;
        case 2:
            $("div.Attempts").html("Select your options and submit your points.<br>If no option is selected, click the button below and roll gain.");
            $("button.RollButton").prop('disabled', true);
            $("button.RollAgain").prop('disabled', false);
            break;
    }

}

/*function calculating the number of occurrences of 1-6 dice values in each roll.
These key-value pairs are written to occurrenceMap. Derived from occurrenceMap and dice[],
a combination of highestOccurrence and numberOfUniqueValues is then used to identify
applicable scoring options, and calculate points values, bonuses and totals.*/

function scoringLogic() {

    let occurrenceMap = new Map();//create map for dice value occurrence
    let highestOccurrence = 0;
    let numberOfUniqueValues = 0;
    let upperPoints = 0;
    let lowerPoints = 0;
    for (var v = 1; v < 7; ++v) {//count each of the six values in dice[]
        let count = 0;
        $.each(dice, function (i, value) {
            count = value === v ? ++count : count;
        });
        occurrenceMap.set(v, count);//map occurrences of six dice values
    }
    //find the highest-occurring value in the above map 
    highestOccurrence = Math.max(...occurrenceMap.values());

    //Check min-max spread helping to establish how many dice[] values are sequential
    let minMaxSpread = Math.max(...dice) - Math.min(...dice);

    //count unique values in dice[]
    numberOfUniqueValues = [...new Set(dice)].length;

    //identify and action applicable points allocations
    switch (true) {
        //lower points
        case lastButtonID == "SubmitToK" && highestOccurrence > 2://Three of the same
            $.each(dice, function () { lowerPoints += this });
            $(".PointsThreeSame").html(lowerPoints);
            break;
        case lastButtonID == "SubmitFoK" && highestOccurrence > 3://Four of the same
            $.each(dice, function () { lowerPoints += this });
            $(".PointsFourSame").html(lowerPoints);
            break;
        case lastButtonID == "SubmitFlH" && highestOccurrence == 3 && numberOfUniqueValues == 2://Three and two the same
            lowerPoints = 25;
            $(".PointsFull").html(lowerPoints);
            break;
        case lastButtonID == "SubmitSmS" && ((numberOfUniqueValues == 4 && minMaxSpread == 3) || (numberOfUniqueValues == 5 && minMaxSpread > 3))://Sequence of four
            lowerPoints = 30;
            $(".PointsSmallS").html(lowerPoints);
            break;
        case lastButtonID == "SubmitLgS" && numberOfUniqueValues == 5 && minMaxSpread == 4://Sequence of five
            lowerPoints = 40;
            $(".PointsLargeS").html(lowerPoints);
            break;
        case lastButtonID == "SubmitYahtzee" && highestOccurrence == 5://Yahtzees and bonuses
            yahtzeePoints += 50;
            $(".PointsYahtzee").html(yahtzeePoints);
            yahtzeeBonus = ((yahtzeePoints - 50) / 50) * 100;
            $(".PointsYahtzeeBonus").html(yahtzeeBonus);
            lowerTotal += (yahtzeeBonus > 0 ? 150 : 50);
            $(".LowerTotal").html(lowerTotal);
            totalScore += (yahtzeeBonus > 0 ? 150 : 50);
            $(".GrandTotal").html(totalScore);
            $(".SubmitButton").prop("disabled", true);//disable immediale re-submissions
            break;
        case lastButtonID == "SubmitChance" && highestOccurrence > 0://Any combination
            $.each(dice, function () { lowerPoints += this });
            $(".PointsChance").html(lowerPoints);
            break;
        //upper points
        case lastButtonID == "SubmitAces"://ones
            upperPoints = occurrenceMap.get(1);
            $(".PointsAces").html(upperPoints);
            break;
        case lastButtonID == "SubmitTwos"://Twos
            upperPoints = occurrenceMap.get(2) * 2;
            $(".PointsTwos").html(upperPoints);
            break;
        case lastButtonID == "SubmitThrees"://Threes
            upperPoints = occurrenceMap.get(3) * 3;
            $(".PointsThrees").html(upperPoints);
            break;
        case lastButtonID == "SubmitFours"://Fours
            upperPoints = occurrenceMap.get(4) * 4;
            $(".PointsFours").html(upperPoints);
            break;
        case lastButtonID == "SubmitFives"://Fives
            upperPoints = occurrenceMap.get(5) * 5;
            $(".PointsFives").html(upperPoints);
            break;
        case lastButtonID == "SubmitSixes"://Sixes
            upperPoints = occurrenceMap.get(6) * 6;
            $(".PointsSixes").html(upperPoints);
            break;
    }

    if (lastButtonID != "SubmitYahtzee") {//update non-Yahtzee totals
        //upper table values
        upperSubtotal += upperPoints;
        upperBonus = upperSubtotal > 63 ? 35 : 0;
        upperTotal = upperSubtotal + upperBonus;
        $(".UpperSub").html(upperSubtotal);
        $(".PointsBonus").html(upperBonus);
        $(".UpperTotal").html(upperTotal);
        $(".GrandTotal").html(upperTotal);
        //lower table values
        lowerTotal += lowerPoints;
        totalScore = lowerTotal + upperTotal;
        $(".LowerTotal").html(lowerTotal);
        $(".GrandTotal").html(totalScore);
        $("#" + lastButtonID).hide();
        $(".SubmitButton").prop("disabled", true);//disable immediale re-submissions
    }
    getReady();//reset roll controls
}

//********************************* MAIN LOGIC OF THE GAME ***********************************
//          calling a sequence of functions to run after all DOM elements are loaded 

$(document).ready(function () {

    getReady();//reset controls

    $("button.RollButton").click(function () {//on click events for RollButton
        shakeDice();
        showControls();
        rollDice();
    });

    for (var j = 1; j < 6; ++j) {//lock dice if clicked
        lockDice(j);
    }

    /*click re-roll button button to enable rolling after three rolls. 
    This is a non-standard addition providing a logical pause in the game. 
    Also -  a possible switch point for taking turns in multi-player developments*/
    $("button.RollAgain").click(function () {
        getReady();// reset controls
    });

    $("button.SubmitButton").click(function () {//calculate score
        lastButtonID = this.id;
        scoringLogic();
    });

    $("button.RestartButton").click(function () {//reload game page, end of game
        location.reload(true)
    });
});


