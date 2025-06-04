import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { AppointmentEvent, AppointmentEventSchema } from './schemas/appointment-event.schema';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentEventController } from './appointment-event.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: AppointmentEvent.name, schema: AppointmentEventSchema }
    ])
  ],
  controllers: [AppointmentController, AppointmentEventController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
