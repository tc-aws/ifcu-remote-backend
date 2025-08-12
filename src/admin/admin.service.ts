import { Injectable } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AdminService {
  constructor(private readonly utilsService: UtilsService) {}
}
