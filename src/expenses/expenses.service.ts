import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cache } from 'cache-manager';

import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { getExpenseCacheKey } from '../utils/cache-key';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private expenseModel: Model<ExpenseDocument>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll(userId: string, period?: string): Promise<Expense[]> {
    console.log('📡 Veritabanından veriler alınıyor...');
    const query: any = {
      userId: new Types.ObjectId(userId), // 🔁 string → ObjectId
    };
    if (period) query.period = period;

    return this.expenseModel.find(query).sort({ date: -1 });
  }

  async create(userId: string, dto: CreateExpenseDto): Promise<Expense> {
    const newExpense = new this.expenseModel({
      userId: new Types.ObjectId(userId),
      ...dto,
      date: dto.date || new Date(),
    });

    const saved = await newExpense.save();
    await this.invalidateExpenseCache(userId);
    return saved;
  }

  async delete(userId: string, id: string): Promise<void> {
    const expense = await this.expenseModel.findById(id);
    if (!expense) throw new NotFoundException('Gider bulunamadı');
    if (!expense.userId.equals(userId)) throw new ForbiddenException('Yetkisiz işlem');

    await expense.deleteOne();
    await this.invalidateExpenseCache(userId);
  }

  private async invalidateExpenseCache(userId: string): Promise<void> {
    const keys = [
      getExpenseCacheKey(userId, '683b7836849ffa880d815111'),
    ];

    for (const key of keys) {
      console.log('🧹 Cache silindi:', key);
      await this.cacheManager.del(key);
    }
  }


}
