#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const char* ssid     = "ASUS56";
const char* password = "4131918911";

const char* host = "cnc.noip.me";
int httpPort = 4000;
int sendInteval = 2000;
String macStr = "";

static ETSTimer sleep_timer;
int deepSleepTime = 30 * 1000 * 1000;  // 30s

#define ONE_WIRE_BUS 2
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

String getMacString() {
  uint8_t mac[6];
  char macBuffer[18] = {0};
  WiFi.macAddress(mac);

  sprintf(macBuffer, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  return String(macBuffer);
}

void setup() {
  Serial.begin(115200);
  delay(10);

  Serial.println();
  Serial.println();
  Serial.print("Initializing sensors");
  sensors.begin();

  // We start by connecting to a WiFi network

  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  macStr = getMacString();
  Serial.println("MAC address: ");
  Serial.println(macStr);
}

void loop() {
  Serial.print("reading sensors");
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);

  // convert temp to string
  const int width = 4;
  const int prec = 2;
  char tempBuffer[width * 2] = {0};
  dtostrf(temp, width, prec, tempBuffer);
  

  Serial.print("connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }
  
  // We now create a URI for the request
  String url = "/api/write";
  url += "?mac=";
  url += macStr;
  url += "&temp=";
  url += tempBuffer;
  
  Serial.print("Requesting URL: ");
  Serial.println(url);
  
  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  delay(10);
  
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  
  Serial.println();
  Serial.println("closing connection");
  
  ESP.deepSleep(deepSleepTime, WAKE_RF_DEFAULT);
}

