import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductsService } from './../../products/services/products.service';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
    @Inject('PG') private clientPg: Client,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private counterId = 1;
  private users: User[] = [
    {
      id: 1,
      email: 'correo@mail.com',
      password: '12345',
      role: 'admin',
    },
  ];

  async findAll() {
    // const apiKey = this.configService.get('API_KEY');
    // const dbName = this.configService.get('DATABASE_NAME');
    // console.log(apiKey, dbName);
    // return this.users;

    return this.userRepository.find();
  }

  async findOne(id: number) {
    // const user = this.users.find((item) => item.id === id);
    // if (!user) {
    //   throw new NotFoundException(`User #${id} not found`);
    // }
    return await this.userRepository.findOne();
  }

  async create(data: CreateUserDto) {
    // this.counterId = this.counterId + 1;
    // const newUser = {
    //   id: this.counterId,
    //   ...data,
    // };
    // this.users.push(newUser);
    const newUser = this.userRepository.create(data);

    return this.userRepository.save(newUser);
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
