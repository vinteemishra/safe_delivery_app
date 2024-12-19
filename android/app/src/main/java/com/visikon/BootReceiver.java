package com.visikon;
import android.content.BroadcastReceiver;
import android.app.Activity;
import android.content.Intent;
import android.app.PendingIntent;
import android.util.Log;
import android.content.Context;
import android.app.AlarmManager;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null && intent.getAction().equals("android.intent.action.BOOT_COMPLETED")) {
            Utilities.setupAlarmReceiver(context);
        }
    }
};
