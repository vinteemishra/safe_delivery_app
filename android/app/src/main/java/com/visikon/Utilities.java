package com.visikon;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class Utilities {
    private static final int INTERVAL = 10 * 60 * 1000; // Every 10 minutes
    // private static final int INTERVAL = 30 * 1000; // Every 30 seconds

    public static void setupAlarmReceiver(Context context) {
        Intent intent = new Intent(context, BackgroundAlarmReceiver.class);
        intent.setAction("com.visikon.background_proc");
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager != null) {
            try {
                alarmManager.setInexactRepeating(AlarmManager.RTC, System.currentTimeMillis() + INTERVAL, INTERVAL, pendingIntent);
            } catch (Exception e) {
                Log.w("Utilities", "Cannot setup alarm manager");
            }
        }
    }
}
