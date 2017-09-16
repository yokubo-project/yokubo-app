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
            firebase.database().ref(`/users/${auth.user.uid}/activities`).push({ name });
            this.isLoading = false;
        } catch (e) {
            // TODO: Proper error handling
            console.log("ERROR", JSON.stringify(e));
        }

    }

    @action fetchActivities = async () => {

        try {
            firebase.database().ref(`/users/${auth.user.uid}/activities`)
                .on("value", snapshot => {
                    this.activities = []; // TODO: Improve flow                    
                    _.each(snapshot.val(), (object, key) => {
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

        try {
            firebase.database()
                .ref(`/users/${auth.user.uid}/activities/${uid}/entries`)
                .push({ name });
            this.isLoading = false;
        } catch (e) {
            // TODO: Proper error handling
            console.log("ERROR", JSON.stringify(e));
        }

    }

    @action fetchEntries = async (entryUid: string) => {

        try {
            firebase.database().ref(`/users/${auth.user.uid}/activities/${entryUid}/entries`)
                .on("value", snapshot => {
                    this.entries = []; // TODO: Improve flow
                    _.each(snapshot.val(), (object, key) => {
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

