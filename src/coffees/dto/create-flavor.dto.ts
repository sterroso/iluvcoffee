import { IsString } from 'class-validator';

export class CreateFlavorDto {
  @IsString()
  name: string;
}
