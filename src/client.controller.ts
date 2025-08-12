import { Controller, Get, Req, Res } from '@nestjs/common';
import { ReactAppService } from './client.service';

@Controller()
export class ReactAppController {
  constructor(private readonly reactAppService: ReactAppService) {}

  @Get('*')
  async serveSpa(@Req() req, @Res() res) {
    this.reactAppService.serveSpa(req, res);
  }
}
