import { CallHandler, ExecutionContext, NestInterceptor, NotFoundException } from "@nestjs/common";
import { Observable, tap } from "rxjs";

/**
 * If the response data is undefined or null, the response status will be changed to 404.
 */
export class NotFoundInterceptor implements NestInterceptor<any, any> {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle()
            .pipe(tap(data => {
                if (data === undefined || data === null) throw new NotFoundException();
            }));
    }
}