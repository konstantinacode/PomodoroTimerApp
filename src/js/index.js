const electron = require('electron')
const $ = require('jquery');

var breakCount = 0;
var pomodoroCount = 0;
var timerStarted = false;
var cancel = false;

var audioEnd = document.createElement('audio');
audioEnd.setAttribute('src', 'https://freesound.org/data/previews/402/402067_6142149-lq.mp3');

var audioTick = document.createElement('audio');
audioTick.setAttribute('src', 'https://freesound.org/data/previews/254/254315_4062622-lq.mp3');
audioTick.volume = 0.1;

function startTimer(){
  $(".settingsSection").hide();
  $("#startBtn").hide();
  $(".timerSection").show();
  $("#cancel-btn").show();


    var pomoTime = $("#pomo-time").val();
    var shortBreakTime = $("#shrt-brk-time").val();
    var longBreakTime = $("#lng-brk-time").val();

    breakCounted = false;
    pomoCounted = false;
    var miliPomo = pomoTime * 60 * 1000;
    var currentTimePomo = miliPomo;
    if (!timerStarted) {
        timerStarted = true;
        var pomoTimer = setInterval(function() {
          if (cancel) {
            clearInterval(pomoTimer);
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
            $("#state").html("Focus!");
            var minutesPomo = Math.floor(currentTimePomo % (1000 * 60 * 60) / (1000 * 60)); 
            var secondsPomo = ("0" + Math.floor(currentTimePomo % (1000 * 60) / 1000)).slice(-2); 
            $("#countdown").html(minutesPomo + " : " + secondsPomo);
            if (currentTimePomo <= 0) {
              clearInterval(pomoTimer);
              $("#state").html("Break Time!");
              $("#countdown").html("");
              if ($("#sound-chk").prop('checked')){
                audioEnd.play();
              }
              pomodoroCount++;
              var miliBreak = shortBreakTime * 60 * 1000;
              if (breakCount == 4) {
                miliBreak = longBreakTime * 60 * 1000;
              }
              var currentTimeBreak = miliBreak;
              var breakTimer = setInterval(function() {
            if (currentTimeBreak >= 1000){
              currentTimeBreak -= 1000;
            }else{
              currentTimeBreak = 0;
            }
                var minutesBreak = Math.floor(currentTimeBreak % (1000 * 60 * 60) / (1000 * 60)); 
                var secondsBreak = ("0" +Math.floor(currentTimeBreak % (1000 * 60) / 1000)).slice(-2);
                $("#countdown").html(minutesBreak + " : " + secondsBreak);
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
    $(".settingsSection").show();
    $("#startBtn").show();
    $(".timerSection").hide();
    $("#cancel-btn").hide();
    cancel = true;
    $("#countdown").html("");
    $("#state").html("");
  }