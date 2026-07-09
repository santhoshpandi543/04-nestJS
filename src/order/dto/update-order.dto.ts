import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { IItem } from '../types/Order';
import { ItemsDto } from './create-order.dto';

export class UpdateOrderDTO {
  @IsOptional()
  @IsString()
  declare user_name: string;

  @IsOptional()
  @IsDate()
  @Type(()=>Date)
  declare delivery_date: Date;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @Type(() => ItemsDto)
  declare items: IItem[];
}
