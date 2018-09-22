import * as Config from "../../config";
import authStore from "../state/authStore";

export const UPLOAD_IMAGE_ERR_SIZE_TO_LARGE = "UploadSizeTooLarge";
export const UPLOAD_IMAGE_ERR_UNKNOWN = "UnknownImageUploadError";

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
    if (results.status !== 200) {
        if (results.status === 413) {
            throw new Error(UPLOAD_IMAGE_ERR_SIZE_TO_LARGE);
        }
        throw new Error(UPLOAD_IMAGE_ERR_UNKNOWN);
    }
    const parsedResults = await results.json();

    return parsedResults[0].uid;
}
