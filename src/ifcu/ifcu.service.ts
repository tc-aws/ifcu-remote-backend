import { Injectable } from '@nestjs/common';
import { MQTT_CONFIG } from 'src/config/mqtt.config';
import { IFCU_CMD } from './ifcu.enums';
const mqtt = require('mqtt');

export interface SubsTopic {
  topic: string;
  topicToDevice: string;
  topicToServer: string;
  devicePayload: any;
  lastConnTime?: string;
}

const subsTopics: SubsTopic[] = [
  {
    topic: 'rgt/861096060571706/in',
    topicToDevice: 'rgt/861096060571706/out',
    topicToServer: 'rgt/861096060571706/in',
    devicePayload: {},
  },
];

@Injectable()
export class IFCUService {
  client: any;

  constructor() {
    this.client = mqtt.connect(MQTT_CONFIG.CONNECTURL, {
      clientId: MQTT_CONFIG.CLIENTID,
      username: MQTT_CONFIG.USERNAME,
      password: MQTT_CONFIG.PASSWORD,
      reconnectPeriod: 60 * 60 * 1000,
      connectTimeout: 60 * 60 * 1000,
      clean: false,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');

      const topics = subsTopics.map((e) => e.topic);

      this.client.subscribe(topics, (err) => {
        if (err) {
          console.error('SubsTopic error:', err);
          return;
        }
        console.log('Subscribed to topics:', topics);
      });
    });

    this.client.on('message', (topic: string, message: string) => {
      const idx = subsTopics.findIndex((e) => e.topic === topic);
      if (idx > -1) {
        subsTopics[idx].devicePayload = JSON.parse(message.toString());
      }

      console.log(subsTopics);
    });
  }

  async handlePublish() {}

  async status(imei: string) {
    const topic = `rgt/${imei}/in`;
    const idx = subsTopics.findIndex((e) => e.topic === topic);

    if (idx > -1) {
      return subsTopics[idx];
    }

    return null;
  }

  async cmd(imei: string, cmd: IFCU_CMD) {
    const topic = `rgt/${imei}/in`;
    const idx = subsTopics.findIndex((e) => e.topic === topic);

    if (idx > -1) {
      const subs = subsTopics[idx];
      const cmdIdx = Object.keys(IFCU_CMD).findIndex((k) => k === cmd);
      const msg = `[${cmdIdx}]`;
      if (cmdIdx > -1) {
        this.client.publish(
          subs.topicToDevice,
          msg,
          {
            qos: 2,
          },
          (err) => {
            if (err) {
              console.error('Failed to publish message:', err);
            } else {
              console.log(`Message "${msg}" published to topic "${topic}"`);
            }
          },
        );
      }
    }

    return null;
  }
}
