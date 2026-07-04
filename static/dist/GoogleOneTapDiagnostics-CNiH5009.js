import{j as n}from"./vendor-motion-D1pTnF5Q.js";const i="airadsGoogleOneTapMoment",o=`
(function () {
    if (window.${i}) {
        return;
    }

    window.${i} = function (notification) {
        try {
            var details = {
                momentType: typeof notification.getMomentType === "function" ? notification.getMomentType() : undefined,
                isDisplayMoment: typeof notification.isDisplayMoment === "function" ? notification.isDisplayMoment() : undefined,
                isDisplayed: typeof notification.isDisplayed === "function" ? notification.isDisplayed() : undefined,
                isNotDisplayed: typeof notification.isNotDisplayed === "function" ? notification.isNotDisplayed() : undefined,
                notDisplayedReason: typeof notification.getNotDisplayedReason === "function" ? notification.getNotDisplayedReason() : undefined,
                isSkippedMoment: typeof notification.isSkippedMoment === "function" ? notification.isSkippedMoment() : undefined,
                skippedReason: typeof notification.getSkippedReason === "function" ? notification.getSkippedReason() : undefined,
                isDismissedMoment: typeof notification.isDismissedMoment === "function" ? notification.isDismissedMoment() : undefined,
                dismissedReason: typeof notification.getDismissedReason === "function" ? notification.getDismissedReason() : undefined,
                location: window.location.href
            };
            var shouldWarn = details.isNotDisplayed || details.isSkippedMoment || details.isDismissedMoment;
            console[shouldWarn ? "warn" : "info"]("[Google One Tap] prompt moment", details);
        } catch (error) {
            console.warn("[Google One Tap] prompt moment logging failed", error);
        }
    };
}());
`;function e(){return n.jsx("script",{dangerouslySetInnerHTML:{__html:o}})}export{e as G,i as a};
