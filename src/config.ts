export let BASE_URL = "https://yokubo.org";

if (process.env.REACT_NATIVE_ENVIRONMENT === "development") {
    console.log(`Setting config.BASE_URL: http://192.168.0.2:8080`);
    BASE_URL = "http://192.168.0.2:8080";
} else if (process.env.REACT_NATIVE_ENVIRONMENT === "production") {
    console.log(`Setting config.BASE_URL: https://yokubo.org`);
    BASE_URL = "https://yokubo.org";
} else {
    console.log("No environment found");
    console.log(`Setting config.BASE_URL: https://yokubo.org`);
    BASE_URL = "https://yokubo.org";
    // throw new Error("No environment found");
}
