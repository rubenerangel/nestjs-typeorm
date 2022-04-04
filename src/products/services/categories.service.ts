import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';

@Injectable()
export class CategoriesService {
  // private counterId = 1;
  // private categories: Category[] = [
  //   {
  //     id: 1,
  //     name: 'Category 1',
  //   },
  // ];
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne(id, {
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(data);

    return await this.categoryRepository.save(newCategory);
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const category = await this.findOne(id);
    this.categoryRepository.merge(category, changes);

    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
