package com.trackernotificator;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.CharBuffer;
import java.nio.charset.StandardCharsets;

public class PushModule extends ReactContextBaseJavaModule {
    private static final String CHANNEL_ID = "TracknotePushChannel";
    File save;

    PushModule(ReactApplicationContext context) {
        super(context);

        createNotificationChannel();
        save = new File(this.getReactApplicationContext().getFilesDir(), "TracknoteSaveFile");

        if(!save.exists()) {
            try {
                save.createNewFile();
                FileWriter writer = new FileWriter(save);
                writer.write("[]");
                writer.close();
            } catch(Exception exc) {

            }
        }
    }

    @Override
    public String getName() {
        return "PushModule";
    }

    @ReactMethod
    public void createPush(String text, int ID) {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this.getReactApplicationContext(), CHANNEL_ID)
                .setSmallIcon(R.drawable.notification_icon)
                //.setContentTitle("")
                .setContentText(text)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .extend(
                        new NotificationCompat.WearableExtender()
                                .setBridgeTag("Tag")
                )
                .setLocalOnly(false)
                .setGroupAlertBehavior(NotificationCompat.GROUP_ALERT_ALL)
                .setOngoing(false);
        NotificationManagerCompat.from(this.getReactApplicationContext()).notify(ID, builder.build());
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = this.getReactApplicationContext().getString(R.string.NotificationName);
            String description = "Sends high priority message hookable by your tracker";
            int importance = NotificationManager.IMPORTANCE_HIGH;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
            channel.setDescription(description);
            channel.setBypassDnd(true);
            channel.enableVibration(true);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = this.getReactApplicationContext().getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    // Save Data System

    @ReactMethod()
    public void Save(String jsonData) {
        try {
            FileWriter writer = new FileWriter(save);
             writer.flush();
             writer.write(jsonData);
             writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String Load() {
        try {
            FileInputStream fis = new FileInputStream(save);
            InputStreamReader inputStreamReader =
                    new InputStreamReader(fis, StandardCharsets.UTF_8);
            StringBuilder stringBuilder = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(inputStreamReader)) {
                String line = reader.readLine();
                while (line != null) {
                    stringBuilder.append(line).append('\n');
                    line = reader.readLine();
                }
            } catch (IOException e) {
                // Error occurred when opening raw file for reading.
            } finally {
                return stringBuilder.toString();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "[]";
    }
}