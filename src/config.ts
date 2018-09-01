export let BASE_URL = "https://yokubo.org";

if (process.env.REACT_NATIVE_ENVIRONMENT === "development") {
    // tslint:disable-next-line:no-console
    console.log("Setting config.BASE_URL: http://192.168.0.87:8080");
    // tslint:disable-next-line:no-http-string
    BASE_URL = "http://192.168.0.87:8080";
} else if (process.env.REACT_NATIVE_ENVIRONMENT === "production") {
    // tslint:disable-next-line:no-console
    console.log("Setting config.BASE_URL: https://yokubo.org");
    BASE_URL = "https://yokubo.org";
} else {
    // tslint:disable-next-line:no-console
    console.log("No environment found");
    // tslint:disable-next-line:no-console
    console.log("Setting config.BASE_URL: https://yokubo.org");
    BASE_URL = "https://yokubo.org";
}
