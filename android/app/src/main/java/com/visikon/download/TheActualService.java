package com.visikon.download;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.NotificationCompat;
import android.util.Log;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import dk.maternity.safedelivery.MainActivity;

public class TheActualService extends Service {

    private final static int TIMEOUT_ATTEMPT_1 = 15000;
    private final static int TIMEOUT_ATTEMPT_2 = 120000;
    private final static int TIMEOUT_ATTEMPT_3 = 3600000;

    private String TAG = TheActualService.class.getSimpleName();
    private int SERVICE_ID = 101;

    private static final String CHANNEL_ID = "default";

    private final IBinder mBinder = new LocalBinder();
    private Handler handler;
    private Runnable r;
    private boolean stopped = true;
    private boolean failed = false;
    private int totalItems = 0;

    private static String baseUrl = "https://sdacms.blob.core.windows.net";

    private List<String> urls = new ArrayList<>();

    public TheActualService() {
        HandlerThread ht = new HandlerThread(TAG);
        ht.start();
        handler = new Handler(ht.getLooper());
    }

    public class LocalBinder extends Binder {
        TheActualService getService() {
            // Return this instance of LocalService so clients can call public methods
            return TheActualService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    public int getStatus() {
        if (failed) {
            return -2;
        }

        if (stopped) {
            return -1;
        }

        return urls.size();
    }

    public void initNotificationChannel() {
        if (Build.VERSION.SDK_INT < 26) {
            return;
        }

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager == null) {
            Log.w(TAG, "No notification manager");
            return;
        }

        if (notificationManager.getNotificationChannel(CHANNEL_ID) == null) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Channel name",
                    NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Channel description");
            channel.enableVibration(false);
            channel.setSound(null, channel.getAudioAttributes());
            notificationManager.createNotificationChannel(channel);
        }
    }

    private Notification updateNotification() {
        initNotificationChannel();

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class), PendingIntent.FLAG_IMMUTABLE);

        long percentage = totalItems > 0 ? Math.round((totalItems - urls.size()) / (double) totalItems * 100) : 100;
        String info = Math.round(percentage) + "%";
        return new NotificationCompat.Builder(this, CHANNEL_ID).setContentTitle("Downloading language. Please wait.")
                .setTicker(info).setContentText(info).setContentIntent(pendingIntent)
                .setSmallIcon(android.R.drawable.stat_sys_download).setOngoing(true).build();
    }

    private void showFinishedNotification() {
        // Don't show anything if we were cancelled.
        if (stopped) {
            return;
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class), PendingIntent.FLAG_IMMUTABLE);

        Notification finishNotification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Downloading done.").setTicker("Finished").setContentText("Finished")
                .setContentIntent(pendingIntent).setSmallIcon(android.R.drawable.stat_sys_download_done)
                .setAutoCancel(true).setOngoing(false).build();

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        notificationManager.notify(1039, finishNotification);
    }

    private void downloadFiles(int timeout) {

        Log.e(TAG, "DownloadFiles function!" );

        List<String> localListOfUrls = new ArrayList<>(urls);
        String filesDir = getFilesDir().getPath();

        for (String s : localListOfUrls) {
            if (stopped) {
                break;
            }

            try {
                Log.e(TAG, "DownloadFiles function! -> try download");
                URL url = new URL(baseUrl + s);
                URLConnection c = url.openConnection();
                c.setConnectTimeout(15000);
                c.setReadTimeout(timeout);
                Utils.saveFile(c.getInputStream(), filesDir, s);
                urls.remove(s);
            } catch (IOException e) {
                Log.e(TAG, "IO!", e);
            }

            // Don't update notifications if we were cancelled
            if (!stopped) {
                startForeground(SERVICE_ID, updateNotification());
            }
        }
    }

    private boolean hasMissingFiles() {
        return urls.size() > 0;
    }

    private void downloadUrls() {
        Log.e(TAG, "DownloadUrls is now running!" );
        r = new Runnable() {
            @Override
            public void run() {

                // New job - not cancelled
                stopped = false;
                failed = false;

                // First try
                Log.e(TAG, "First attempth!" );
                downloadFiles(TIMEOUT_ATTEMPT_1);

                if (hasMissingFiles()) {
                    Log.e(TAG, "Seccond attempth!" );
                    downloadFiles(TIMEOUT_ATTEMPT_2);
                }

                if (hasMissingFiles()) {
                    Log.e(TAG, "Third attempth!" );
                    downloadFiles(TIMEOUT_ATTEMPT_3);
                }

                if (hasMissingFiles()) {
                    Log.e(TAG, "Failed! - More that 3 attaemts of download missing files" );
                    failed = true;
                }

                stopped = true;
                stopForeground(true);

                Log.e(TAG, "Download complete" );
            }
        };
        handler.post(r);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            return Service.START_STICKY;
        }

        if ("start".equals(intent.getAction())) {
            stopped = false;
            urls.addAll(intent.getStringArrayListExtra("urls"));
            totalItems = urls.size();
            startForeground(SERVICE_ID, updateNotification());
            downloadUrls();
        }

        if ("stop".equals(intent.getAction())) {
            handler.removeCallbacks(r);
            stopped = true;
            urls.clear();
            totalItems = 0;
            stopForeground(true);
            stopSelf();
        }

        return Service.START_STICKY;
    }
}