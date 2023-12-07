const electron = require('electron')
const $ = require('jquery');

var breakCount = 0;
var pomodoroCount = 0;
var timerStarted = false;
var cancel = false;
var logText = "";
var leftPos = 228;

var audioEnd = document.createElement('audio');
audioEnd.setAttribute('src', 'https://freesound.org/data/previews/402/402067_6142149-lq.mp3');

var audioTick = document.createElement('audio');
audioTick.setAttribute('src', 'https://freesound.org/data/previews/254/254315_4062622-lq.mp3');
audioTick.volume = 0.1;

function taskFocus(){
  if ($("#task").val() == "Type your task here."){
    $("#task").val("");
  }
}

function taskBlur(){
    if($("#task").val() == ""){
      $("#task").val("Type your task here.");
      $("#help").html("Enter your task above");
    }else{
      $("#help").html("Press Start to begin!");
    }
 }
 
function startTimer(){
    var pomoTime = $("#pomo-time").val();
    var shortBreakTime = $("#shrt-brk-time").val();
    var longBreakTime = $("#lng-brk-time").val();
    if (!$("#task").val() || $("#task").val() == "Type your task here.") {
        alert("Please enter your current task.");
    }
    breakCounted = false;
    pomoCounted = false;
    $("#help").html("Time to work!");
    var miliPomo = pomoTime * 60 * 1000;
    var currentTimePomo = miliPomo;
    if (!timerStarted) {
        timerStarted = true;
        var pomoTimer = setInterval(function() {
          if (cancel) {
            clearInterval(pomoTimer);
            $("#help").html("Press Start to begin!");
            cancel = false;
            timerStarted = false;
          } else {
            if (currentTimePomo >= 1000){
              currentTimePomo -= 1000;
            }else{
              currentTimePomo = 0;
            }
            if ($("#sound-chk").prop('checked')){
              audioTick.play();
            }
            var minutesPomo = Math.floor(
              currentTimePomo % (1000 * 60 * 60) / (1000 * 60)
            );
            var secondsPomo = ("0" +
              Math.floor(currentTimePomo % (1000 * 60) / 1000)).slice(-2);
            
            if (currentTimePomo <= 0) {
              clearInterval(pomoTimer);
              if ($("#sound-chk").prop('checked')){
                audioEnd.play();
              }
              pomodoroCount++;
              logText = $("#log").html() +
                pomodoroCount +
                '&emsp; <input class="log-box" type="text" onblur="logBlur(this)" value="' +
                $("#task").val() +
                '"></input><br>';
              $("#log").html(logText);
              $("#help").html("Take a short break");
              var miliBreak = shortBreakTime * 60 * 1000;
              if (breakCount == 4) {
                $("#help").html("Take a long break");
                miliBreak = longBreakTime * 60 * 1000;
              }
              var currentTimeBreak = miliBreak;
              var breakTimer = setInterval(function() {
            if (currentTimeBreak >= 1000){
              currentTimeBreak -= 1000;
            }else{
              currentTimeBreak = 0;
            }
                var minutesBreak = Math.floor(
                  currentTimeBreak % (1000 * 60 * 60) / (1000 * 60)
                );
                var secondsBreak = ("0" +
                  Math.floor(currentTimeBreak % (1000 * 60) / 1000)).slice(-2);
                if (currentTimeBreak <= 0 || cancel) {
                  clearInterval(breakTimer);
                  if (!cancel){
                    if ($("#sound-chk").prop('checked')){
                      audioEnd.play();
                    }
                  }
                  var checkBoxes = "";
                  if (breakCount < 4) {
                    breakCount++;
                    for (var i = 0; i < breakCount; i++) {
                      checkBoxes += '<i class="fa fa-check-square-o"></i>';
                    }
                  } else {
                    breakCount = 0;
                  }
                  $("#help").html("Press Start to begin again!");
                  $("#break").html(checkBoxes);
                  timerStarted = false;
                  cancel = false;
                }
              }, 1000);
            }
          }
        }, 1000);
      }
}

function cancelTimer() {
    $("#help").html("Cancelled")
    cancel = true;
  }