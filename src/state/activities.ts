import { observable, action } from "mobx";
import firebase from "firebase";
import * as _ from "lodash";

import auth from "./auth";

class Activities {

    @observable list: any = [];
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

        try {
            firebase.database().ref(`/users/${auth.user.uid}/activities`)
                .on("value", snapshot => {
                    // console.log("VAÖIES ARE: ", JSON.stringify(snapshot.val()));
                    _.each(snapshot.val(), object => {
                        this.list.push({name: object.name});
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

