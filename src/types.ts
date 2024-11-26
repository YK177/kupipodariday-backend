import { Request as IRequest } from 'express';
import { User } from './users/entities/user.entity';

export interface UserRequest extends IRequest {
  user: User;
}
