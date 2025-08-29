import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { RootState, store } from '../persistReduxStore';
import { finish } from './gameSessionSlice';

const TASK = 'background-task';

TaskManager.defineTask(TASK, async () => {
    const { session } = store.getState() as RootState;
    const snap = session?.data;

    if (snap && Date.now() >= snap.endsAt && snap.status === 'active') {
        store.dispatch(finish('expired'));
    }

    return BackgroundTask.BackgroundTaskResult.Success;
});

export function scheduleGameEndNotification(endsAt: number) {
    return Notifications.scheduleNotificationAsync({
        content: {
            title: 'Game over',
            body: 'Open the app to see the result',
            data: { url: '/results' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Math.max(1, (endsAt - Date.now()) / 1000),
        },
    });
}

export async function scheduleBackgroundCheck(endsAt: number) {
    await BackgroundTask.registerTaskAsync(TASK, { minimumInterval: 15 });
    await scheduleGameEndNotification(endsAt);
}
