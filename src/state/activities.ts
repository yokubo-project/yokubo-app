import { observable, action } from "mobx";
import firebase from "firebase";
import * as _ from "lodash";

import auth from "./auth";

class Activities {

    @observable activities: any = [];
    @observable entries: any = [];
    @observable isLoading: boolean = false;

    @action createActivity = async (activityData: any) => {

        const { name } = activityData;

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        try {
            await firebase.database().ref(`/users/${auth.user.uid}/activities`).push({ name });
        } catch (e) {
            // TODO: Proper error handling
            console.log("ERROR", JSON.stringify(e));
        }

    }

    @action fetchActivities = async () => {

        this.activities = []; // TODO: Improve flow
        try {
            firebase.database().ref(`/users/${auth.user.uid}/activities`)
                .on("value", snapshot => {
                    _.each(snapshot.val(), (object, key) => {
                        console.log("activity IS: ", JSON.stringify({
                            name: object.name,
                            uid: key
                        }));
                        this.activities.push({
                            name: object.name,
                            uid: key
                        });
                    });
                });
        } catch (e) {
            // TODO: Proper error handling
            console.log("ERROR", JSON.stringify(e));
        }

    }

    @action createEntry = async (entryData: any) => {

        const { uid, name } = entryData;

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        console.log(`CREATING ENTY FOR: /users/${auth.user.uid}/activities/${uid}/entries`);

        try {
            await firebase.database()
                .ref(`/users/${auth.user.uid}/activities/${uid}/entries`)
                .push({ name });
        } catch (e) {
            // TODO: Proper error handling
            console.log("ERROR", JSON.stringify(e));
        }

    }

    @action fetchEntries = async (entryUid: string) => {

        this.entries = []; // TODO: Improve flow
        try {
            firebase.database().ref(`/users/${auth.user.uid}/activities/${entryUid}/entries`)
                .on("value", snapshot => {
                    _.each(snapshot.val(), (object, key) => {
                        console.log("entry IS: ", JSON.stringify({
                            name: object.name,
                            uid: key
                        }));
                        this.entries.push({
                            name: object.name,
                            uid: key
                        });
                    });
                });
        } catch (e) {
            // TODO: Proper error handling
            console.log("ERROR", JSON.stringify(e));
        }

    }

}

let activities: Activities;

activities = new Activities();

// development, make auth available on window object...
(window as any).activities = activities;

// singleton, exposes an instance by default
export default activities;

