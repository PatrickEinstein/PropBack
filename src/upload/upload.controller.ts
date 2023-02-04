import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/role.guard';
import { GetFileAccessUrlDto } from './dto/get-file-access-url.dto';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Get()
  getUploadUrl(@Query() dto: GetUploadUrlDto) {
    return this.uploadService.getS3UploadUrl(dto);
  }

  @Get('access')
  @UseGuards(RoleGuard('admin'))
  @UseGuards(JwtGuard)
  getFileAccessUrl(@Query() query: GetFileAccessUrlDto) {
    return this.uploadService.getS3FileAccessUrl(query);
  }
}
