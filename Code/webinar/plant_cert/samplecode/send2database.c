#include <aws_iot_mqtt.h>
#include <aws_iot_version.h>
#include "aws_iot_config.h"
#include <math.h> //Added for temperature calculations
#include <time.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
char data[80];
StaticJsonBuffer<200> jsonBuffer;
int main()
{
  while(true)
  {
srand(time(NULL));
int r=rand();
aws_iot_mqtt_client myClient; // init iot_mqtt_client
bool success_connect = false; // whether it is connected
 int temp;
 temp=r%55;

 printf("temp = %d",temp);                       
 String temp1 = "\"temp\": " + String(temp) ;
 String value = temp1;
 printf(value);
 String payload = "{" + value + "}";
 payload.toCharArray(data, (payload.length() + 1));
  
//Publish data to AWS IoT using  topic/plantdata,which in turn will fire the AWS IoT rule to write sensor data to Dynamo DB
   if(success_connect) {
    // Generate a new message in each loop and publish to "topic/plantdata" 

    if((rc = myClient.publish("topic/plantdata", data, strlen(data), 1, false)) != 0) {
      printf("Publish failed!");
      
    }
  
    // Get a chance to run a callback
    if((rc = myClient.yield()) != 0) {
      printf("Yield failed!");
      
    }
    delay(10000);
  }

 // }//end if checking for time interval to post 
  delay(5000);
}
}