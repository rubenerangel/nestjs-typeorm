import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    // private brandsService: BrandsService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // private counterId = 1;
  // private products: Product[] = [
  //   {
  //     id: 1,
  //     name: 'Producto 1',
  //     description: 'lorem lorem',
  //     price: 10000,
  //     stock: 300,
  //     image: 'https://i.imgur.com/U4iGx1j.jpeg',
  //   },
  // ];

  findAll() {
    // return this.products;
    return this.productRepository.find({
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    // const product = this.products.find((item) => item.id === id);
    const product = await this.productRepository.findOne(id, {
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async create(data: CreateProductDto) {
    // const newProduct = new Product();
    // newProduct.image = data.image;
    // newProduct.name = data.name;
    // newProduct.description = data.description;
    // newProduct.price = data.price;
    // newProduct.stock = data.stock;
    // newProduct.image = data.image;
    const newProduct = this.productRepository.create(data);

    if (data.brandId) {
      const brand = await this.brandRepository.findOne(data.brandId);
      newProduct.brand = brand;
    }

    if (data.categoriesIds) {
      const categories = await this.categoryRepository.findByIds(
        data.categoriesIds,
      );
      newProduct.categories = categories;
    }

    return this.productRepository
      .save(newProduct)
      .then(
        (res): Product => {
          return res;
        },
      )
      .catch((err) => {
        throw new BadRequestException(`${err.message || 'Unexpected Error'}`);
      });
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productRepository.findOne(id);
    this.productRepository.merge(product, changes);

    if (changes.brandId) {
      const brand = await this.brandRepository.findOne(changes.brandId);
      product.brand = brand;
    }

    return this.productRepository.save(product);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
