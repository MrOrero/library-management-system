import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import { Config } from '../../../config';
import { LoginRequestDTO } from '../dto/LoginRequest.dto';

@Injectable()
export class AuthService {
  constructor() {}

  login({username, password}: LoginRequestDTO) {

    if  (username !== Config.ADMIN_USERNAME || password !== Config.ADMIN_PASSWORD) {
        throw new BadRequestException('Invalid username or password');
    }


    const token = this.createToken(username);
    return { token };
  }

  createToken = (username: string) => {
    const token = jwt.sign({ username }, Config.SECRET_KEY, {
      expiresIn: 3 * 24 * 60 * 60,
    });
    return token;
  };

}
