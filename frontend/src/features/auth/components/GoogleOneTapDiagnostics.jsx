export const GOOGLE_ONE_TAP_MOMENT_CALLBACK = "airadsGoogleOneTapMoment";

const diagnosticsScript = `
(function () {
    if (window.${GOOGLE_ONE_TAP_MOMENT_CALLBACK}) {
        return;
    }

    window.${GOOGLE_ONE_TAP_MOMENT_CALLBACK} = function (notification) {
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
`;

export default function GoogleOneTapDiagnostics() {
    return <script dangerouslySetInnerHTML={{ __html: diagnosticsScript }} />;
}
