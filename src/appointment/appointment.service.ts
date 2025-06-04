import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { AppointmentEvent } from './schemas/appointment-event.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseAppointmentEventDto } from './dto/response-appointment-event.dto';


@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(AppointmentEvent.name) private eventModel: Model<AppointmentEvent>
  ) {}

  async create(dto: CreateAppointmentDto) {
    const startDate = new Date(dto.start);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + dto.durationDays);

    const appointment = new this.appointmentModel({
      userId: new Types.ObjectId(dto.userId),
      start: startDate,
      durationDays: dto.durationDays,
      explanation: dto.explanation,
      repeat: dto.repeat
    });

    await appointment.save();

    if (dto.repeat === 'once') {
      const singleEvent = new this.eventModel({
        appointmentId: new Types.ObjectId(appointment.id),
        userId: new Types.ObjectId(dto.userId),
        date: endDate,
        explanation: dto.explanation
      });
      await singleEvent.save();
      return { message: 'Tek seferlik randevu oluşturuldu.' };
    }

    const intervalMap: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30
    };
    const interval = intervalMap[dto.repeat];

    const events: Partial<AppointmentEvent>[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      events.push({
        appointmentId: new Types.ObjectId(appointment.id),
        userId: new Types.ObjectId(dto.userId),
        date: new Date(currentDate),
        explanation: dto.explanation
      });
      currentDate.setDate(currentDate.getDate() + interval);
    }

    await this.eventModel.insertMany(events);
    return { message: `${events.length} randevu olayı oluşturuldu.` };
  }

  async delete(id: string) {
    const deleted = await this.appointmentModel.findByIdAndDelete(id);
    if (!deleted) return { message: 'Randevu bulunamadı' };
    await this.eventModel.deleteMany({ appointmentId: id });
    return { message: 'Randevu ve ilişkili eventler silindi' };
  }

  async listAllAppointments(userId: string) {
    return this.appointmentModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ start: -1 });
  }

  async listAllEvents(): Promise<ResponseAppointmentEventDto[]> {
    const events = await this.eventModel.find().sort({ date: 1 }).lean();
    return plainToInstance(ResponseAppointmentEventDto, events, { excludeExtraneousValues: true });
  }
}
