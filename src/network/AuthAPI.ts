// tslint:disable-next-line:no-implicit-dependencies
import { ITypedAPITarget } from "network-stapler";

import { ICredentials, IProfile } from "../state/authStore";

// tslint:disable-next-line:variable-name
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
        name: string
    ): ITypedAPITarget<ICredentials> {
        return {
            url: "api/v1/auth/register",
            method: "POST",
            body: {
                username,
                password,
                name
            },
            parse: (json) => {
                return json as ICredentials;
            }
        };
    },
    forgotPassword(username: string): ITypedAPITarget<string> {
        return {
            url: "api/v1/auth/forgotpwd",
            method: "POST",
            body: {
                username
            },
            parse: (json) => {
                return (json as any).validUntil;
            }
        };
    },
    deleteUser(currentPwd: string, accessToken: string): ITypedAPITarget<IProfile> {
        return {
            url: "api/v1/auth/user",
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                currentPwd
            },
            parse: (json) => {
                return json as IProfile;
            }
        };
    },
    getProfile(accessToken: string): ITypedAPITarget<IProfile> {
        return {
            url: "api/v1/auth/user",
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            parse: (json) => {
                return json as IProfile;
            }
        };
    },
    patchProfile(profile: { username?: string; name?: string }, accessToken: string): ITypedAPITarget<IProfile> {
        return {
            url: "api/v1/auth/user",
            method: "PATCH",
            body: {
                ...profile
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            parse: (json) => {
                return json as IProfile;
            }
        };
    },
    resetPwd(currentPwd: string, newPwd: string, accessToken: string): ITypedAPITarget<ICredentials> {
        return {
            url: "api/v1/auth/resetpwd",
            method: "POST",
            body: {
                currentPwd,
                newPwd
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            parse: (json) => {
                return json as ICredentials;
            }
        };
    }
};
