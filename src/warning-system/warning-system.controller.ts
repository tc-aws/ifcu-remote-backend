import { Controller, Post, Req } from '@nestjs/common';
import { WarningSystemService } from './warning-system.service';

@Controller('warning-system')
export class WarningSystemController {
  constructor(private readonly warningSystemService: WarningSystemService) {}

  @Post('get-mode')
  async getMode() {
    return await this.warningSystemService.getMode();
  }

  @Post('change-mode')
  async changeMode(@Req() req) {
    const { mode } = req.body;
    return await this.warningSystemService.setMode(mode);
  }

  @Post('manual-publish')
  async manualPublish(@Req() req) {
    const { warningCode } = req.body;
    return await this.warningSystemService.manualMode(warningCode);
  }
}
