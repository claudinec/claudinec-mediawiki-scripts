// SPDX-FileCopyrightText: 2026 User:ClaudineChionh
// SPDX-License-Identifier: GPL-3.0-or-later OR CC-BY-SA-4.0
/**
 * @file
 * @author User:ClaudineChionh
 * @version 0.1.0
 * @external jQuery
 */

const AFCLOG_RE = /User:.+\/AfC_log/;
// const DECLINE_RE = /^Declined (Draft|User):(.+) \(((?<reason1>\w+){ & (?<reason2>\w+)}?)\) by /;
const DECLINE_RE = /^Declined (Draft|User):(.+) \(((\w+)( & (\w+))?)\) by /;

$(document).ready(function () {
    // Only activate on pages matching User:Username/AfC_log.
    let pageName = mw.config.get("wgPageName");
    if (!(pageName.match(AFCLOG_RE))) {
        return;
    }

    /**
     * Get each month's review totals from an AfC log.
     * An AfC log page (without archives) is divided into sections for each calendar month.
     */
    function getMonthTotals() {
        let monthTotals = new Object();
        let allMonths = document.querySelectorAll(".mw-heading3");

        // Parse page for each month's totals and display these under each month's heading.
        for (const month of allMonths) {
            var monthId = month.firstElementChild.id;  // id format: MMMM_yyyy
            var logEntries = Array.from(month.nextElementSibling.children);
            var acceptedReviews = logEntries.filter((review) => review.innerText.startsWith("Accepted"));
            var acceptedTotal = acceptedReviews.length;
            var declinedReviews = logEntries.filter((review) => review.innerText.startsWith("Declined"));
            var declinedTotal = declinedReviews.length;
            // TODO: count decline reasons if (declinedReviews.length > 0)
            var rejectedReviews = logEntries.filter((review) => review.innerText.startsWith("Rejected"));
            var rejectedTotal = rejectedReviews.length;

            // Display each month's totals between the heading and the start of the list.
            var monthDiv = document.createElement("div");
            var monthText = document.createTextNode(`Accepted: ${acceptedTotal}, Declined: ${declinedTotal}, Rejected: ${rejectedTotal}.`);
            var monthDisplay = monthDiv.appendChild(monthText);
            month.nextElementSibling.before(monthDisplay);

            // Collect each month's totals for aggregate display.
            monthTotals[monthId] = {"accepted": acceptedTotal, "declined": declinedTotal, "rejected": rejectedTotal};
        }
        return monthTotals;
    }

    /**
     * @todo Display review totals for whole page.
     * @param {Object} monthTotals
     */
    function displayPageTotals(monthTotals) {
    }

    // @todo Add portlet link.

});
