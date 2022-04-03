import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}
  // private counterId = 1;
  // private customers: Customer[] = [
  //   {
  //     id: 1,
  //     name: 'Nicolas',
  //     lastName: 'Molina',
  //     phone: '3111111212',
  //   },
  // ];

  async findAll() {
    return await this.customerRepository.find();
    // return this.customers;
  }

  async findOne(id: number) {
    // const customer = this.customers.find((item) => item.id === id);
    // if (!customer) {
    //   throw new NotFoundException(`Customer #${id} not found`);
    // }
    // return customer;

    const customer = await this.customerRepository.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }

    return customer;
  }

  async create(data: CreateCustomerDto) {
    // this.counterId = this.counterId + 1;
    // const newCustomer = {
    //   id: this.counterId,
    //   ...data,
    // };
    // this.customers.push(newCustomer);
    // return newCustomer;

    const newCustomer = await this.customerRepository.create(data);
    return this.customerRepository.save(newCustomer);
  }

  async update(id: number, changes: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne(id);
    this.customerRepository.merge(customer, changes);

    return this.customerRepository.save(customer);
    // const index = this.customers.findIndex((item) => item.id === id);
    // this.customers[index] = {
    //   ...customer,
    //   ...changes,
    // };
    // return this.customers[index];
  }

  async remove(id: number) {
    // const index = this.customers.findIndex((item) => item.id === id);
    // if (index === -1) {
    //   throw new NotFoundException(`Customer #${id} not found`);
    // }
    // this.customers.splice(index, 1);
    // return true;

    return await this.customerRepository.delete(id);
  }
}
