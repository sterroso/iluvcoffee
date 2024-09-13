import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { UpdateFlavorDto } from './dto/update-flavor.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class FlavorsService {
  constructor(
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<Flavor[]> {
    const { limit, page } = paginationQueryDto;
    const take = limit && limit > 1 ? limit : 10;
    const skip = page && page > 0 ? take * (page - 1) : 0;

    return await this.flavorRepository.find({
      skip,
      take,
      order: { id: 'asc' },
    });
  }

  async findOneById(id: string): Promise<Flavor> {
    const flavor = await this.flavorRepository.findOne({
      where: { id },
    });

    if (!flavor) {
      throw new NotFoundException(`Flavor wih ID '${id}', not found.`);
    }

    return flavor;
  }

  async create(createFlavorDto: CreateFlavorDto): Promise<Flavor> {
    const newFlavor = this.flavorRepository.create(createFlavorDto);

    return await this.flavorRepository.save(newFlavor);
  }

  async update(id: string, updateFlavorDto: UpdateFlavorDto): Promise<Flavor> {
    const flavor = await this.flavorRepository.preload({
      id,
      ...updateFlavorDto,
    });

    if (!flavor) {
      throw new NotFoundException(`Flavor wih ID '${id}', not found.`);
    }

    return await this.flavorRepository.save(flavor);
  }

  async remove(id: string): Promise<Flavor> {
    const flavor = await this.findOneById(id);

    return this.flavorRepository.remove(flavor);
  }
}
