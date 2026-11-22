// SPDX-FileCopyrightText: 2026 User:ClaudineChionh
// SPDX-License-Identifier: GPL-3.0-or-later OR CC-BY-SA-4.0
/**
 * Display accept, decline, and reject totals for an AfC log.
 * @author User:ClaudineChionh
 * @version 0.1.0
 * @external jQuery
 */

$(function () {
    // Only activate on pages matching User:Username/AfC_log.
    let pageName = mw.config.get("wgPageName");
    if (!pageName.match(/User:.+\/AfC_log/)) {
        return;
    }

    // Load the default stylesheet.
    mw.loader.load(
        "/w/index.php?title=User:ClaudineChionh/Scripts/afcLogTotals.css&action=raw&ctype=text/css",
        "text/css",
    );

    /**
     * Show review totals for an AfC log and for each month.
     * An AfC log page (without archives) is divided into sections for each calendar month.
     */
    const monthTotals = new Map();
    const allMonths = document.querySelectorAll(".mw-heading3");

    // Parse page for each month's totals and display these under each month's heading.
    for (var month of allMonths) {
        var monthId = month.firstElementChild.id; // id format: MMMM_yyyy
        var logEntries = Array.from(month.nextElementSibling.children);
        var acceptedReviews = logEntries.filter((review) =>
            review.innerText.startsWith("Accepted"),
        );
        var acceptedTotal = acceptedReviews.length;
        var declinedReviews = logEntries.filter((review) =>
            review.innerText.startsWith("Declined"),
        );
        var declinedTotal = declinedReviews.length;
        // TODO: count decline reasons if (declinedReviews.length > 0)
        // const DECLINE_RE = /^Declined (Draft|User):(.+) \(((\w+)( & (\w+))?)\) by /;
        var rejectedReviews = logEntries.filter((review) =>
            review.innerText.startsWith("Rejected"),
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
        month.nextElementSibling.before(monthDiv);

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
    const logContent = document.getElementById("mw-content-text");
    const pageTotalDiv = document.createElement("div");
    pageTotalDiv.id = "afc-page-totals";
    pageTotalDiv.className = "afc-review-totals";
    const pageTotalText = document.createTextNode(
        `Total accepted: ${pageTotals.accepted}, total declined: ${pageTotals.declined}, total rejected: ${pageTotals.rejected}.`,
    );
    const pageTotalDisplay = pageTotalDiv.appendChild(pageTotalText);
    logContent.firstElementChild.before(pageTotalDiv);
});
