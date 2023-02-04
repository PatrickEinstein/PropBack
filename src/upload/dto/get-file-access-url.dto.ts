import { IsNotEmpty, IsString } from 'class-validator';

export class GetFileAccessUrlDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
