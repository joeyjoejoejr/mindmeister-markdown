'use strict';

// Setup Marked Library
marked.setOptions({
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

// Toggle Notes In Slideshow Using 'N'
$(document).on('keypress', function(event) {
  var nKeyCode = 110;
  if (event.keyCode === nKeyCode) {
    $('.slideshow_current [id$="_note"]')[0].click();
  }
});

// Determine the propper scale for markdown content
var setScale = function(noteHeight) {
  var $canvasContainer, scale, style, newStyle, noteTop;

  $canvasContainer = $('#canvas_container');

  scale = ($canvasContainer.height() * 0.8) / noteHeight;
  style = $('#popover_extras').attr('style');
  noteTop = $('#popover_extras').css('top');
  newStyle = style
    .replace(/scale\(\d+\.?\d+\)/, 'scale(' + scale + ')')
    .replace(/top:\s\d+.?\d+px/, 'top: 30%');

  $('#popover_extras').attr('style', newStyle);
};

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var newNodes = mutation.addedNodes; // DOM NodeList
    var $nodes = $(newNodes); // jQuery set

    // Look for note content with prefixed with "MARKDOWN" and replace the note
    // content with the html output
    $nodes.each(function() {
      var $node = $(this),
          isMarkdown = $node.text().indexOf('MARKDOWN\n') !== -1,
          $noteContent;

      if($node.hasClass('note_content')) {
        $noteContent = $node;
      } else {
        $noteContent = $node.find('.note_content');
      }

      if($noteContent && isMarkdown) {
        var markdown = $noteContent.text().replace(/MARKDOWN\n/, ''),
            parsedMarkdown = marked(markdown),
            $wrapperDiv = $('<div/>', { 'class': 'markdown-body' });

        $wrapperDiv.html(parsedMarkdown);
        $noteContent.html($wrapperDiv);
        setScale($noteContent.height());

        var scale = $noteContent.height() / $wrapperDiv.height();

        if (scale < 1 ) {
          $noteContent.width(245 / scale);
          $wrapperDiv.attr('style', 'transform: scale(' + scale + ');transform-origin: 0 0;');
        }
      }
    });
  });
});

// Attach observer
observer.observe(document.body, {
  childList: true,
  subtree: true
});
