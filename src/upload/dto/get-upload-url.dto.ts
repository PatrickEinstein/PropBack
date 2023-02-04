import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GetUploadUrlDto {
  @IsString()
  @IsIn(['private', 'public'])
  @IsNotEmpty()
  access: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;
}
