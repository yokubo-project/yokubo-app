import * as Config from "../config";
import authStore from "../state/authStore";

export async function uploadImageAsync(uri: string): Promise<string> {
    const apiUrl = `${Config.BASE_URL}/api/v1/images`;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append("photo", {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`
    } as any);

    const options = {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authStore.credentials.accessToken}`
        }
    };

    const results = await fetch(apiUrl, options);
    const parsedResults = await results.json();

    return parsedResults[0].uid;
}
