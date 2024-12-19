package com.visikon;

import android.content.BroadcastReceiver;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;
import android.content.Context;
import android.content.ContextWrapper;
import android.widget.Toast;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.lang.String;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.InputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.net.MalformedURLException;
import java.io.IOException;
import java.io.EOFException;
import java.io.ByteArrayOutputStream;
import java.util.zip.GZIPOutputStream;
import java.io.BufferedWriter;
import java.nio.charset.StandardCharsets;
import java.io.OutputStreamWriter;
import java.io.InputStreamReader;
import java.io.FileOutputStream;
import java.io.FileInputStream;

import dk.maternity.safedelivery.BuildConfig;

public class BackgroundAlarmReceiver extends BroadcastReceiver {
    private final static String TAG = "VisikonDataService";
    private final Object lock = new Object();
    private static Thread backgroundProcThread;

    public final static String ANALYTICS_URL = "https://sda.maternity.dk/api/public/events";
    public final static String ANALYTICS_URL_DEBUG = "http://10.0.2.2:9000/api/public/events";

    public final static String PROFILE_URL = "/api/public/profiles";
    public final static String PROFILE_URL_DEFAULT = "https://sda.maternity.dk";

    private static class BackgroundRunnable implements Runnable {
        private Context context;

        BackgroundRunnable(Context context) {
            this.context = context;
        }

        @Override
        public void run() {
            Log.i(TAG, "BackgroundAlarmReceiver run");
            if (isOnline(this.context)) {
                sendData(this.context);
            }
        }
    }

    public static boolean isOnline(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo netInfo = cm.getActiveNetworkInfo();
            // should check null because in airplane mode it will be null
            return (netInfo != null && netInfo.isConnected());
        }
        return false;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i(TAG, "Received intent: " + intent + ", action=" + intent.getAction());
        synchronized (lock) {
            if (backgroundProcThread == null || !backgroundProcThread.isAlive()) {
                backgroundProcThread = new Thread(new BackgroundRunnable(context), "backgroundProcThread");
                backgroundProcThread.start();
            }
        }
    }

    private static void sendData(Context context) {
        Log.i(TAG, "time to send analytics data");

        sendProfiles(context);

        if (BuildConfig.DEBUG) {
            sendAnalytics(context, ANALYTICS_URL_DEBUG);
        } else {
            sendAnalytics(context, ANALYTICS_URL);
        }
    }

    private static void sendAnalytics(Context context, String url) {
        File path = new ContextWrapper(context).getFilesDir();
        Log.i(TAG, "path=" + path.getAbsolutePath());
        File f = new File(path, "analytics.json");
        if (f.exists()) {
            long len = f.length();
            if (len > 0) {
                try {
                    FileReader in = new FileReader(f);
                    char[] content = new char[(int) len];

                    int num_read = in.read(content);
                    String content_string = new String(content, 0, num_read);

                    Log.i(TAG, "analytics data to send:" + content_string);

                    httpRequestSyncResult result = httpRequestSync(url, content_string);
                    Log.i(TAG, "analytics data sent code=" + result.code);

                    if (result.code == 200 || result.code == 400) {
                        // delete the file
                        if (f.delete()) {
                            Log.i(TAG, "analytics data sent and deleted");
                        } else {
                            Log.i(TAG, "analytics data could not be deleted");
                        }
                    }
                    in.close();
                } catch (Exception ex) {
                    Log.e(TAG, "could not read " + f.getAbsolutePath());
                }
            }
        } else {
            Log.i(TAG, "no analytics data to send");
        }
    }

    private static String getEndpoint(Context context) {
        File path = new ContextWrapper(context).getFilesDir();

        File endpointFile = new File(path, "profile_endpoint.txt");
        if (endpointFile.exists()) {
            long len = endpointFile.length();
            try {
                FileReader in = new FileReader(endpointFile);
                char[] content = new char[(int) len];

                int num_read = in.read(content);
                String content_string = new String(content, 0, num_read);
                Log.i(TAG, "Got this endpoint:" + content_string);
                in.close();
                return content_string;
            } catch (Exception ex) {
                return PROFILE_URL_DEFAULT;
            }
        } else {
            return PROFILE_URL_DEFAULT;
        }
    }

    private static void sendProfiles(Context context) {
        File path = new ContextWrapper(context).getFilesDir();
        Log.i(TAG, "path=" + path.getAbsolutePath());

        String endpoint = getEndpoint(context);

        File f = new File(path, "profiles.json");

        if (f.exists()) {
            long len = f.length();
            if (len > 0) {
                try {
                   /* FileReader in = new FileReader(f);
                    char[] content = new char[(int) len];

                    int num_read = in.read(content);
                    String content_string = new String(content, 0, num_read);
                    Log.i(TAG, "profiles data to send:" + content_string); */
                /** CODE TO REPLACE FILEREADER TO ADD CHARSET */

                    char[] content = new char[(int) len];
                    InputStream inputStream = new FileInputStream(f);
                    InputStreamReader inputstreamreader = new InputStreamReader(inputStream, "UTF-8");   
                    int num_read = inputstreamreader.read();
                    String content_string = new String(content, 0, num_read);


                    String url = endpoint + PROFILE_URL;
                    Log.i(TAG, "profiles sync url:" + url);
                    httpRequestSyncResult result = httpRequestSync(url, content_string);
                    Log.i(TAG, "profiles data sent code=" + result.code);

                    if (result.code == 200 && result.body.length() >= 2) {
                        File f2 = new File(path, "profiles_updated.json");

                        try {
                           // FileWriter out = new FileWriter(f2);
                            OutputStream outputStream = new FileOutputStream(f2);
                            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream, "UTF-8");
                            outputStreamWriter.write(result.body);
                            //out.write(result.body, 0, result.body.length());
                            Log.i(TAG, "wrote updated profiles:" + result.body);
                           // out.close();
                            outputStreamWriter.close();
                        } catch (Exception e) {
                            Log.e(TAG, "Couldn't write updated profile info");
                        }
                    }
                    //in.close();
                    inputstreamreader.close();
                } catch (Exception ex) {
                    Log.e(TAG, "could not read " + f.getAbsolutePath());
                }
            }
        } else {
            Log.i(TAG, "no profiles data to send");
        }
    }

    private static class httpRequestSyncResult {
        int code;
        String body;

        httpRequestSyncResult(int code, String body) {
            this.code = code;
            this.body = body;
        }
    }

    private static httpRequestSyncResult httpRequestSync(String urlstr, String postData) {
        HttpURLConnection urlConnection = null;
        String result = "";
        int code = 0;
        try {
            URL url = new URL(urlstr);
            urlConnection = (HttpURLConnection) url.openConnection();

            urlConnection.setDoOutput(true); // Use POST

            byte[] compressedPostData = gzipCompress(postData);

            urlConnection.setFixedLengthStreamingMode(compressedPostData.length); // Length is known in advance
            urlConnection.setRequestMethod("POST");

            urlConnection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
            urlConnection.setRequestProperty("Content-Encoding", "gzip");
            urlConnection.setRequestProperty("Accept-Charset", "UTF-8");

            OutputStream out = new BufferedOutputStream(urlConnection.getOutputStream(), 8 * 1024); // specify a buffer
                                                                                                    // size to shutup
                                                                                                    // the log warning
            out.write(compressedPostData);
            out.flush();

            code = urlConnection.getResponseCode();

            InputStream in = new BufferedInputStream(urlConnection.getInputStream(), 2 * 1024); // specify a buffer size
                                                                                                // to shutup the log
                                                                                                // warning
            DataInputStream dis = new DataInputStream(in);
            result = dis.readLine();
        } catch (MalformedURLException e) {
            Log.e(TAG, "malformed url:" + urlstr + " msg:" + e.getMessage());
        } catch (IOException e) {
            if (!(e instanceof EOFException)) {
                Log.e(TAG,
                        "io exception class:" + e.getClass().getName() + " url:" + urlstr + " msg:" + e.getMessage());
            }
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }

        return new httpRequestSyncResult(code, result);
    }

    private static byte[] gzipCompress(String s) throws IOException {
        ByteArrayOutputStream os = new ByteArrayOutputStream(s.length());
        GZIPOutputStream gos = new GZIPOutputStream(os);
        gos.write(s.getBytes());
        gos.close();
        byte[] compressed = os.toByteArray();
        os.close();
        return compressed;
    }
};
