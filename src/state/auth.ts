import { observable, action } from "mobx";
import { create, persist } from "mobx-persist";

import { AuthAPI } from "../network/AuthAPI";
import APIClient from "../network/APIClient";
import { APIClientStatusCodeError } from "network-stapler";

import * as config from "../config";

export interface ICredentials {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}

interface IJSONError {
    error: string;
    statusCode: number;
    message: string;
}

interface IPasswordResetToken {
    username?: string;
    token: string;
    validUntil: Date;
}

export interface IUser {
    username: string;
    givenName: string;
    familyName: string;
    birthday: string;
}

export interface IProfile {
    uid: string;
    scope: string[];
    username: string;
    givenName: string;
    familyName: string;
    pictureUrl: string;
    hasPassword: boolean;
}

export type AuthError = "PasswordWrong" | "UserAlreadyExists" | "InvalidUsername" | "PasswordWeak" | "UserDisabled" | "UserNotFound" | "Unknown";

class Auth {

    @persist("object") @observable credentials: ICredentials = null;
    @persist @observable username: string = "";
    @persist("object") @observable userProfile: IUser = null;
    @persist("object") @observable passwordResetToken: IPasswordResetToken = null;
    @observable error: AuthError = null;
    @observable isAuthenticated: boolean = false;
    @observable isLoading: boolean = false;
    @observable isRehydrated: boolean = false;

    @action signInWithPassword = async (username: string, password: string) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        const target = AuthAPI.loginWithPassword(username, password);

        return APIClient.requestType(target)
            .then(credentials => {
                this.error = null;
                this.username = username;
                this.isAuthenticated = true;
                this.isLoading = false;
                this.credentials = credentials;
            }).catch(error => {
                if (error instanceof APIClientStatusCodeError) {
                    if (error.statusCode === 422) {
                        this.wipe("PasswordWrong");
                    } else {
                        this.wipe("Unknown");
                    }
                } else {
                    this.wipe("Unknown");
                }
            });

    }

    @action signUp = async (
        username: string,
        password: string,
        name: string,
    ) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        const target = AuthAPI.register(username, password, name);

        return APIClient.requestType(target)
            .then(credentials => {
                this.error = null;
                this.username = username;
                this.isAuthenticated = true;
                this.isLoading = false;
                this.credentials = credentials;
            }).catch(error => {
                if (error instanceof APIClientStatusCodeError) {
                    if (error.statusCode === 409) {
                        this.wipe("UserAlreadyExists");
                    } else if (error.statusCode === 464) {
                        this.wipe("PasswordWeak");
                    } else {
                        this.wipe("Unknown");
                    }
                } else {
                    this.wipe("Unknown");
                }
            });
    }

    @action setForgottenPassword = async (token: string, password: string) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        const target = AuthAPI.setForgottenPassword(token, password);

        return APIClient.requestType(target)
            .then(credentials => {
                this.error = null;
                this.isAuthenticated = true;
                this.isLoading = false;
                this.credentials = credentials;
            }).catch(error => {
                if (error instanceof APIClientStatusCodeError) {
                    if (error.statusCode === 464) {
                        this.wipe("PasswordWeak");
                    } else {
                        this.wipe("Unknown");
                    }
                } else {
                    this.wipe("Unknown");
                }
            });
    }

    @action sendForgottenPwdMail = async (username: string) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        const target = AuthAPI.forgotPassword(username);

        return APIClient.requestType(target)
            .then(credentials => {
                this.error = null;
                this.isLoading = false;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }

    @action patchProfile = async (givenName: string, familyName: string) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        const target = AuthAPI.patchProfile(givenName, familyName, this.credentials.accessToken);

        return APIClient.requestType(target)
            .then(credentials => {
                this.error = null;
                this.isLoading = false;
                this.userProfile.givenName = givenName;
                this.userProfile.familyName = familyName;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }


    @action dismissError() {
        this.error = null;
    }

    @action signOut() {
        this.wipe(null);
    }

    @action tokenExchange = async () => {

        this.isLoading = true;

        try {

            if (this.credentials === null) {
                throw new Error(`No valid credentials are available`);
            }

            const res = await fetch(`${config.BASE_URL}/api/v1/auth/token`, {
                method: "POST",
                body: JSON.stringify({
                    refreshToken: this.credentials.refreshToken,
                    grantType: "refreshToken"
                })
            });

            if (!res.ok) {
                throw Error(`${res.status}: ${res.statusText}`);
            }

            const { accessToken, refreshToken, expiresIn, tokenType } = await res.json();

            this.credentials = {
                accessToken,
                refreshToken,
                expiresIn,
                tokenType
            };

            this.error = null;
            this.isAuthenticated = true;
            this.isLoading = false;

        } catch (e) {
            this.wipe("Unknown");
        }
    }

    @action private wipe(error: AuthError) {
        this.credentials = null;
        this.error = error;
        this.isAuthenticated = false;
        this.isLoading = false;
    }

}


let auth: Auth;

// persist this mobx state through AsyncStorage
const hydrate = create({
    storage: require("AsyncStorage"),
});


const persistStore = create({
    storage: require("AsyncStorage")
});

auth = new Auth();

hydrate("auth", auth).then(() => {
    // trigger token exchange if credentials are available...
    if (auth.credentials !== null) {
        console.log("hydrate.auth: credentials are available, awaiting new token...");
        auth.tokenExchange().then(() => {
            console.log("hydrate.auth: received new token!");
            auth.isRehydrated = true;
        }).catch(() => {
            console.log("hydrate.auth: failed to receive new token!");
            auth.isRehydrated = false;
        });
    } else {
        auth.isRehydrated = false;
        console.log("rehydrated, no credentials are available.");
    }
});


// development, make auth available on window object...
(window as any).auth = auth;

// singleton, exposes an instance by default
export default auth;
