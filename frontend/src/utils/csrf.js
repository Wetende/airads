export const getCsrfToken = () => {
    const cookies = document.cookie.split(";").map((entry) => entry.trim());
    const xsrfCookie = cookies.find((entry) =>
        entry.startsWith("XSRF-TOKEN="),
    );
    if (xsrfCookie) {
        return decodeURIComponent(xsrfCookie.split("=")[1] || "");
    }

    const csrfCookie = cookies.find((entry) => entry.startsWith("csrftoken="));
    if (csrfCookie) {
        return decodeURIComponent(csrfCookie.split("=")[1] || "");
    }

    const metaToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
    return metaToken || "";
};

export const getCsrfHeaders = (headers = {}) => {
    const token = getCsrfToken();
    if (!token) {
        return { ...headers };
    }

    return {
        ...headers,
        "X-XSRF-TOKEN": token,
        "X-CSRFToken": token,
    };
};