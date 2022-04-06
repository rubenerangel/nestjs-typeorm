import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindConditions } from 'typeorm';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from './../dtos/products.dtos';
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

  findAll(params?: FilterProductsDto) {
    if (params) {
      const where: FindConditions<Product> = {};
      const { offset, limit, minPrice, maxPrice } = params;
      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }

      return this.productRepository.find({
        relations: ['brand', 'categories'],
        where,
        take: limit,
        skip: offset,
        order: {
          createdAt: 'ASC',
        },
      });
    }
    // return this.products;
    return this.productRepository.find({
      relations: ['brand', 'categories'],
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

    if (changes.categoriesIds) {
      const categories = await this.categoryRepository.findByIds(
        changes.categoriesIds,
      );
      product.categories = categories;
    }

    return this.productRepository.save(product);
  }

  async removeCategoryProduct(productId: number, categoryId: number) {
    const product = await this.productRepository.findOne(productId, {
      relations: ['categories'],
    });
    product.categories = product.categories.filter(
      (item) => item.id !== categoryId,
    );

    return this.productRepository.save(product);
  }

  async addCategoryProduct(productId: number, categoryId: number) {
    const product = await this.productRepository.findOne(productId, {
      relations: ['categories'],
    });

    const category = await this.categoryRepository.findOne(categoryId);
    product.categories.push(category);

    return this.productRepository.save(product);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
