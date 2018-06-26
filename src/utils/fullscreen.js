/* globals ActiveXObject */

export function requestFullScreen(element) {
  // Supports most browsers and their versions.
  const requestMethod =
    element.requestFullScreen ||
    element.webkitRequestFullScreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullScreen;

  if (requestMethod) {
    // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    const wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

export function exitFullScreen(element) {
  // Supports most browsers and their versions.
  const exitMethod =
    element.exitFullscreen ||
    element.webkitExitFullscreen ||
    element.mozCancelFullScreen ||
    element.msExitFullscreen;

  if (exitMethod) {
    // Native full screen.
    exitMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    // Older IE.
    const wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}