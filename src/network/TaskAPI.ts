import * as Config from "../config";
import * as authApiClient from "auth-stapler";
import { ITypedAPITarget } from "network-stapler";

import auth from "../state/auth";
import {
    ITask,
    IFullTask,
    IPatchTask,
    IPostTask,
    IMetric,
    IPatchMetric,
    IPostMetric,
    IItem,
    IPatchItem,
    IPostItem
} from "../state/task";

export const TaskAPI = {
    getTasks(accessToken: string): ITypedAPITarget<Array<IFullTask>> {
        return {
            url: "api/v1/tasks",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            parse: (json) => {
                return json as Array<IFullTask>;
            }
        };
    },
    postTask(accessToken: string, task: IPostTask): ITypedAPITarget<IFullTask> {
        return {
            url: "api/v1/tasks",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            body: {
                ...task
            },
            parse: (json) => {
                return json as IFullTask;
            }
        };
    },
    deleteTask(accessToken: string, taskUid: string): ITypedAPITarget<ITask> {
        return {
            url: `api/v1/tasks/${taskUid}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            parse: (json) => {
                return json as ITask;
            }
        };
    },
    getTask(accessToken: string, taskUid: string): ITypedAPITarget<IFullTask> {
        return {
            url: `api/v1/tasks/${taskUid}`,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            parse: (json) => {
                return json as IFullTask;
            }
        };
    },
    patchTask(
        accessToken: string,
        taskUid: string,
        task: IPatchTask
    ): ITypedAPITarget<IFullTask> {
        return {
            url: `api/v1/tasks/${taskUid}`,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            body: {
                ...task
            },
            parse: (json) => {
                return json as IFullTask;
            }
        };
    },
    postItem(accessToken: string, taskUid: string, item: IPostItem): ITypedAPITarget<IItem> {
        return {
            url: `api/v1/tasks/${taskUid}/items`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            body: {
                ...item
            },
            parse: (json) => {
                return json as IItem;
            }
        };
    },
    deleteItem(accessToken: string, taskUid: string, itemUid: string): ITypedAPITarget<ITask> {
        return {
            url: `api/v1/tasks/${taskUid}/items/${itemUid}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            parse: (json) => {
                return json as ITask;
            }
        };
    },
    patchItem(
        accessToken: string,
        taskUid: string,
        itemUid: string,
        item: IPatchItem
    ): ITypedAPITarget<IFullTask> {

        return {
            url: `api/v1/tasks/${taskUid}/items/${itemUid}`,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            body: {
                ...item
            },
            parse: (json) => {
                return json as IFullTask;
            }
        };
    },
    postMetric(
        accessToken: string,
        taskUid: string,
        metric: IPostMetric
    ): ITypedAPITarget<IMetric> {

        return {
            url: `api/v1/tasks/${taskUid}/items`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            body: {
                ...metric
            },
            parse: (json) => {
                return json as IMetric;
            }
        };
    },
    deleteMetric(accessToken: string, taskUid: string, metricUid: string): ITypedAPITarget<IMetric> {
        return {
            url: `api/v1/tasks/${taskUid}/metrics/${metricUid}`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            parse: (json) => {
                return json as IMetric;
            }
        };
    },
    patchMetric(
        accessToken: string,
        taskUid: string,
        metricUid: string,
        metric: IPatchMetric
    ): ITypedAPITarget<IFullTask> {

        return {
            url: `api/v1/tasks/${taskUid}/metrics/${metricUid}`,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            body: {
                ...metric
            },
            parse: (json) => {
                return json as IFullTask;
            }
        };
    },
};
