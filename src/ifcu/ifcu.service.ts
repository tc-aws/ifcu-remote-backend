import { Injectable } from '@nestjs/common';
import { MQTT_CONFIG } from 'src/config/mqtt.config';
import { IFCU_CMD } from './ifcu.enums';
const mqtt = require('mqtt');

export interface SubsTopic {
  topic: string;
  topicDevice: string;
  topicServer: string;
  devicePayload: any;
  lastConnTime?: string;
}

const subsTopics: SubsTopic[] = [
  {
    topic: 'rgt/861096060571706/in',
    topicDevice: 'rgt/861096060571706/device',
    topicServer: 'rgt/861096060571706/server',
    devicePayload: {},
  },
];

const findTopic = () => {};

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
      return subsTopics[-1];
    }

    return null;
  }

  async cmd(imei: string, cmd?: IFCU_CMD) {
    const topic = `rgt/${imei}/in`;
    const idx = subsTopics.findIndex((e) => e.topic === topic);

    if (idx > -1) {
      return subsTopics[-1];
    }

    return null;
  }
}
