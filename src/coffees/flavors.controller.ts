import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FlavorsService } from './flavors.service';
import { CreateFlavorDto } from './dto/create-flavor.dto';
import { UpdateFlavorDto } from './dto/update-flavor.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('flavors')
export class FlavorsController {
  constructor(private readonly flavorsService: FlavorsService) {}

  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.flavorsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.flavorsService.findOneById(id);
  }

  @Post()
  async create(@Body() createFlavorDto: CreateFlavorDto) {
    return await this.flavorsService.create(createFlavorDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFlavorDto: UpdateFlavorDto,
  ) {
    return await this.flavorsService.update(id, updateFlavorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.flavorsService.remove(id);
  }
}
