//
//  send_analytics.m
//  reactnative
//
//  Created by Finn Nielsen on 23/03/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#include "GZIP/GZIP.h"
#include <stdio.h>

static void getDataFilePath(const char* fn, char* path) {
  NSFileManager* fm = [NSFileManager defaultManager];
  NSURL *url = [[fm URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
  
  NSString* ns_fn = [NSString stringWithUTF8String: fn];
  url = [url URLByAppendingPathComponent:ns_fn];
  
  NSString* ns_path = [url path];
  strcpy(path, [ns_path UTF8String]);
}

static void deleteFile(const char* path) {
  NSFileManager* fm = [NSFileManager defaultManager];
  NSString* ns_path = [NSString stringWithUTF8String: path];
  NSError* error;
  [fm removeItemAtPath: ns_path error: &error];
}

int sendAnalytics(const char* url) {
  // read the gathered analytics data from /analytics.json
  
  long current_time_ms = (long)([[NSDate date] timeIntervalSince1970] * 1000);
  
  char path[1024];
  getDataFilePath("analytics.json", path);
  
  FILE* f = fopen(path, "r");
  if(!f)
    return 0; // only send if there is (new) data to send
  
  fseek(f, 0, SEEK_END);
  long sz = ftell(f);
  fseek(f, 0, SEEK_SET);
  
  if(sz <= 2) {
    // only send if there is (new) data to send
    fclose(f);
    return 0;
  }
  
  char* analytics_data = (char*)malloc(sz + 1);
  fread(analytics_data, sz, 1, f);
  analytics_data[sz] = 0;
  fclose(f);
  
  printf("sending analytics data:\n%s\n", analytics_data);
  
  // try to send via HTTP post
  NSString *post = [NSString stringWithUTF8String:analytics_data];
  
  // add sentTs fields = device clock at time of sending
  NSString* ts = @"{\"ts\":";
  NSString* sent_ts = [NSString stringWithFormat: @"{\"sentTs\":%ld,\"ts\":", current_time_ms];
  NSString *post_with_sent_ts = [post stringByReplacingOccurrencesOfString: ts withString: sent_ts];

  printf("sending analytics data:\n%s\n", [post_with_sent_ts UTF8String]);
  
  
  NSData *postData = [post_with_sent_ts dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
  
  
  // gzip data
  NSData *gzippedPostData = [postData gzippedData];
  
  //NSString *postLength = [NSString stringWithFormat:@"%d",[postData length]];
  NSString *postLength = [NSString stringWithFormat:@"%d",[gzippedPostData length]];
  
  printf("contentlength=%s", [postLength UTF8String]);
  
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
  
  [request setURL:[NSURL URLWithString:[NSString stringWithUTF8String:url]]];
  //[request setURL:[NSURL URLWithString:@"http://127.0.0.1:8081/testPost2"]];
  [request setHTTPMethod:@"POST"];
  [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [request setValue:@"gzip" forHTTPHeaderField:@"Content-Encoding"];
  
  //[request setHTTPBody:postData];
  [request setHTTPBody:gzippedPostData];
  
  
  
  
  NSURLSession* session = [NSURLSession sharedSession];
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  __block const char* result_error = 0;
  __block int result_status_code = 0;
  __block const char* result_data = 0;
  __block int result_length = 0;
  
  NSURLSessionDataTask* data_task = [session dataTaskWithRequest:request
                                               completionHandler:^(NSData *data,
                                                                   NSURLResponse *response,
                                                                   NSError *error) {
                                                 if(error) {
                                                   printf("postHttp error\n");
                                                   result_error = [[error localizedDescription] UTF8String];
                                                 }
                                                 else {
                                                   printf("postHttp complete\n");
                                                   
                                                   NSHTTPURLResponse* http_response = (NSHTTPURLResponse*)response;
                                                   result_status_code = [http_response statusCode];
                                                   result_data =  (const char*)[data bytes];
                                                   result_length = [data length];
                                                 }
                                                 
                                                 dispatch_semaphore_signal(semaphore);
                                               }
                                     ];
  
  [data_task resume];
  
  printf("wait semaphore\n");
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  printf("done waiting semaphore\n");
 
  
  free(analytics_data);
  
  if(result_error) {
    printf("result_error: %s", result_error);
    return -1;
  }
  
  if(result_status_code == 200) {
    // data was received, so we can safely delete it locally
    deleteFile(path);
  }
  else if(result_status_code == 400) {
    // data was rejected, so no point in trying to send it again
    deleteFile(path);
  }
  
  printf("response code: %d", result_status_code);
  
  return result_status_code;
}

const char* getProfileUrl(const char* defaultUrl) {
  // Read profile data
  char path[1024];
  getDataFilePath("profile_endpoint.txt", path);

  FILE* f = fopen(path, "r");
  if(!f)
    return defaultUrl; // only send if there is (new) data to send

  fseek(f, 0, SEEK_END);
  long sz = ftell(f);
  fseek(f, 0, SEEK_SET);

  if(sz <= 2) {
    // only send if there is (new) data to send
    fclose(f);
    return defaultUrl;
  }

  char* profile_endpoint = (char*)malloc(sz + 1);
  fread(profile_endpoint, sz, 1, f);
  profile_endpoint[sz] = 0;
  fclose(f);

  char result[1024];
  strcpy(result, profile_endpoint);
  strcat(result, "/api/public/profiles");
  free(profile_endpoint);

  printf("sending profile to endpoint:\n%s\n", result);
  return result;
}

int sendProfiles(const char* url) {
  // Read profile data
  char path[1024];
  getDataFilePath("profiles.json", path);
  
  FILE* f = fopen(path, "r");
  if(!f)
    return 0; // only send if there is (new) data to send
  
  fseek(f, 0, SEEK_END);
  long sz = ftell(f);
  fseek(f, 0, SEEK_SET);
  
  if(sz <= 2) {
    // only send if there is (new) data to send
    fclose(f);
    return 0;
  }
  
  char* profile_data = (char*)malloc(sz + 1);
  fread(profile_data, sz, 1, f);
  profile_data[sz] = 0;
  fclose(f);
  
  printf("sending profile data data:\n%s\n", profile_data);

  const char* url2 = getProfileUrl(url);
  
  // try to send via HTTP post
  NSString *post = [NSString stringWithUTF8String:profile_data];
  NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
  
  
  // gzip data
  NSData *gzippedPostData = [postData gzippedData];
  
  //NSString *postLength = [NSString stringWithFormat:@"%d",[postData length]];
  NSString *postLength = [NSString stringWithFormat:@"%d",[gzippedPostData length]];
  
  printf("contentlength=%s", [postLength UTF8String]);
  
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
  
  [request setURL:[NSURL URLWithString:[NSString stringWithUTF8String:url2]]];
  //[request setURL:[NSURL URLWithString:@"http://127.0.0.1:8081/testPost2"]];
  [request setHTTPMethod:@"POST"];
  [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [request setValue:@"gzip" forHTTPHeaderField:@"Content-Encoding"];
  
  //[request setHTTPBody:postData];
  [request setHTTPBody:gzippedPostData];
  
  
  
  
  NSURLSession* session = [NSURLSession sharedSession];
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
  __block const char* result_error = 0;
  __block int result_status_code = 0;
  __block const char* result_data = 0;
  __block int result_length = 0;
  
  NSURLSessionDataTask* data_task = [session dataTaskWithRequest:request
                                               completionHandler:^(NSData *data,
                                                                   NSURLResponse *response,
                                                                   NSError *error) {
                                                 if(error) {
                                                   printf("postHttp error\n");
                                                   result_error = [[error localizedDescription] UTF8String];
                                                 }
                                                 else {
                                                   printf("postHttp complete\n");
                                                   
                                                   NSHTTPURLResponse* http_response = (NSHTTPURLResponse*)response;
                                                   result_status_code = [http_response statusCode];
                                                   result_data =  (const char*)[data bytes];
                                                   result_length = [data length];
                                                 }
                                                 
                                                 dispatch_semaphore_signal(semaphore);
                                               }
                                     ];
  
  [data_task resume];
  
  printf("wait semaphore\n");
  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
  printf("done waiting semaphore\n");
  
  
  free(profile_data);
  
  if(result_error) {
    printf("result_error: %s", result_error);
    return -1;
  }
  
  printf("response code: %d", result_status_code);
  
  if(result_status_code == 200 && result_length >= 2) {
    char path[1024];
    getDataFilePath("profiles_updated.json", path);

    FILE* f = fopen(path, "w");
    fwrite(result_data, result_length, 1, f);
    fclose(f);
  }
  
  return result_status_code;
}
