import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Palenque Extra',
      brand: 'Mouldy Coffee',
      flavors: ['Vanilla', 'Irish Cream'],
    },
  ];

  findAll(page?: number, limit?: number): Coffee[] {
    if (!page || page < 1) {
      page = 1;
    }

    if (!limit || limit < 2) {
      limit = 10;
    }

    const startIndex = limit * (page - 1);
    const endIndex = Math.min(startIndex + limit, this.coffees.length);

    return this.coffees.slice(startIndex, endIndex);
  }

  findOneById(id: number): Coffee {
    const coffee = this.coffees.find((coffee) => coffee.id === +id);

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID '${id}' was not found.`);
    }

    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const newId = Math.max(...this.coffees.map((coffee) => coffee.id)) + 1;
    this.coffees.push({ ...createCoffeeDto, id: newId });

    return this.findOneById(newId);
  }

  update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffeeIndex = this.coffees.findIndex(
      (coffee) => coffee.id === id,
    );

    if (existingCoffeeIndex < 0) {
      throw new NotFoundException(`Coffee with ID '${id}' was not found.`);
    }

    const updatedCoffee = {
      ...this.coffees[existingCoffeeIndex],
      ...updateCoffeeDto,
      id,
    };

    this.coffees.splice(existingCoffeeIndex, 1, updatedCoffee);

    return updatedCoffee;
  }

  remove(id: number) {
    const existingCoffeeIndex = this.coffees.findIndex(
      (coffee) => coffee.id === id,
    );

    if (existingCoffeeIndex < 0) {
      throw new NotFoundException(`Coffee with ID '${id}' was not found.`);
    }

    this.coffees.splice(existingCoffeeIndex, 1);

    return true;
  }
}
