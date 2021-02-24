'use strict';

function getSelectedText(e) {
  var selectedText = document.getSelection().toString();
  if (selectedText) {
    chrome.runtime.sendMessage({
      command: "selected_text",
      selectedText: selectedText.trim()
    })
  }

}

document.onmouseup = getSelectedText;
if (!document.all) document.captureEvents(Event.MOUSEUP);

window.addEventListener('load', function () {
  let style = document.createElement('style');
  style.innerHTML = '*{ user-select: auto !important; }';
  document.body.appendChild(style);
})