import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../entities/wishlist.entity';

@Injectable()
export class WishlistsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data: Wishlist | Wishlist[]) => this.removeSensitiveFields(data)),
      );
  }

  private removeSensitiveFields(data: Wishlist | Wishlist[]) {
    if (Array.isArray(data)) {
      for (const wishlist of data) {
        this.deleteFields(wishlist?.owner);
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
