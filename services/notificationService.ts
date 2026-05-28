import * as Notifications from "expo-notifications";

export async function scheduleNotification(task: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Task Reminder",
      body: `Don't forget: ${task}`,
      sound: true,
    },

    trigger: {
      type: "timeInterval",
      seconds: 5,
      repeats: false,
    } as Notifications.TimeIntervalTriggerInput,
  });
}