import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dtos/order.dto';

import { Order } from './../entities/order.entity';
import { Customer } from './../entities/customer.entity';
import { UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne(id, {
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Not found');
    }

    return order;
  }

  async create(data: CreateOrderDto) {
    const newOrder = new Order();
    if (data.customerId) {
      const customer = await this.customerRepository.findOne(data.customerId);
      newOrder.customer = customer;
    }

    return await this.orderRepository.save(newOrder);
  }

  async update(id: number, changes: UpdateUserDto) {
    const order = await this.orderRepository.findOne(id);
    if (changes.customerId) {
      const customer = await this.customerRepository.findOne(
        changes.customerId,
      );
      order.customer = customer;
    }

    return await this.orderRepository.save(order);
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }

  async ordersByCustomer(customerId: number) {
    return this.orderRepository.find({
      where: {
        customer: customerId,
      },
    });
  }
}
