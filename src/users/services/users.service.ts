import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductsService } from './../../products/services/products.service';
import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
    @Inject('PG') private clientPg: Client,
    @InjectRepository(User) private userRepository: Repository<User>,
    private customersService: CustomersService,
  ) {}

  // private counterId = 1;
  // private users: User[] = [
  //   {
  //     id: 1,
  //     email: 'correo@mail.com',
  //     password: '12345',
  //     role: 'admin',
  //   },
  // ];

  async findAll() {
    // const apiKey = this.configService.get('API_KEY');
    // const dbName = this.configService.get('DATABASE_NAME');
    // console.log(apiKey, dbName);
    // return this.users;

    return this.userRepository.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    // const user = this.users.find((item) => item.id === id);
    // if (!user) {
    //   throw new NotFoundException(`User #${id} not found`);
    // }
    return await this.userRepository.findOne(id);
  }

  async create(data: CreateUserDto) {
    // this.counterId = this.counterId + 1;
    // const newUser = {
    //   id: this.counterId,
    //   ...data,
    // };
    // this.users.push(newUser);
    const newUser = this.userRepository.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;

    if (data.customerId) {
      const customer = await this.customersService.findOne(data.customerId);
      newUser.customer = customer;
    }

    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, changes: UpdateUserDto) {
    // const user = this.findOne(id);
    // const index = this.users.findIndex((item) => item.id === id);
    // this.users[index] = {
    //   ...user,
    //   ...changes,
    // };
    // return this.users[index];

    const user = await this.findOne(id);
    this.userRepository.merge(user, changes);

    return this.userRepository.save(user);
  }

  remove(id: number) {
    // const index = this.users.findIndex((item) => item.id === id);
    // if (index === -1) {
    //   throw new NotFoundException(`User #${id} not found`);
    // }
    // this.users.splice(index, 1);
    // return true;

    return this.userRepository.delete(id);
  }

  async getOrderByUser(id: number) {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      this.clientPg.query('SELECT * FROM tasks', (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res.rows);
      });
    });
  }
}
