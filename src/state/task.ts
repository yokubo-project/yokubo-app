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
    imageUid: string;
    metrics: Array<IPostMetric>;
}

export interface IPatchTask {
    name?: string;
    imageUid?: string;
}

export interface ITask {
    uid: string;
    name: string;
    createdAt: string;
}

export interface IImage {
    uid: string;
    file: string;
}

export interface IFullTask {
    uid: string;
    name: string;
    createdAt: string;
    image: IImage;
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
    period: any; // TODO Range;
    metrics: string;
}

export interface IPatchItem {
    name?: string;
    desc?: string;
    period?: any; // TODO Range;
    metrics?: string;
}

export interface IItem {
    uid: string;
    name: string;
    desc: string;
    period: any; // TODO Range;
    metrics: string;
    createdAt: string;
}

export type TaskError = "Unknown";

class Tasks {

    @observable tasks: any = [];
    @observable taskItems: any = []; // Items of active task
    @observable taskMetrics: any = []; // Metrics of active task

    @observable error: TaskError = null;
    @observable isAuthenticated: boolean = false;
    @observable isLoading: boolean = false;
    @observable isRehydrated: boolean = false;

    @action fetchTasks = async () => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;
        const target = TaskAPI.getTasks(auth.credentials.accessToken);

        return APIClient.requestType(target)
            .then(tasks => {
                this.tasks = tasks;
                this.error = null;
                this.isAuthenticated = true;
                this.isLoading = false;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }

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

    @action patchTask = async (taskUid: string, task: IPatchTask) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;
        const target = TaskAPI.patchTask(auth.credentials.accessToken, taskUid, task);

        return APIClient.requestType(target)
            .then(response => {
                // Replace old item with patched item
                const foundIndex = this.tasks.findIndex(task => task.uid === response.uid);
                this.tasks[foundIndex] = response;
                this.error = null;
                this.isAuthenticated = true;
                this.isLoading = false;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }

    @action deleteTask = async (taskUid: string) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;
        const target = TaskAPI.deleteTask(auth.credentials.accessToken, taskUid);

        try {
            const response = await APIClient.requestType(target);
            // Delete old task from tasks
            this.tasks = this.tasks.filter(task => task.uid !== response.uid);
            this.error = null;
            this.isAuthenticated = true;
            this.isLoading = false;
        } catch (error) {
            this.wipe("Unknown");
        }

    }

    @action createItem = async (taskUid: string, item: IPostItem) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;
        const target = TaskAPI.postItem(auth.credentials.accessToken, taskUid, item);

        return APIClient.requestType(target)
            .then(item => {
                // Attach new item to items
                this.taskItems.push(item);
                this.error = null;
                this.isAuthenticated = true;
                this.isLoading = false;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }

    @action patchItem = async (taskUid: string, itemUid: string, item: IPatchItem) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;
        const target = TaskAPI.patchItem(auth.credentials.accessToken, taskUid, itemUid, item);

        return APIClient.requestType(target)
            .then(item => {
                // Replace old item with patched item
                const foundIndex = this.taskItems.findIndex(taskItem => taskItem.uid === item.uid);
                this.taskItems[foundIndex] = item;
                this.error = null;
                this.isAuthenticated = true;
                this.isLoading = false;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }

    @action deleteItem = async (taskUid: string, itemUid: string) => {

        if (this.isLoading) {
            // bailout, noop
            return;
        }

        this.isLoading = true;
        const target = TaskAPI.deleteItem(auth.credentials.accessToken, taskUid, itemUid);

        return APIClient.requestType(target)
            .then(item => {
                // Delete old item from items
                this.taskItems = this.taskItems.filter(taskItem => taskItem.uid !== item.uid);
                // Also remove it from tasks
                this.tasks.forEach(task => {
                    task.items ? task.items = task.items.filter(taskItem => taskItem.uid !== item.uid) : null;
                });
                this.error = null;
                this.isAuthenticated = true;
                this.isLoading = false;
            }).catch(error => {
                this.wipe("Unknown");
            });

    }

    @action setTaskItems = async (taskUid: string) => {
        const [filteredTask] = this.tasks.filter(task => task.uid === taskUid);
        this.taskItems = filteredTask.items;
    }

    @action sortTaskItems = async (sortKey: string, sortDirection: string) => {
        this.taskItems = _.orderBy(this.taskItems, sortKey, sortDirection);
    }

    @action setTaskMetrics = async (taskUid: string) => {
        const [filteredTask] = this.tasks.filter(task => task.uid === taskUid);
        this.taskMetrics = filteredTask.metrics;
    }

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

let tasks: Tasks;

tasks = new Tasks();

// development, make auth available on window object...
(window as any).tasks = tasks;

// singleton, exposes an instance by default
export default tasks;

