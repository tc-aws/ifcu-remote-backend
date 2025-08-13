import { Controller, Post, Req } from '@nestjs/common';
import { IFCUService } from './ifcu.service';
import { IFCU_CMD } from './ifcu.enums';

@Controller('ifcu-remote')
export class IFCUController {
  constructor(private readonly iFCUService: IFCUService) {}

  @Post('status')
  async status(@Req() req) {
    const { imei } = req.body;
    return await this.iFCUService.status(imei);
  }

  @Post('on')
  async on(@Req() req) {
    const { imei } = req.body;
    return await this.iFCUService.cmd(imei, IFCU_CMD.IFCU_ON);
  }

  @Post('off')
  async off(@Req() req) {
    const { imei } = req.body;
    return await this.iFCUService.cmd(imei, IFCU_CMD.IFCU_OFF);
  }

  @Post('mode')
  async mode(@Req() req) {
    const { imei, mode } = req.body;
    return await [
      this.iFCUService.cmd(imei, IFCU_CMD.IFCU_MODE_AUTO_COOL),
      this.iFCUService.cmd(imei, IFCU_CMD.IFCU_MODE_MANUAL_COOL),
      this.iFCUService.cmd(imei, IFCU_CMD.IFCU_MODE_FAN_ONLY),
    ][mode];
  }

  @Post('fan-speed')
  async fanSpeed(@Req() req) {
    const { imei, speed } = req.body;
    return await [
      this.iFCUService.cmd(imei, IFCU_CMD.IFCU_FAN_SPEED_LOW),
      this.iFCUService.cmd(imei, IFCU_CMD.IFCU_FAN_SPEED_MEDIUM),
      this.iFCUService.cmd(imei, IFCU_CMD.IFCU_FAN_SPEED_HIGH),
    ][speed];
  }

  @Post('set-temp')
  async setTemp(@Req() req) {
    const { imei, action } = req.body;
    return await [
      this.iFCUService.cmd(imei, IFCU_CMD.IFCU_ACTION_INCREASE_TEMP),
      this.iFCUService.cmd(imei, IFCU_CMD.IFCU_ACTION_DECREASE_TEMP),
    ][action];
  }
}
