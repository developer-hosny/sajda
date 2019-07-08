var done = false;
var onFailSoHard = function(e) {
  console.log("Reeeejected!", e);
};
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
function fallback(e) {
  video.src = "fallbackvideo.webm";
}

function success(stream) {
  video.src = window.URL.createObjectURL(stream);
}

var video = document.querySelector("video");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var localMediaStream = null;

function snapshot() {
  if (done == true) {
    return;
  }

  if (localMediaStream) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    document.querySelector("img").src = canvas.toDataURL("image/webp");
  }
}

video.addEventListener("click", snapshot, false);
navigator.getUserMedia(
  { video: true },
  function(stream) {
    var binaryData = [];
    binaryData.push(data);
    video.src = window.URL.createObjectURL(
      new Blob(binaryData, { type: "application/zip" })
    );

    localMediaStream = stream;
  },
  onFailSoHard
);

function get_color() {
  var sourceImage = document.getElementById("myimg");
  var colorThief = new ColorThief();
  var color = colorThief.getColor(sourceImage);
  return color;
}

var rakaa_count = 0;
var inrakaa = false;
var inSame_rakaa = false;
var sajda_count = 0;

function check_color() {
  color = get_color();
  var rgb = color.toString().split(",");
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];

  if (r < 50 && g < 50 && b < 50 && inrakaa == false) {
    sajda_count++;
    inrakaa = true;
    if (sajda_count == 3) {
      sajda_count = 1;
      $("#lbl_sajda_count").html(sajda_count);
      return;
    }
    $("#lbl_sajda_count").html(sajda_count);

    if (sajda_count == 2) {
      rakaa_count++;
      $("#lbl_rakaa_count").html(rakaa_count);
      $("#level_" + rakaa_count).css("opacity", 1);

      if (rakaa_count == levels_count) {
        done = true;
        $(".rakaa_level").css("background", "#1ABC9C");
        $(".lbl_rakaa_count , .lbl_sajda_count").css("color", "#F7DE72");
        $("#btnStop").css("opacity", "1");
      }
    }
  }

  if (r > 55 && g > 55 && b > 55) {
    inrakaa = false;
  }
}

function check_rakaa() {
  snapshot();
  check_color();
}

var interval;
function start_check_rakaa() {
  done = false;

  $(".pray").hide();
  $(".option").hide();
  $("#btnStart").hide();
  $("#btnStop").show();
  interval = setInterval(function() {
    check_rakaa();
  }, 1000);
}

function reset() {
  rakaa_count = 0;
  inrakaa = false;
  inSame_rakaa = false;
  sajda_count = 0;

  $("#lbl_sajda_count").html(sajda_count);
  $("#lbl_rakaa_count").html(rakaa_count);
  $(".lbl_rakaa_count , .lbl_sajda_count").css("color", "#1ABC9C");
  $(".pray").show();
  $(".option").show();
  $("#btnStop").hide();
  $("#btnStop").css("opacity", ".2");
  clearInterval(interval);
  $("#fajr").click();
}

var pray = "";
var levels_count = "";
$(".btnPray").click(function() {
  pray = $(this).attr("id");
  if (pray == "fajr") {
    levels_count = 2;
  } else if (pray == "zuhr") {
    levels_count = 4;
  } else if (pray == "asr") {
    levels_count = 4;
  } else if (pray == "maghrib") {
    levels_count = 3;
  } else if (pray == "isha") {
    levels_count = 4;
  }
  add_rakaa_levels(levels_count);
  $("#btnStart").show();
});

function add_rakaa_levels(rakaa_count) {
  $(".rakaa_levels_wrapper").empty();

  if (rakaa_count == 2) {
    $(".rakaa_levels_wrapper").append('<div class="fake_level"></div>');
  }

  for (var p = rakaa_count; p > 0; p--) {
    $(".rakaa_levels_wrapper").append(
      '<div class="rakaa_level" id="level_' + p + '"></div>'
    );
  }

  if (rakaa_count == 2 || rakaa_count == 3) {
    $(".rakaa_levels_wrapper").append('<div class="fake_level"></div>');
  }
}

$("#btnStart").click(function() {
  start_check_rakaa();
});

$("#btnStop").click(function() {
  reset();
});

$(".chbox_option").click(function() {
  var target = $(this).attr("id");

  if (target == "chbox_sajda_count") {
    $(".lbl_sajda_count").toggle();
  } else if (target == "chbox_level_count") {
    $(".rakaa_levels_wrapper").toggle();
  } else if (target == "chbox_rakaa_count") {
    $(".lbl_rakaa_count").toggle();
  }
});

$(".info").click(function() {
  $(".howto").toggle();
});

$("#btnStart").hide();
$("#btnStop").hide();
$(".lbl_sajda_count").hide();
$("#fajr").click();
