import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Period, PeriodDocument } from './schemas/period.schema';
import { Model } from 'mongoose';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectModel(Period.name) private periodModel: Model<PeriodDocument>,
  ) {}

  async findByUserId(userId: string) {
    return this.periodModel.find({ members: userId });
  }

  async create(period: string, userId: string) {
    const newPeriod = new this.periodModel({
      period,
      members: [userId],
    });
    return newPeriod.save();
  }

  async delete(id: string) {
    return this.periodModel.findByIdAndDelete(id);
  }
}
