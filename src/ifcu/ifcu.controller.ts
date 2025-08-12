import { Controller, Post, Req } from '@nestjs/common';
import { IFCUService } from './ifcu.service';

@Controller('ifcu-remote')
export class IFCUController {
  constructor(private readonly iFCUService: IFCUService) {}

  @Post('status')
  async status() {
    // return await this.iFCUService.status();
  }

  @Post('on')
  async on() {
    // return await this.iFCUService.getMode();
  }

  @Post('off')
  async off() {
    // return await this.iFCUService.getMode();
  }

  @Post('mode')
  async mode() {
    // return await this.iFCUService.getMode();
  }

  @Post('fan-speed')
  async fanSpeed() {
    // return await this.iFCUService.getMode();
  }

  @Post('set-point-temp')
  async setPointTemp() {
    // return await this.iFCUService.getMode();
  }
}
