import { observable, action } from "mobx";
import firebase from "firebase";
import * as _ from "lodash";
import moment from "moment";

import auth from "./auth";

class Activities {

    @observable activities: any = [];
    @observable entries: any = [];
    @observable isLoading: boolean = false;

    @action createActivity = async (activityData: any) => {

        const { name, imageUrl } = activityData;

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        try {
            firebase.database().ref(`/users/${auth.user.uid}/activities`).push({
                name,
                imageUrl,
                createdAt: moment().toDate()
            });
            this.isLoading = false;
        } catch (e) {
            // TODO: Proper error handling
            console.log("Error createActivity: ", JSON.stringify(e));
            // Create first activity
            firebase.database().ref(`/users/${auth.user.uid}/activities`).set({
                name,
                createdAt: moment().toDate()
            });
        }

    }

    @action fetchActivities = async () => {

        try {
            firebase.database().ref(`/users/${auth.user.uid}/activities`)
                .on("value", snapshot => {
                    this.activities = []; // TODO: Improve flow                    
                    _.each(snapshot.val(), (object, key) => {
                        this.activities.push({
                            uid: key,
                            name: object.name,
                            imageUrl: object.imageUrl,
                            createdAt: object.createdAt,
                        });
                    });
                });
        } catch (e) {
            // TODO: Proper error handling
            console.log("Error fetchActivities: ", JSON.stringify(e));
            // One case of error is when user has not yet created an activity
            this.activities = [];
        }

    }

    @action createEntry = async (entryData: any) => {

        const { uid, name, datum } = entryData;

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;

        try {
            firebase.database().ref(`/users/${auth.user.uid}/activities/${uid}/entries`)
                .push({
                    name,
                    datum,
                    createdAt: moment().toDate()
                });
            this.isLoading = false;
        } catch (e) {
            // TODO: Proper error handling
            console.log("Error createEntry: ", JSON.stringify(e));
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
                            datum: object.datum,
                            createdAt: object.createdAt,
                            uid: key
                        });
                    });
                });
        } catch (e) {
            // TODO: Proper error handling
            console.log("Error fetchEntries: ", JSON.stringify(e));
            // One case of error is when user has not yet created an entry
            this.entries = [];
        }

    }

    @action sortEntries = async (sortKey: string, sortDirection: string) => {
        this.entries = _.orderBy(this.entries, sortKey, sortDirection);
    }

}

let activities: Activities;

activities = new Activities();

// development, make auth available on window object...
(window as any).activities = activities;

// singleton, exposes an instance by default
export default activities;

