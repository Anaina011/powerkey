function openPopup(videoSrc) {
  var popup = document.getElementById("popup");
  var iframe = popup.querySelector("iframe");
  iframe.src = videoSrc;
  popup.style.display = "block";
}

function closePopup() {
  var popup = document.getElementById("popup");
  var iframe = popup.querySelector("iframe");
  iframe.src = ""; // Reset src to stop video playback
  popup.style.display = "none";
}
