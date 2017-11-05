import { observable, action } from "mobx";
import { create, persist } from "mobx-persist";
import * as _ from "lodash";

import { TaskAPI } from "../network/TaskAPI";
import APIClient from "../network/APIClient";
import { APIClientStatusCodeError } from "network-stapler";

import * as config from "../config";
import auth from "../state/auth";


export interface IPostTask {
    name: string;
    imageUrl: string;
    metrics: Array<IPostMetric>;
}

export interface IPatchTask {
    name?: string;
    imageUrl?: string;
}

export interface ITask {
    uid: string;
    name: string;
    imageUrl: string;
    createdAt: string;
}

export interface IFullTask {
    uid: string;
    name: string;
    imageUrl: string;
    createdAt: string;
    metrics: Array<IMetric>;
    items: Array<IItem>;
}

export interface IPostMetric {
    name: string;
    unit: string;
}

export interface IPatchMetric {
    name?: string;
    unit?: string;
}

export interface IMetric {
    uid: string;
    name: string;
    unit: string;
    createdAt: string;
}

export interface IPostItem {
    name: string;
    desc: string;
    period: Range;
    metric: string;
}

export interface IPatchItem {
    name?: string;
    desc?: string;
    period?: Range;
    metric?: string;
}

export interface IItem {
    uid: string;
    name: string;
    desc: string;
    period: Range;
    metric: string;
    createdAt: string;
}

export type TaskError = "Unknown";

class Activities {

    @persist("object") @observable tasks: any = [];
    // @observable entries: any = [];
    @observable error: TaskError = null;
    @observable isAuthenticated: boolean = false;
    @observable isLoading: boolean = false;
    @observable isRehydrated: boolean = false;

    @action createTask = async (task: IPostTask) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;
        const target = TaskAPI.postTask(auth.credentials.accessToken, task);

        return APIClient.requestType(target)
            .then(task => {
                // Attach new task to tasks
                this.tasks.push(task);
                this.error = null;
                this.isAuthenticated = true;
                this.isLoading = false;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }

    @action fetchActivities = async () => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;
        const target = TaskAPI.getTasks(auth.credentials.accessToken);

        return APIClient.requestType(target)
            .then(tasks => {
                console.log("TASKS: ", JSON.stringify(tasks));
                this.tasks = tasks;
                this.error = null;
                this.isAuthenticated = true;
                this.isLoading = false;
            }).catch(error => {
                this.wipe("Unknown");
            });


    }

    // @action createEntry = async (entryData: any) => {

    //     const { uid, name, datum, inputMetricsEntry } = entryData;

    //     if (this.isLoading) {
    //         // bailout, noop
    //         return;
    //     }

    //     this.isLoading = true;
    //     const createdAt = moment().toISOString();

    //     try {
    //         firebase.database().ref(`/users/${auth.user.uid}/activities/${uid}/entries`)
    //             .push({
    //                 name,
    //                 datum,
    //                 inputMetricsEntry,
    //                 createdAt
    //             });
    //         this.isLoading = false;
    //     } catch (e) {
    //         // TODO: Proper error handling
    //         console.log("Error createEntry: ", JSON.stringify(e));
    //     }

    // }

    // @action fetchEntries = async (entryUid: string) => {

    //     try {
    //         firebase.database().ref(`/users/${auth.user.uid}/activities/${entryUid}/entries`)
    //             .on("value", snapshot => {
    //                 this.entries = []; // TODO: Improve flow
    //                 _.each(snapshot.val(), (object, key) => {

    //                     const metrices = [];
    //                     if (object.inputMetricsEntry) {
    //                         Object.keys(object.inputMetricsEntry).map((key) => {
    //                             metrices.push({
    //                                 metricName: object.inputMetricsEntry[key].metricName,
    //                                 metricUnity: object.inputMetricsEntry[key].metricUnity,
    //                                 metricValue: object.inputMetricsEntry[key].metricValue,
    //                                 key
    //                             });
    //                         });
    //                     }

    //                     this.entries.push({
    //                         metrices,
    //                         name: object.name,
    //                         datum: object.datum,
    //                         createdAt: object.createdAt,
    //                         uid: key
    //                     });
    //                 });
    //             });
    //     } catch (e) {
    //         // TODO: Proper error handling
    //         console.log("Error fetchEntries: ", JSON.stringify(e));
    //         // One case of error is when user has not yet created an entry
    //         this.entries = [];
    //     }

    // }

    // @action sortEntries = async (sortKey: string, sortDirection: string) => {
    //     this.entries = _.orderBy(this.entries, sortKey, sortDirection);
    // }

    @action dismissError() {
        this.error = null;
    }

    @action signOut() {
        this.wipe(null);
    }

    @action private wipe(error: TaskError) {
        this.error = error;
        this.isAuthenticated = false;
        this.isLoading = false;
    }

}

let activities: Activities;

activities = new Activities();

// development, make auth available on window object...
(window as any).activities = activities;

// singleton, exposes an instance by default
export default activities;

