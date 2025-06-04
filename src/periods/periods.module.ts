import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Period, PeriodSchema } from './schemas/period.schema';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Period.name, schema: PeriodSchema }])
  ],
  controllers: [PeriodsController],
  providers: [PeriodsService],
})
export class PeriodsModule {}
