import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheEvictInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const userId = req.params.userId;

    return next.handle().pipe(
      tap(async () => {
        if (userId) {
          await this.cacheManager.del(`expenses:${userId}:all`);
          const periods = ['ocak', 'subat', 'mart', 'nisan', 'mayıs', 'haziran', 'temmuz', 'ağustos', 'eylül', 'ekim', 'kasım', 'aralık'];
          for (const p of periods) {
            await this.cacheManager.del(`expenses:${userId}:period:${p}`);
          }
        }
      }),
    );
  }
}
