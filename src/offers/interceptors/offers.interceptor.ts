import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../entities/offer.entity';

@Injectable()
export class OffersInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data: Offer | Offer[]) => this.removeSensitiveFields(data)));
  }

  private removeSensitiveFields(data: Offer | Offer[]) {
    if (Array.isArray(data)) {
      for (const offer of data) {
        this.deleteFields(offer?.user);
        this.deleteFields(offer?.item?.owner);
      }
    } else {
      this.deleteFields(data?.user);
      this.deleteFields(data?.item?.owner);
    }

    return data;
  }

  private deleteFields(user?: User) {
    if (!user) return;

    delete user.email;
    delete user.password;
  }
}
