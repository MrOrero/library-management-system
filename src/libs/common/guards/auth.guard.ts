import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { Config } from "../../../config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor() { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;

        if (!authorizationHeader) {
            throw new UnauthorizedException("Authorization header not found.");
        }

        const [tokenType, token] = authorizationHeader.split(" ");

        if (tokenType !== "Bearer" || !token) {
            throw new UnauthorizedException("Invalid token.");
        }

        try {
            const decoded = jwt.verify(token, Config.SECRET_KEY) as {
              username: string;
            };

            if (decoded.username === Config.ADMIN_USERNAME) {
              return true;
            }
          } catch (error) {
            throw new UnauthorizedException('You are not authorized');
          }
    }
}