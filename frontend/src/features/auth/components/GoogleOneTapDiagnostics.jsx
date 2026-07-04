import { useEffect } from "react";

export const GOOGLE_ONE_TAP_MOMENT_CALLBACK = "airadsGoogleOneTapMoment";
const GOOGLE_ONE_TAP_SCRIPT_ID = "google-identity-services-client";

function registerMomentLogger() {
    window[GOOGLE_ONE_TAP_MOMENT_CALLBACK] = function (notification) {
        try {
            const details = {
                momentType: typeof notification.getMomentType === "function"
                    ? notification.getMomentType()
                    : undefined,
                isDisplayMoment: typeof notification.isDisplayMoment === "function"
                    ? notification.isDisplayMoment()
                    : undefined,
                isDisplayed: typeof notification.isDisplayed === "function"
                    ? notification.isDisplayed()
                    : undefined,
                isNotDisplayed: typeof notification.isNotDisplayed === "function"
                    ? notification.isNotDisplayed()
                    : undefined,
                notDisplayedReason: typeof notification.getNotDisplayedReason === "function"
                    ? notification.getNotDisplayedReason()
                    : undefined,
                isSkippedMoment: typeof notification.isSkippedMoment === "function"
                    ? notification.isSkippedMoment()
                    : undefined,
                skippedReason: typeof notification.getSkippedReason === "function"
                    ? notification.getSkippedReason()
                    : undefined,
                isDismissedMoment: typeof notification.isDismissedMoment === "function"
                    ? notification.isDismissedMoment()
                    : undefined,
                dismissedReason: typeof notification.getDismissedReason === "function"
                    ? notification.getDismissedReason()
                    : undefined,
                location: window.location.href,
            };

            const shouldWarn = details.isNotDisplayed
                || details.isSkippedMoment
                || details.isDismissedMoment;
            console[shouldWarn ? "warn" : "info"]("[Google One Tap] prompt moment", details);
        } catch (error) {
            console.warn("[Google One Tap] prompt moment logging failed", error);
        }
    };
}

export default function GoogleOneTapDiagnostics() {
    useEffect(() => {
        registerMomentLogger();

        const existingScript = document.getElementById(GOOGLE_ONE_TAP_SCRIPT_ID);
        if (existingScript) {
            console.info("[Google One Tap] script already present", {
                hasGoogleApi: Boolean(window.google?.accounts?.id),
                location: window.location.href,
            });
            return;
        }

        const script = document.createElement("script");
        script.id = GOOGLE_ONE_TAP_SCRIPT_ID;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.info("[Google One Tap] script loaded", {
                hasGoogleApi: Boolean(window.google?.accounts?.id),
                location: window.location.href,
            });
        };
        script.onerror = () => {
            console.error("[Google One Tap] script failed to load", {
                src: script.src,
                location: window.location.href,
            });
        };

        document.head.appendChild(script);
    }, []);

    return null;
}
