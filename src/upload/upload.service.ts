import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';
import { S3 } from 'aws-sdk';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { GetFileAccessUrlDto } from './dto/get-file-access-url.dto';

@Injectable()
export class UploadService {
  private s3: S3;
  constructor(private config: ConfigService) {
    this.s3 = new S3({
      signatureVersion: 'v4',
      region: 'us-east-1',
      accessKeyId: config.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async getS3UploadUrl(body: GetUploadUrlDto) {
    const { fileType, access } = body;

    const day = moment().format('YYYY-MM-DD');
    const key = `${day}/${uuid()}.${fileType}`;

    const url = await this.s3.getSignedUrlPromise('putObject', {
      Key: key,
      Bucket: this.config.getOrThrow('AWS_S3_BUCKET'),
      ACL: access === 'private' ? 'private' : 'public-read',
    });

    return {
      message: 'Upload url generated successfully',
      data: {
        key,
        url,
      },
    };
  }

  async getS3FileAccessUrl(body: GetFileAccessUrlDto) {
    const { key } = body;
    const url = await this.s3.getSignedUrlPromise('getObject', {
      Key: key,
      Bucket: this.config.getOrThrow('AWS_S3_BUCKET'),
    });

    return {
      message: 'File acess url generated successfully',
      url,
    };
  }
}
