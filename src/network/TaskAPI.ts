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
} from "../state/activities";

export const TaskAPI = {
    getTasks(accessToken: string): ITypedAPITarget<Array<ITask>> {
        return {
            url: "api/v1/tasks",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + auth.credentials.accessToken,
            },
            parse: (json) => {
                return json as Array<ITask>;
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
    deleteTask(accessToken: string, taskUid: string) {
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
    getTask(accessToken: string, taskUid: string) {
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
    patchTask(accessToken: string, taskUid: string, task: IPatchTask) {
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
    postItem(accessToken: string, taskUid: string, item: IPostItem) {
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
    deleteItem(accessToken: string, taskUid: string, itemUid: string) {
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
    patchItem(accessToken: string, taskUid: string, itemUid: string, item: IPatchItem) {
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
    postMetric(accessToken: string, taskUid: string, metric: IPostMetric) {
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
    deleteMetric(accessToken: string, taskUid: string, metricUid: string) {
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
    patchMetric(accessToken: string, taskUid: string, metricUid: string, metric: IPatchMetric) {
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
