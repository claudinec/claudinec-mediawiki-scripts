// SPDX-FileCopyrightText: 2026 User:ClaudineChionh
// SPDX-License-Identifier: GPL-3.0-or-later OR CC-BY-SA-4.0
/**
 * Display accept, decline, and reject totals for an AfC log.
 * @author User:ClaudineChionh
 * @version 0.1.1
 * @external jQuery
 */

$(function () {
    // Only activate on English Wikipedia pages matching User:Username/AfC_log.
    const wikiID = mw.config.get("wgWikiID");
    const pageName = mw.config.get("wgPageName");
    const isPage = mw.config.get("wgIsArticle");
    if (wikiID !== "enwiki" || !pageName.match(/^User:[^/]+\/AfC_log$/) || !isPage) {
        return;
    }

    // Load the default stylesheet.
    mw.loader.load(
        "//en.wikipedia.org/w/index.php?title=User:ClaudineChionh/Scripts/afcLogTotals.css&action=raw&ctype=text/css",
        "text/css",
    );

    /**
     * Show review totals for an AfC log and for each month.
     * An AfC log page (without archives) is divided into sections for each calendar month.
     */
    const monthTotals = new Map();
    const logContent = document.getElementById("mw-content-text");
    const allMonths = logContent.querySelectorAll(".mw-heading3");

    // Parse page for each month's totals and display these under each month's heading.
    for (var month of allMonths) {
        const monthId = month.querySelector("h3[id]")?.id; // id format: MMMM_yyyy
        const next = month.nextElementSibling;
        // MobileFrontend wraps the review list in collapsible section content.
        const reviewList = next?.matches(".mw-collapsible-content, .collapsible-block")
            ? next.querySelector(":scope > ol, :scope > ul")
            : next;
        if (!monthId || !reviewList?.matches("ol, ul")) {
            continue;
        }
        const logEntries = Array.from(reviewList.children);
        var acceptedReviews = logEntries.filter((review) =>
            review.textContent.trimStart().startsWith("Accepted"),
        );
        var acceptedTotal = acceptedReviews.length;
        var declinedReviews = logEntries.filter((review) =>
            review.textContent.trimStart().startsWith("Declined"),
        );
        var declinedTotal = declinedReviews.length;
        // TODO: count decline reasons if (declinedReviews.length > 0)
        // const DECLINE_RE = /^Declined (Draft|User):(.+) \(((\w+)( & (\w+))?)\) by /;
        var rejectedReviews = logEntries.filter((review) =>
            review.textContent.trimStart().startsWith("Rejected"),
        );
        var rejectedTotal = rejectedReviews.length;

        // Display each month's totals between the heading and the start of the list.
        var monthDiv = document.createElement("div");
        monthDiv.id = `afc-${monthId}-totals`;
        monthDiv.className = "afc-review-totals";
        var monthText = document.createTextNode(
            `Accepted: ${acceptedTotal}, declined: ${declinedTotal}, rejected: ${rejectedTotal}.`,
        );
        var monthDisplay = monthDiv.appendChild(monthText);
        reviewList.before(monthDiv);

        // Collect each month's totals for aggregate display.
        monthTotals.set(monthId, {
            accepted: acceptedTotal,
            declined: declinedTotal,
            rejected: rejectedTotal,
        });
    }

    // Get totals for the whole page.
    const pageTotals = { accepted: 0, declined: 0, rejected: 0 };

    for (const { accepted, declined, rejected } of monthTotals.values()) {
        pageTotals.accepted += accepted;
        pageTotals.declined += declined;
        pageTotals.rejected += rejected;
    }

    // Display totals for the whole page.
    const pageTotalDiv = document.createElement("div");
    pageTotalDiv.id = "afc-page-totals";
    pageTotalDiv.className = "afc-review-totals";
    const pageTotalText = document.createTextNode(
        `Total accepted: ${pageTotals.accepted}, total declined: ${pageTotals.declined}, total rejected: ${pageTotals.rejected}.`,
    );
    const pageTotalDisplay = pageTotalDiv.appendChild(pageTotalText);
    logContent.firstElementChild.before(pageTotalDiv);
});
