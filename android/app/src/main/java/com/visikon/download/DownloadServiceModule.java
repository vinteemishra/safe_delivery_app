package com.visikon.download;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class DownloadServiceModule extends ReactContextBaseJavaModule {
    private final static String TAG = DownloadServiceModule.class.getSimpleName();

    private TheActualService mService;
    private boolean mBound = false;

    public DownloadServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // Just bind the service right away!
        Intent startIntent = new Intent(reactContext, TheActualService.class);
        reactContext.bindService(startIntent, mConnection, Context.BIND_AUTO_CREATE);
    }

    @Override
    public String getName() {
        return "DownloadService";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
//        constants.put(DOWNLOAD_STATUS_NOT_STARTED, DOWNLOAD_STATUS_NOT_STARTED);
//        constants.put(DOWNLOAD_STATUS_RUNNING,     DOWNLOAD_STATUS_RUNNING);
//        constants.put(DOWNLOAD_STATUS_FINISHED,    DOWNLOAD_STATUS_FINISHED);
        return constants;
    }

    @ReactMethod
    public void startDownload(ReadableArray files, final Promise promise) {
        if (mBound && mService.getStatus() >= 0) {
            promise.reject("ALREADY_RUNNING", "Service is already running..");
            return;
        }

        Activity activity = getCurrentActivity();
        if (activity != null) {
            // Get strings
            ArrayList<String> urls = new ArrayList<>(files.size());
            for (int i=0; i<files.size(); i++) {
                urls.add(files.getString(i));
            }

            Log.d(TAG, "Calling startIntent");
            Intent startIntent = new Intent(activity, TheActualService.class);
            startIntent.setAction("start");
            startIntent.putStringArrayListExtra("urls", urls);
            activity.startService(startIntent);

            // This is a hack - we need to wait for the service to start before we resolve OK
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    promise.resolve("OK!");
                }
            }, 500);
        } else {
            promise.reject("NO_ACTIVITY", "No activity");
        }
    }

    @ReactMethod
    public void getDownloadStatus(Promise promise) {
        if (mBound) {
            promise.resolve(mService.getStatus());
        } else {
            promise.reject("UNBOUND", "Not bound..");
        }
    }

    @ReactMethod
    public void cancelDownload(Promise promise) {
        if (!isTheServiceRunning(TheActualService.class)) {
            return;
        }

        Activity activity = getCurrentActivity();
        if (activity != null) {
            // Stop service
            Intent stopIntent = new Intent(activity, TheActualService.class);
            stopIntent.setAction("stop");
            activity.startService(stopIntent);
        }
        promise.resolve("Stopped!");
    }


    private boolean isTheServiceRunning(Class<?> serviceClass) {
        if (getCurrentActivity() == null) {
            return false;
        }

        ActivityManager manager = (ActivityManager) getCurrentActivity().getSystemService(Context.ACTIVITY_SERVICE);
        if (manager == null) {
            return false;
        }
        
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Defines callbacks for service binding, passed to bindService()
     */
    private ServiceConnection mConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            // We've bound to LocalService, cast the IBinder and get LocalService instance
            TheActualService.LocalBinder binder = (TheActualService.LocalBinder) service;
            mService = binder.getService();
            mBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            mBound = false;
        }
    };

}
