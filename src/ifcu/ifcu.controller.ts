import { Controller, Post, Req } from '@nestjs/common';
import { IFCUService } from './ifcu.service';

@Controller('ifcu-remote')
export class IFCUController {
  constructor(private readonly IFCUService: IFCUService) {}

  @Post('get-mode')
  async getMode() {
    return await this.IFCUService.getMode();
  }

  @Post('change-mode')
  async changeMode(@Req() req) {
    const { mode } = req.body;
    return await this.IFCUService.setMode(mode);
  }

  @Post('manual-publish')
  async manualPublish(@Req() req) {
    const { warningCode } = req.body;
    return await this.IFCUService.manualMode(warningCode);
  }
}
