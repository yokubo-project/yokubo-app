export let BASE_URL = "https://yokubo.org";
export let SENTRY_ENDPOINT = "<SENTRY_ENDPOINT_URL>";

if (process.env.REACT_NATIVE_ENVIRONMENT === "development") {
    // tslint:disable-next-line:no-http-string
    BASE_URL = "http://<DEV_BACKEND_IP>:<DEV_BACKEND_PORT>";
} else if (process.env.REACT_NATIVE_ENVIRONMENT === "production") {
    BASE_URL = "https://yokubo.org";
} else {
    // tslint:disable-next-line:no-console
    console.log("No environment found");
}
// tslint:disable-next-line:no-console
console.log(`Setting config.BASE_URL to: ${BASE_URL}`);
