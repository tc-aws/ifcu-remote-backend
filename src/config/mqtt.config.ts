const IMEI = '861096060571706';
const RGT_IN_TOPIC = `rgt/${IMEI}/in`;
// const RGT_OUT_TOPIC = `rgt/${IMEI}/out`;
const RGT_OUT_TOPIC = `rgt/HSWW_TOPIC/out`;

const RGT_HSWW_NOTIFICATION_TOPIC = `rgt/HSWW_NOTIFICATION/in`;

const PROTOCOL = 'mqtt';
const HOST = 'iot.rec-gt.com';
const PORT = '1880';
const USERNAME = 'tswh';
const PASSWORD = '1Wo=[6vA0m';
const CLIENTID = `dev_publisher_${Math.floor(Math.random() * 100)}`;
const CONNECTURL = `${PROTOCOL}://${HOST}:${PORT}`;

export const MQTT_CONFIG = {
  IMEI,
  RGT_IN_TOPIC,
  RGT_OUT_TOPIC,
  RGT_HSWW_NOTIFICATION_TOPIC,

  PROTOCOL,
  HOST,
  PORT,
  USERNAME,
  PASSWORD,
  CLIENTID,
  CONNECTURL,
};
