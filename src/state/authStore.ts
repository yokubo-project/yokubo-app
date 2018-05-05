import { observable, action } from "mobx";
import { create, persist } from "mobx-persist";

import { AuthAPI } from "../network/AuthAPI";
import APIClient from "../network/APIClient";
import { APIClientStatusCodeError } from "network-stapler";

import * as config from "../config";
import taskStore from "./taskStore";

export interface ICredentials {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}

interface IPasswordResetToken {
    username?: string;
    token: string;
    validUntil: Date;
}

export interface IImage {
    uid: string;
    file: string;
}

export interface IProfile {
    uid: string;
    name: string;
    username: string;
}

export type AuthError = "InvalidLogin" | "UserAlreadyExists" | "InvalidUsername" | "PasswordWeak" | "PasswordsDontMatch" | "UserDisabled" | "Unknown";

class Auth {

    @persist("object") @observable credentials: ICredentials = null;
    @persist @observable username: string = "";
    @persist("object") @observable profile: IProfile = null;
    @persist("object") @observable passwordResetToken: IPasswordResetToken = null;
    @observable error: AuthError = null;
    @observable isAuthenticated: boolean = false;
    @observable isLoading: boolean = false;
    @observable isRehydrated: boolean = false;

    @action signInWithPassword = async (username: string, password: string) => {
        if (this.isLoading) { return; }
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
                    if (error.statusCode === 400 && error.response.message === "InvalidLogin") {
                        this.wipe("InvalidLogin");
                    } else {
                        this.wipe("Unknown");
                    }
                } else {
                    this.wipe("Unknown");
                }
            });

    }

    @action signUp = async (username: string, password: string, name: string) => {
        if (this.isLoading) { return; }
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
                    if (error.statusCode === 400 && error.response.message === "UserAlreadyExists") {
                        this.wipe("UserAlreadyExists");
                    } else if (error.statusCode === 400 && error.response.message === "PasswordWeak") {
                        this.wipe("PasswordWeak");
                    } else {
                        this.wipe("Unknown");
                    }
                } else {
                    this.wipe("Unknown");
                }
            });
    }

    @action deleteUser = async (currentPwd: string) => {
        if (this.isLoading) { return; }
        this.isLoading = true;

        const target = AuthAPI.deleteUser(currentPwd, this.credentials.accessToken);
        return APIClient.requestType(target)
            .then(profile => {
                this.isLoading = false;
                this.wipe(null);
                taskStore.tasks = observable.map();
            }).catch(error => {
                if (error instanceof APIClientStatusCodeError) {
                    if (error.statusCode === 400 && error.response.message === "PasswordsDontMatch") {
                        this.setError("PasswordsDontMatch");
                    } else {
                        this.setError("Unknown");
                    }
                } else {
                    this.setError("Unknown");
                }
            });
    }

    @action sendForgottenPwdMail = async (username: string) => {
        if (this.isLoading) { return; }
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

    @action patchProfile = async (name: string) => {
        if (this.isLoading) { return; }
        this.isLoading = true;

        const target = AuthAPI.patchProfile(name, this.credentials.accessToken);
        return APIClient.requestType(target)
            .then(profile => {
                this.error = null;
                this.isLoading = false;
                this.profile = profile;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }

    @action getProfile = async () => {
        if (this.isLoading) { return; }
        this.isLoading = true;

        const target = AuthAPI.getProfile(this.credentials.accessToken);
        return APIClient.requestType(target)
            .then(profile => {
                this.error = null;
                this.isLoading = false;
                this.profile = profile;
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
        if (this.isLoading) { return; }
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

    @action private setError(error: AuthError) {
        this.error = error;
        this.isLoading = false;
    }

}

let auth: Auth;
auth = new Auth();

// persist this mobx state through AsyncStorage
const hydrate = create({
    storage: require("AsyncStorage"),
});

hydrate("auth", auth).then(() => {
    // trigger token exchange if credentials are available...
    if (auth.credentials !== null) {
        auth.tokenExchange().then(() => {
            auth.isRehydrated = true;
        }).catch(() => {
            auth.isRehydrated = true;
        });
    } else {
        auth.isRehydrated = true;
    }
});

// singleton, exposes an instance by default
export default auth;
