import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MESSAGE } from 'src/config/message.config';
import { MQTT_CONFIG } from 'src/config/mqtt.config';
import { WeatherWarning } from 'src/database/database.entity';
import { Repository } from 'typeorm';
import {
  ACTION_CODE,
  DO_MAPPING,
  SYSTEM_MODE,
  WARNING_CODE,
  WARNING_LEVEL,
} from './ifcu.enums';
import { sleep } from 'src/utils/utils';
const mqtt = require('mqtt');

interface Subscription {
  topic: string;
  devicePayload: any;
  lastConnTime?: string;
}

const subscriptions: Subscription[] = [
  {
    topic: 'rgt/861096060571706/in',
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

      const topics = subscriptions.map((e) => e.topic);

      this.client.subscribe(topics, (err) => {
        if (err) {
          console.error('Subscription error:', err);
          return;
        }
        console.log('Subscribed to topics:', topics);
      });
    });

    this.client.on('message', (topic: string, message: string) => {
      const idx = subscriptions.findIndex((e) => e.topic === topic);
      if (idx > -1) {
        subscriptions[idx].devicePayload = JSON.parse(message.toString());
      }

      console.log(subscriptions);
    });
  }

  async status(imei: string) {}
}
