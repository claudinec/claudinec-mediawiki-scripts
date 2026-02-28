// SPDX-FileCopyrightText: 2023 User:Jeeputer
// SPDX-FileCopyrightText: 2025 User:ClaudineChionh
// SPDX-License-Identifier: CC-BY-SA-4.0
/**
 * [[User:ClaudineChionh/Scripts/highlightPiped.js]]
 * Fork of [[User:Jeeputer/highlightPiped.js]] – version at [[Special:Permalink/1172697276]]
 * Can be used in Main, User, and Draft namespaces.
 * @author [[User:Jeeputer]]
 * @author [[User:ClaudineChionh]]
 * @version 0.2.0
 * @license CC-BY-SA-4.0
 * @external jQuery
 */

$(function () {
    // enable this script in Main, User, and Draft namespaces
    let allowedNamespaces = [0, 2, 118];
    if (!(mw.config.get('wgNamespaceNumber') in allowedNamespaces)) { return }
    var portlet = mw.util.addPortletLink(
        window.pipeHighlighterCustomPortlet || 'p-tb',
        'javascript:void(0)',
        'Highlight piped links',
        't-pipehighlighter',
        'Highlight piped links like [[Foo|Bar]]'
    );
    $(portlet).on('click', function () {
        var links = $('#mw-content-text a');
        for (var i = 0; i < links.length; i++) {
            var link = $(links[i]);
            var linkText = link.text(),
                linkTitle = link.attr('title');
            var color = window.pipeHighlighterCustomColor || '#B3446C';
            // Check if link is piped
            if (
                link.parents('.navbox').length ||
                link.attr('class') === 'extiw' ||
                link.parents('.asbox-body').length ||
                link.parents('.sistersitebox').length ||
                link.parents('.infobox-header').length ||
                link.parents('.infobox-label').length ||
                link.parents('.mw-editsection').length ||
                (link.parents('div.reflist').length || link.parents('div.refbegin').length) || // reflists
                linkTitle == undefined ||
                linkText === linkTitle ||
                (linkTitle !== undefined && linkText === linkTitle.toLocaleLowerCase())
            ) {
                // Not piped, so continue the loop
                continue;
            } else {
                // Piped, so check if it's a redirect or disambiguation link
                if (link.hasClass('mw-redirect') && link.css('color') === 'rgb(0, 102, 0)') {
                    // Is a colored redirect link, so prepend a colored pipe
                    link.prepend('<span style="color: ' + color + '; font-weight: bold">|</span>');
                } else if (link.hasClass('mw-disambig') && link.css('color') === 'rgb(241, 118, 0)') {
                    // Is a colored disambig link, so prepend a pipe
                    link.prepend('<span style="color: ' + color + '; font-weight: bold">|</span>');
                } else if (link.hasClass('new')) {
                    // Is a redlink
                    link.prepend('<span style="color: ' + color + '; font-weight: bold">|</span>');
                } else {
                    // Is not a redirect nor a disambig link,
                    // Or is a redirect or a disambig link without a custom color
                    // This is intended for compatibility with other link highlighing scripts/gadgets
                    link.css('color', color);
                }

            }
        }
    });
});
