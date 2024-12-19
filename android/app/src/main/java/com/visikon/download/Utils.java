package com.visikon.download;

import android.util.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class Utils {
    public static void saveFile(InputStream input, String path, String fileName) throws FileNotFoundException, IOException {
        try {
            File file = new File(path, fileName);

            // Create parent folder
            File parentFolder = new File(file.getParent());
            if (!parentFolder.exists() && !parentFolder.mkdirs()) {
                throw new IOException("Couldn't create parent directory..");
            }

            OutputStream output = new FileOutputStream(file);
            try {
                byte[] buffer = new byte[4 * 1024]; // or other buffer size
                int read;

                while ((read = input.read(buffer)) != -1) {
                    output.write(buffer, 0, read);
                }

                output.flush();
            } finally {
                output.close();
            }
        } finally {
            try {
                input.close();
            } catch (IOException e) {
                Log.e("Utils.saveFile", "Couldn't close the input");
            }
        }
    }
}
