import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { IItem } from '../types/Order';


@Table({ tableName: 'orders', timestamps: true })
export class Order extends Model<Order> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare order_id: string;

  @Column(DataType.STRING)
  declare user_name: string;

  @Column(DataType.ARRAY(DataType.JSONB))
  declare items: IItem[];

  @Column(DataType.DOUBLE)
  declare total: number;

  @Column(DataType.DATE)
  declare delivery_date: Date;
}
