import { IsNotEmpty, IsString } from 'class-validator';

export class FavouriteProjectDto {
  @IsString()
  @IsNotEmpty()
  project: string;
}
