import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../entities/user.entity';

const CREATE_USER_METHOD_NAME = 'signup';
const GET_MY_PROFILE_METHOD_NAME = 'findMe';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();

    return next
      .handle()
      .pipe(
        map((data: User | User[]) => this.removeSensitiveFields(data, handler)),
      );
  }

  private removeSensitiveFields(data: User | User[], handler: any) {
    if (Array.isArray(data)) {
      for (const user of data) {
        this.deleteFields(user, handler);
      }
    } else {
      this.deleteFields(data, handler);
    }

    return data;
  }

  private deleteFields(user: User, handler: any) {
    if (
      handler.name !== GET_MY_PROFILE_METHOD_NAME &&
      handler.name !== CREATE_USER_METHOD_NAME
    ) {
      delete user.email;
    }
    delete user.password;
  }
}
