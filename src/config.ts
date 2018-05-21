export let BASE_URL;

if (process.env.REACT_NATIVE_ENVIRONMENTT === "development") {
    BASE_URL = process.env.DEVELOPMENT_BASE_URL;
} else if (process.env.REACT_NATIVE_ENVIRONMENTT === "production") {
    BASE_URL = process.env.PRODUCTION_BASE_URL;
} else {
    console.log("No environment found");
    throw new Error("No environment found");
}

console.log(`config.BASE_URL: ${BASE_URL}`);
