import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginRequestDTO } from '../dto/LoginRequest.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
    login(@Body() loginRequestDto: LoginRequestDTO) {
        return this.authService.login(loginRequestDto);
    }
}
