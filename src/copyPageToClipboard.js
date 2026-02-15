/**
 * [[User:ClaudineChionh/Scripts/copyPageToClipboard.js]]
 * Copy the page content to the system clipboard.
 * This script uses the Clipboard API – for browser compatibility see
 * https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
 *
 * @author Claudine Chionh [[User:ClaudineChionh]]
 * @version 0.2.0
 * @license GPL-3.0-or-later
 * @external jQuery
 */

$(document).ready(function () {
    function copyPageToClipboard() {
        try {
            var textbox = $("#wpTextbox1").val();
            navigator.clipboard.writeText(textbox).then(function () {
                mw.notify("Copied page content to system clipboard");
            });
        } catch (error) {
            mw.notify(error);
        }
    }

    // Add the portlet link to copy to clipboard.
    if ($("#wpTextbox1").val() != undefined) {
        var copyLink = mw.util.addPortletLink("p-tb", "#", "Copy page content", "t-copypage", "Copy page content to clipboard");
        $(copyLink).click(function (event) {
            copyPageToClipboard();
        })
    }
});
