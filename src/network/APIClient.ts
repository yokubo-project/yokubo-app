import * as Config from "../config";
import { AuthAPIClient, ICredentialsHandler } from "auth-stapler";
import { IAPIClientOptions } from "network-stapler";
import authStore from "../state/authStore";
import { ICredentials } from "../state/authStore";
import { AuthAPI } from "./AuthAPI";

const handler: ICredentialsHandler<ICredentials> = {
    /**
     * should store the newly received accesstoken
     */
    refreshAccessTokenSuccess: (data) => {
        authStore.credentials = data;
    },
    /**
     * should handle unsuccessful refresh access token attempts
     */
    refreshAccessTokenError: (error) => {
        authStore.signOut();
    },
    /**
     * should provide endpoint target information for refreshing access token
     */
    getRefreshAccessTokenTarget: () => {
        return AuthAPI.refreshAccessToken(authStore.credentials.refreshToken);
    },
    /**
     * defines error code on which token exchange shall start
     */
    refreshAccessTokenOnStatusCode: 401
};

const options: IAPIClientOptions = {
    baseUrl: Config.BASE_URL,
    throwOnErrorStatusCodes: true
};

const apiClient = new AuthAPIClient(options, handler);

export default apiClient;
