import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, passwordHash });
    return newUser.save();
  }
}
