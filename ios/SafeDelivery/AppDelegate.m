/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.

 */

#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTRootView.h>
#import <RNFSManager.h>
#import "Orientation.h"
#import <RNCPushNotificationIOS.h>
#include "send_analytics.h"
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [[RCTI18nUtil sharedInstance] allowRTL:YES];

  NSFileManager* fm = [NSFileManager defaultManager];
  NSURL *url = [[fm URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];

  NSString* ns_path = [url path];
  NSLog(@"Data files path: %@", ns_path);

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"SafeDelivery"
                                            initialProperties:nil];

   self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
   UIViewController *rootViewController = [UIViewController new];
   rootViewController.view = rootView;
   self.window.rootViewController = rootViewController;
   [self.window makeKeyAndVisible];

  // *** added by Finn
  [[UIApplication sharedApplication] setMinimumBackgroundFetchInterval: 60 * 60]; // one hour seems to work best

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)())completionHandler
{
  [RNFSManager setCompletionHandlerForIdentifier:identifier completionHandler:completionHandler];
}

const int analyticsMinSendInterval = 30; // 30 sec

#ifdef DEBUG
const char* analyticsSendUrl = "http://127.0.0.1:9000/api/public/events";
#else
const char* analyticsSendUrl = "https://sda.maternity.dk/api/public/events";
#endif

#ifdef DEBUG
const char* profilesSendUrl = "http://127.0.0.1:9000/api/public/profiles";
#else
const char* profilesSendUrl = "https://sda.maternity.dk/api/public/profiles";
#endif

// *** added by Finn
-(void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  printf("performFetchWithCompletionHandler\n");

  NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
  long last_ts = [userDefaults integerForKey:@"lastAnalyticsSendTime"];
  unsigned long t = time(0);

  if(t - last_ts > analyticsMinSendInterval) {
    sendAnalytics(analyticsSendUrl);
    sendProfiles(profilesSendUrl);

    last_ts = (long)t;
    [userDefaults setInteger:last_ts forKey:@"lastAnalyticsSendTime"];
    [userDefaults synchronize];
  }
  else {
    printf("postponing analytics send, time since last = %lu\n", t - last_ts);
  }

  printf("done performFetchWithCompletionHandler\n");
  completionHandler(UIBackgroundFetchResultNewData);
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

// Linking
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:app openURL:url options:options];
}

@end
