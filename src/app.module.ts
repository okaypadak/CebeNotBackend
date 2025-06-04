import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PeriodsModule } from './periods/periods.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PeriodsModule,
    ExpensesModule,
    AppointmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
