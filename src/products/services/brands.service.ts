import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}
  // private counterId = 1;
  // private brands: Brand[] = [
  //   {
  //     id: 1,
  //     name: 'Brand 1',
  //     image: 'https://i.imgur.com/U4iGx1j.jpeg',
  //   },
  // ];

  async findAll() {
    // return this.brands;
    return await this.brandRepository.find();
  }

  async findOne(id: number) {
    // const product = this.brands.find((item) => item.id === id);
    const product = await this.brandRepository.findOne(id, {
      relations: ['products'],
    });

    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  async create(data: CreateBrandDto) {
    // this.counterId = this.counterId + 1;
    // const newBrand = {
    //   id: this.counterId,
    //   ...data,
    // };
    // this.brands.push(newBrand);

    const newBrand = await this.brandRepository.create(data);
    return this.brandRepository.save(newBrand);
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.findOne(id);
    this.brandRepository.merge(brand, changes);
    return this.brandRepository.save(brand);
    // const index = this.brands.findIndex((item) => item.id === id);
    // this.brands[index] = {
    //   ...brand,
    //   ...changes,
    // };
    // return this.brands[index];
  }

  remove(id: number) {
    // const index = this.brands.findIndex((item) => item.id === id);
    // if (index === -1) {
    //   throw new NotFoundException(`Brand #${id} not found`);
    // }
    // this.brands.splice(index, 1);
    // return true;

    return this.brandRepository.delete(id);
  }
}
