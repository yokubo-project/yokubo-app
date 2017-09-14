import { observable, action, autorun } from "mobx";
import firebase from "firebase";

export type AuthError = "PasswordWrong" | "EmailAlreadyExists" | "InvalidEmail" | "WeakPassword" | "UserDisabled" | "UserNotFound" | "Unknown";

class Auth {

    @observable username: string = "";
    @observable user: any = null;
    @observable error: AuthError = null;
    @observable isAuthenticated: boolean = false;
    @observable isLoading: boolean = false;
    @observable isRehydrated: boolean = false;

    @action signInWithPassword = async (signInData: any) => {

        const { email, password } = signInData;

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        try {
            this.user = await firebase.auth().signInWithEmailAndPassword(email, password);
            this.error = null;
            this.username = this.user.displayName;
            this.isAuthenticated = true;
            this.isLoading = false;
        } catch (e) {
            if (e.code === "auth/user-disabled") {
                this.wipe("UserDisabled");
            } else if (e.code === "auth/invalid-email") {
                this.wipe("InvalidEmail");
            } else if (e.code === "auth/user-not-found") {
                this.wipe("UserNotFound");
            } else if (e.code === "auth/wrong-password") {
                this.wipe("PasswordWrong");
            } else {
                this.wipe("Unknown");
            }
        }
    }

    @action signUp = async (signUpData) => {

        const { name, email, password } = signUpData;

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        try {
            this.user = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await this.user.updateProfile({
                displayName: name
            });
            this.error = null;
            this.username = name;
            this.isAuthenticated = true;
            this.isLoading = false;
        } catch (e) {
            if (e.code === "auth/email-already-in-use") {
                this.wipe("EmailAlreadyExists");
            } else if (e.code === "auth/invalid-email") {
                this.wipe("InvalidEmail");
            } else if (e.code === "auth/weak-password") {
                this.wipe("WeakPassword");
            } else if (e.code === "auth/operation-not-allowed") {
                this.wipe("Unknown");
            } else {
                this.wipe("Unknown");
            }
        }

    }

    @action signOut = async () => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        try {
            await this.user.signOut();
            this.wipe(null);
        } catch (e) {
            if (e.code === "auth/email-already-in-use") {
                this.wipe("EmailAlreadyExists");
            } else if (e.code === "auth/invalid-email") {
                this.wipe("InvalidEmail");
            } else if (e.code === "auth/weak-password") {
                this.wipe("WeakPassword");
            } else if (e.code === "auth/operation-not-allowed") {
                this.wipe("Unknown");
            } else {
                this.wipe("Unknown");
            }
        }

    }

    @action dismissError() {
        this.error = null;
    }

    @action private wipe(error: AuthError) {
        this.user = null;
        this.username = null;
        this.error = error;
        this.isAuthenticated = false;
        this.isLoading = false;
    }

}


let auth: Auth;

// // persist this mobx state through localforage
// const hydrate = create({
//     storage: require("localforage"),
// });

// const persistStore = create({
//     storage: require("localforage")
// });

auth = new Auth();

// hydrate("auth", auth).then(() => {
//     // trigger token exchange if credentials are available...
//     if (auth.credentials !== null) {
//         console.log("hydrate.auth: credentials are available, awaiting new token...");
//         auth.tokenExchange().then(() => {
//             console.log("hydrate.auth: received new token!");
//             auth.isRehydrated = true;
//         }).catch(() => {
//             console.log("hydrate.auth: failed to receive new token!");
//             auth.isRehydrated = true;
//         });
//     } else {
//         auth.isRehydrated = true;
//         console.log("rehydrated, no credentials are available.");
//     }
// });


// development, make auth available on window object...
(window as any).auth = auth;

// singleton, exposes an instance by default
export default auth;
