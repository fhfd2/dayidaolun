//引入ESP8266.h头文件，建议使用教程中修改后的文件
#include "ESP8266.h"
#include "dht11.h"
#include "SoftwareSerial.h"
#include <SPI.h>  
#include <Wire.h> 

//配置ESP8266WIFI设置
#define SSID "Integration"    //填写2.4GHz的WIFI名称，不要使用校园网
#define PASSWORD "12345678"//填写自己的WIFI密码
#define HOST_NAME "api.heclouds.com"  //API主机名称，连接到OneNET平台，无需修改
#define DEVICE_ID "646304385"       //填写自己的OneNet设备ID
#define HOST_PORT (80)                //API端口，连接到OneNET平台，无需修改
String APIKey = "yZ6=6Kzsi168gc3hgrB90StbbYQ="; //与设备绑定的APIKey

#define INTERVAL_SENSOR 5000 //定义传感器采样及发送时间间隔

//创建dht11示例
dht11 DHT11;

//定义DHT11接入Arduino的管脚
#define DHT11PIN 4

//定义ESP8266所连接的软串口
/*********************
 * 该实验需要使用软串口
 * Arduino上的软串口RX定义为D3,
 * 接ESP8266上的TX口,
 * Arduino上的软串口TX定义为D2,
 * 接ESP8266上的RX口.
 * D3和D2可以自定义,
 * 但接ESP8266时必须恰好相反
 *********************/
SoftwareSerial mySerial(3, 2);
ESP8266 wifi(mySerial);

#include <Arduino.h>
//#include <U8g2lib.h>
#include <Wire.h>
#include <U8glib.h>
#include <utility/u8g.h>
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE);
#define setFont_L u8g.setFont(u8g_font_7x13)


void setup()
{
  mySerial.begin(115200); //初始化软串口
  Serial.begin(9600);     //初始化串口
  Serial.print("setup begin\r\n");

  //以下为ESP8266初始化的代码
  Serial.print("FW Version: ");
  Serial.println(wifi.getVersion().c_str());

  if (wifi.setOprToStation()) {
    Serial.print("to station ok\r\n");
  } else {
    Serial.print("to station err\r\n");
  }

  //ESP8266接入WIFI
  if (wifi.joinAP(SSID, PASSWORD)) {
    Serial.print("Join AP success\r\n");
    Serial.print("IP: ");
    Serial.println(wifi.getLocalIP().c_str());
  } else {
    Serial.print("Join AP failure\r\n");
  }

  Serial.println("");
  Serial.print("DHT11 LIBRARY VERSION: ");
  Serial.println(DHT11LIB_VERSION);

  mySerial.println("AT+UART_CUR=9600,8,1,0,0");
  mySerial.begin(9600);
  Serial.println("setup end\r\n");
}


String GetUVindex(int Value)
{
  float uv;
  if (Value<10) {uv=0;} else
  if (Value>=10 && Value<=46) {uv=0+(Value-10)/36.0;} else
  if (Value>=47 && Value<=65) {uv=1+(Value-47)/18.0;} else
  if (Value>=66 && Value<=83) {uv=2+(Value-66)/17.0;} else
  if (Value>=84 && Value<=103) {uv=3+(Value-84)/19.0;} else
  if (Value>=104 && Value<=124) {uv=4+(Value-104)/20.0;} else
  if (Value>=125 && Value<=142) {uv=5+(Value-125)/17.0;} else
  if (Value>=143 && Value<=162) {uv=6+(Value-143)/19.0;} else
  if (Value>=163 && Value<=180) {uv=7+(Value-163)/17.0;} else
  if (Value>=181 && Value<=200) {uv=8+(Value-181)/19.0;} else
  if (Value>=201 && Value<=221) {uv=9+(Value-201)/20.0;} else
  if (Value>=222 && Value<=240) {uv=10+(Value-222)/18.0;} else
  if (Value>241) {uv=12;}
  char a[]="";
  dtostrf(uv,2,1,a);
  return(a);
}
    

unsigned long net_time1 = millis(); //数据上传服务器时间

void loop(){
  int sValue;
  String ss;
  sValue = analogRead(0)+45;
  ss=GetUVindex(sValue);
    float sensor_hum = (float)DHT11.humidity;
    float sensor_tem = (float)DHT11.temperature;

  u8g.firstPage();  
    do {    
        setFont_L;    
        u8g.setPrintPos(0,10);    
        u8g.print("Temperature:");
        u8g.setPrintPos(86,10);
        u8g.print(sensor_tem);
        u8g.setPrintPos(0,30);
        u8g.print("Humidity:");
        u8g.setPrintPos(64,30);
        u8g.print(sensor_hum); 
        u8g.setPrintPos(0,50);
        u8g.print("UV:");
        u8g.setPrintPos(24,50);
        u8g.print(ss);
        
    }while (u8g.nextPage());


  if (net_time1 > millis())
    net_time1 = millis();

  if (millis() - net_time1 > INTERVAL_SENSOR) //发送数据时间间隔
  {

    int chk = DHT11.read(DHT11PIN);

    Serial.print("Read sensor: ");
    switch (chk) {
      case DHTLIB_OK:
        Serial.println("OK");
        break;
      case DHTLIB_ERROR_CHECKSUM:
        Serial.println("Checksum error");
        break;
      case DHTLIB_ERROR_TIMEOUT:
        Serial.println("Time out error");
        break;
      default:
        Serial.println("Unknown error");
        break;
    }


//    Serial.print("UV(value): ");
//    Serial.println(sValue, 2);
    
    Serial.print("Humidity (%): ");
    Serial.println(sensor_hum, 2);

    Serial.print("Temperature (oC): ");
    Serial.println(sensor_tem, 2);
    Serial.println("");

    if (wifi.createTCP(HOST_NAME, HOST_PORT)) { //建立TCP连接，如果失败，不能发送该数据
      Serial.print("create tcp ok\r\n");
      char buf[10];
      //拼接发送data字段字符串
      String jsonToSend = "{\"Temperature\":";
      dtostrf(sensor_tem, 1, 2, buf);
      jsonToSend += "\"" + String(buf) + "\"";
      jsonToSend += ",\"Humidity\":";
      dtostrf(sensor_hum, 1, 2, buf);
      jsonToSend += "\"" + String(buf) + "\"";
      jsonToSend += "}";

      //拼接POST请求字符串
      String postString = "POST /devices/";
      postString += DEVICE_ID;
      postString += "/datapoints?type=3 HTTP/1.1";
      postString += "\r\n";
      postString += "api-key:";
      postString += APIKey;
      postString += "\r\n";
      postString += "Host:api.heclouds.com\r\n";
      postString += "Connection:close\r\n";
      postString += "Content-Length:";
      postString += jsonToSend.length();
      postString += "\r\n";
      postString += "\r\n";
      postString += jsonToSend;
      postString += "\r\n";
      postString += "\r\n";
      postString += "\r\n";

      const char *postArray = postString.c_str(); //将str转化为char数组

      Serial.println(postArray);
      wifi.send((const uint8_t *)postArray, strlen(postArray)); //send发送命令，参数必须是这两种格式，尤其是(const uint8_t*)
      Serial.println("send success");
      if (wifi.releaseTCP()) { //释放TCP连接
        Serial.print("release tcp ok\r\n");
      } else {
        Serial.print("release tcp err\r\n");
      }
      postArray = NULL; //清空数组，等待下次传输数据
    } else {
      Serial.print("create tcp err\r\n");
    }

    Serial.println("");

    net_time1 = millis();
  }
}
