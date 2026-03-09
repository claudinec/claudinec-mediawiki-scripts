// SPDX-FileCopyrightText: 2021 User:ClaudineChionh
// SPDX-License-Identifier: GPL-3.0-or-later OR CC-BY-SA-4.0
/**
 * Copy the page content to the system clipboard using the Clipboard API.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API}
 * @todo Test with Visual Editor
 * @version 0.3.0
 * @external jQuery
 */

$(document).ready(function() {
    /**
     * Copy content to system clipboard.
     * @params {string}
     */
    function copyToClipboard(content) {
        const copySuccessMsg = 'Copied page content to system clipboard';
        try {
            navigator.clipboard.writeText(content).then(function() {
                mw.notify(copySuccessMsg);
            });
        } catch (error) {
            mw.notify(error);
        }
    }

    /**
     * Get current page wikitext via API as it's not available in the HTML DOM.
     * @returns {string}
     */
    function getPageWikitext() {
        const api = new mw.Api();
        return api.get({
            action: 'query',
            revids: mw.config.get('wgRevisionId'),
            prop: 'revisions',
            rvprop: 'content',
            rvslots: 'main',
            formatversion: 2
        }).then(function(data) {
            return data.query.pages[0].revisions[0].slots.main.content;
        });
    }

    // Add portlet link.
    var copyLink = mw.util.addPortletLink(
        'p-tb',
        '#',
        'Copy page content',
        't-copypage',
        'Copy page content to clipboard'
    );

    $(copyLink).click(function(event) {
        event.preventDefault();
        // If we have the edit form open and it has any content, copy that.
        // Otherwise we need to get the wikitext via API.
        var textbox = $('#wpTextbox1').val();
        if (textbox) {
            copyToClipboard(textbox);
        } else {
            getPageWikitext().then(function(wikitext) {
                copyToClipboard(wikitext);
            });
        }
    });
});
