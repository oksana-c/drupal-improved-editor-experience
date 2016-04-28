/*  add to your Admins Theme's JS 
 * or create a module that will cover only specific forms
*/
(function($) {
  Drupal.node_edit_protection = {};
  var click = false; // Allow Submit/Edit button
  var edit = false; // Dirty form flag

  Drupal.behaviors.nodeEditProtection = {
    attach : function(context) {
      // If they leave an input field, assume they changed it.
      $(".page-node :input", context).each(function() {
        $(this).addClass('node-edit-protection-processed');
        $(this).blur(function() {
          edit = true;
        });
      });

      // Let all form submit buttons through
      $(".page-node input[type='submit'], .page-node button[type='submit']", context).each(function() {
        $(this).addClass('node-edit-protection-processed');
        $(this).click(function() {
          click = true;
        });
      });

      // Catch all links and buttons EXCEPT for "#" links
      $("a, button, input[type='submit']:not(.node-edit-protection-processed)", context)
          .each(function() {
            $(this).click(function() {
              // return when a "#" link is clicked so as to skip the
              // window.onbeforeunload function
              if (edit && $(this).attr("href") != "#") {
                return 0;
              }
            });
          });

      // Handle backbutton, exit etc.
      window.onbeforeunload = function() {
        // Add CKEditor support
        if (typeof (CKEDITOR) != 'undefined' && typeof (CKEDITOR.instances) != 'undefined') {
          for ( var i in CKEDITOR.instances) {
            if (CKEDITOR.instances[i].checkDirty()) {
              edit = true;
              break;
            }
          }
        }
        if (edit && !click) {
          click = false;
          return (Drupal.t("You will lose all unsaved work."));
        }
      }
    }
  };
})(jQuery);