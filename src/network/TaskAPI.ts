// tslint:disable-next-line:no-implicit-dependencies
import { ITypedAPITarget } from "network-stapler";

import {
    IFullTask,
    IItem,
    IMetric,
    IPatchItem,
    IPatchMetric,
    IPatchTask,
    IPostItem,
    IPostMetric,
    IPostTask,
    ITask
} from "../state/taskStore";

// tslint:disable-next-line:variable-name
export const TaskAPI = {
    getTasks(accessToken: string): ITypedAPITarget<IFullTask[]> {
        return {
            url: "api/v1/tasks",
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            parse: (json) => {
                return json as IFullTask[];
            }
        };
    },
    postTask(accessToken: string, task: IPostTask): ITypedAPITarget<IFullTask> {
        return {
            url: "api/v1/tasks",
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
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
                Authorization: `Bearer ${accessToken}`
            },
            body: {
                ...metric
            },
            parse: (json) => {
                return json as IFullTask;
            }
        };
    }
};
