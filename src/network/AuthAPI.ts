import * as Config from "../config";
import * as authApiClient from "auth-stapler";
import { ITypedAPITarget } from "network-stapler";

import auth from "../state/auth";
import { ICredentials, IProfile } from "../state/auth";

export const AuthAPI = {
    refreshAccessToken(refreshtoken: string): ITypedAPITarget<ICredentials> {
        return {
            url: "api/v1/auth/token",
            method: "POST",
            body: {
                refreshToken: refreshtoken,
                grantType: "refreshToken"
            },
            parse: (json) => {
                return json as ICredentials;
            }
        };
    },
    loginWithPassword(username: string, password: string): ITypedAPITarget<ICredentials> {
        return {
            url: "api/v1/auth/token",
            method: "POST",
            body: {
                username,
                password,
                grantType: "password"
            },
            parse: (json) => {
                return json as ICredentials;
            }
        };
    },
    register(
        username: string,
        password: string,
        name: string,
    ): ITypedAPITarget<ICredentials> {
        return {
            url: "api/v1/auth/register",
            method: "POST",
            body: {
                username,
                password,
                // name // TODO: Refactore profile endpoint on backend
            },
            parse: (json) => {
                return json as ICredentials;
            }
        };
    },
    setForgottenPassword(token: string, password: string): ITypedAPITarget<ICredentials> {
        return {
            url: "api/v1/auth/set-forgotten-password",
            method: "POST",
            body: {
                token,
                password
            },
            parse: (json) => {
                return json as ICredentials;
            }
        };
    },
    forgotPassword(username: string): ITypedAPITarget<string> {
        return {
            url: "api/v1/auth/forgot-password",
            method: "POST",
            body: {
                username
            },
            parse: (json) => {
                return (json as any).validUntil;
            }
        };
    },
    patchProfile(givenName: string, familyName: string, accessToken: string): ITypedAPITarget<IProfile> {
        return {
            url: "app/v1/user/profile",
            method: "PATCH",
            body: {
                givenName,
                familyName
            },
            headers: {
                "Authorization": "Bearer " + accessToken,
            },
            parse: (json) => {
                return json as IProfile;
            }
        };
    },
};
