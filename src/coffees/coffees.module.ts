import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { FlavorsController } from './flavors.controller';
import { CoffeesService } from './coffees.service';
import { FlavorsService } from './flavors.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController, FlavorsController],
  providers: [CoffeesService, FlavorsService],
})
export class CoffeesModule {}
