import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(
    private orderService: OrderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async getOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  async createOrder(@Body() data: CreateOrderDTO) {
    const callback = async () => await this.orderService.createOrder(data);

    const response = await this.applyRetry(callback);

    await this.cacheManager.del('/orders');

    return response;
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() data: UpdateOrderDTO) {
    const callback = async () => await this.orderService.updateOrder(id, data);

    const response = await this.applyRetry(callback);

    await this.cacheManager.del('/orders');

    return response;
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    const callback = async () => this.orderService.deleteOrder(id);

    const response = await this.applyRetry(callback);

    await this.cacheManager.del('/orders');

    return response;
  }

  async applyRetry(callback: any, maxAttempts = 3) {
    let attempts = 0;
    let delayms = 500;
    while (attempts <= maxAttempts) {
      try {
        return await callback();
      } catch (err) {
        attempts += 1;
        delayms *= 2;
        if (attempts > maxAttempts) {
          throw err;
        }
        const message = '👉 Attempting Retry... 💖 ' + attempts;
        Logger.log(message);
        await new Promise((resolve) => setTimeout(resolve, delayms));
      }
    }
  }
}
