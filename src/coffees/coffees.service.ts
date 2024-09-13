import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<Coffee[]> {
    const { page, limit } = paginationQueryDto;
    const take = limit && limit > 1 ? limit : 10;
    const skip = page && page > 0 ? (page - 1) * take : 0;

    return await this.coffeeRepository.find({
      skip,
      take,
      order: { id: 'asc' },
      relations: { flavors: true },
    });
  }

  async findOneById(id: string): Promise<Coffee> {
    const existingCoffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: { flavors: true },
    });

    if (!existingCoffee) {
      throw new NotFoundException(`Coffee with ID '${id}', not found.`);
    }

    return existingCoffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });

    return await this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    const coffee = await this.coffeeRepository.preload({
      id: id,
      ...updateCoffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID '${id}', not found.`);
    }

    return await this.coffeeRepository.save(coffee);
  }

  async remove(id: string): Promise<Coffee> {
    const coffee = await this.findOneById(id);
    return await this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const flavor = await this.flavorRepository.findOne({
      where: { name },
    });

    if (flavor) return flavor;

    return this.flavorRepository.create({ name });
  }
}
