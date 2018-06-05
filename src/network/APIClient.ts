import { AuthAPIClient, ICredentialsHandler } from "auth-stapler";
// tslint:disable-next-line:no-implicit-dependencies
import { IAPIClientOptions } from "network-stapler";
import * as Config from "../config";
import authStore, { ICredentials } from "../state/authStore";
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
