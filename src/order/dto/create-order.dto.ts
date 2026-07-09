import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { IItem } from '../types/Order';
import { Type } from 'class-transformer';

export class ItemsDto implements IItem {
  @IsNumber()
  declare item_id: number;
  @IsString()
  declare item_name: string;
  @IsNumber()
  declare item_quantity: number;
  @IsNumber()
  declare item_unit_price: number;
}

export class CreateOrderDTO {
  @IsString()
  declare user_name: string;

  @IsArray()
  @IsObject({ each: true })
  @Type(() => ItemsDto)
  declare items: IItem[];
}
