import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<Usuario, 'password'>> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const usuario = this.usuarioRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.usuarioRepository.save(usuario);
    
    const { password, ...result } = usuario;
    console.log(password, result);
    return result;
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email }
    });

    if (!usuario || !await bcrypt.compare(loginDto.password, usuario.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = { 
      sub: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol,
      empleadaId: usuario.empleadaId 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        empleadaId: usuario.empleadaId,
      }
    };
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: payload.sub }
    });

    if (!usuario) {
      return null;
    }

    const { password, ...result } = usuario;
    console.log(password, result);
    return result;
  }
}