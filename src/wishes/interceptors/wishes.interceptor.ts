import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Wish } from '../entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class WishesInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data: Wish | Wish[]) => this.removeSensitiveFields(data)));
  }

  private removeSensitiveFields(data: Wish | Wish[]) {
    if (Array.isArray(data)) {
      for (const wish of data) {
        this.deleteFields(wish?.owner);
      }
    } else {
      this.deleteFields(data?.owner);
    }

    return data;
  }

  private deleteFields(user?: User) {
    if (!user) return;

    delete user.email;
    delete user.password;
  }
}