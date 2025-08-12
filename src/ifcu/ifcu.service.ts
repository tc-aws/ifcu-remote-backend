import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
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

@Injectable()
export class IFCUService implements OnModuleInit {
  client: any;
  systemMode: SYSTEM_MODE;

  constructor(
    @InjectRepository(WeatherWarning)
    private weatherWarningRepository: Repository<WeatherWarning>,
  ) {
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
    });
  }

  async onModuleInit() {
    await this.setMode(SYSTEM_MODE.AUTO);
    await this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    await this.weatherWarningRepository.query(
      'DROP TABLE IF EXISTS weather_warning;',
    );

    await this.weatherWarningRepository.query(
      'CREATE TABLE weather_warning (code TEXT PRIMARY KEY, isActive BOOL);',
    );

    await Promise.all(
      Object.values(WARNING_CODE).map(async (code) => {
        const newRecord = this.weatherWarningRepository.create({
          code,
          isActive: false,
        });
        await this.weatherWarningRepository.save(newRecord);
      }),
    );

    await this.weatherWarningRepository
      .createQueryBuilder()
      .update(WeatherWarning)
      .set({ isActive: true })
      .where('code IN (:...codes)', {
        codes: [
          WARNING_CODE.HSWW_CANCEL_INDOOR,
          WARNING_CODE.HSWW_CANCEL_OUTDOOR,
        ],
      })
      .execute();
  }

  async updateWarningDB(warningCode: WARNING_CODE) {
    try {
      await Promise.all(
        Object.values(WARNING_CODE).map(async (code) => {
          await this.weatherWarningRepository
            .createQueryBuilder()
            .update(WeatherWarning)
            .set({ isActive: warningCode === code })
            .where('code = :code', { code })
            .execute();
        }),
      );
    } catch (error) {
      throw new BadRequestException(
        MESSAGE.ERRORS.SYSTEM.FAIL_TO_UPDATE_DATABASE,
      );
    }
  }

  async getWarningCodeFromDB() {
    const weatherWarning = await this.weatherWarningRepository.findOne({
      where: { isActive: true },
    });
    return weatherWarning.code as WARNING_CODE;
  }

  async getMode() {
    return { mode: this.systemMode };
  }

  async setMode(mode: SYSTEM_MODE) {
    console.log(`Mode changed from [${this.systemMode}] to [${mode}]`);
    this.systemMode = mode;
    return { mode: this.systemMode };
  }

  async autoMode(data: any) {
    if (this.systemMode === SYSTEM_MODE.AUTO) {
      if (!data?.hsww) {
        this.switchTo(WARNING_CODE.HSWW_CANCEL_OUTDOOR);
      } else {
        const warningLevel = data?.hsww?.warningLevel;
        const actionCode = data?.hsww?.actionCode;

        if (actionCode !== ACTION_CODE.ISSUE) {
          this.switchTo(WARNING_CODE.HSWW_CANCEL_OUTDOOR);
        } else {
          if (warningLevel === WARNING_LEVEL.AMBER) {
            this.switchTo(WARNING_CODE.HSWW_AMBER_OUTDOOR);
          } else if (warningLevel === WARNING_LEVEL.RED) {
            this.switchTo(WARNING_CODE.HSWW_RED_OUTDOOR);
          } else if (warningLevel === WARNING_LEVEL.BLACK) {
            this.switchTo(WARNING_CODE.HSWW_BLACK_OUTDOOR);
          } else {
            this.switchTo(WARNING_CODE.HSWW_CANCEL_OUTDOOR);
          }
        }
      }
    }
  }

  async manualMode(warningCode: WARNING_CODE) {
    if (this.systemMode === SYSTEM_MODE.MANUAL) {
      await this.switchTo(warningCode);
      await this.systemPublish(true);
    }
  }

  async switchTo(warningCode: WARNING_CODE) {
    console.log(`[CURRENT WARNING CODE] ${warningCode}`);
    await this.updateWarningDB(warningCode);
  }

  async systemPublish(force?: boolean) {
    try {
      const warningCode = await this.getWarningCodeFromDB();
      const msg = `${force ? 'DFO' : 'DO'}:${DO_MAPPING[warningCode]}`;
      await this.client.publish(MQTT_CONFIG.RGT_OUT_TOPIC, msg, { qos:0 });

      console.log(`[${this.systemMode} Publish] ${warningCode}`);
    } catch (error) {
      throw new BadRequestException(
        MESSAGE.ERRORS.SYSTEM.FAIL_TO_PUBLISH_MESSAGE,
      );
    }
  }
}
