import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Order } from './models/order.model';
import { IItem } from './types/Order';
import { UpdateOrderDTO } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
  ) {}

  async findAll() {
    const response = await this.orderModel.findAll();

    if (!response) {
      throw new NotFoundException('Invalid Request');
    }

    return response;
  }

  async findOne(id: string) {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    return order;
  }

  async deleteOrder(id: string) {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      throw new NotFoundException('Order Not Found');
    }

    return await order.destroy();
  }

  async createOrder(data: CreateOrderDTO) {
    const { items, user_name } = data;
    const total = this.calculateTotal(items);
    const delivery_date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2days

    const response = await this.orderModel.create({
      user_name,
      items,
      total,
      delivery_date,
    } as Order);

    return response;
  }

  async updateOrder(id: string, data: UpdateOrderDTO) {
    const order = await this.orderModel.findByPk(id);
    if (!order) {
      throw new NotFoundException('Invalid Order');
    }

    return await order.update(data);
  }

  calculateTotal(items: IItem[]) {
    const total = items.reduce((sum, item) => {
      const { item_quantity, item_unit_price } = item;
      return (sum += item_quantity * item_unit_price);
    }, 0);

    return total;
  }
}
