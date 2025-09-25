import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registrar un nuevo usuario en el sistema
   */
  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    // Validar que el email no esté en uso
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email: registerDto.email.toLowerCase() }
    });

    if (usuarioExistente) {
      throw new ConflictException(`Ya existe un usuario con el email "${registerDto.email}"`);
    }

    // Validar que si el rol es "empleada", se proporcione empleadaId
    if (registerDto.rol === 'empleada' && !registerDto.empleadaId) {
      throw new BadRequestException('El campo empleadaId es requerido cuando el rol es "empleada"');
    }

    // Validar que si el rol es "admin", no se proporcione empleadaId
    if (registerDto.rol === 'admin' && registerDto.empleadaId) {
      throw new BadRequestException('El campo empleadaId no debe proporcionarse cuando el rol es "admin"');
    }

    try {
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      
      // Crear el usuario
      const usuario = this.usuarioRepository.create({
        ...registerDto,
        email: registerDto.email.toLowerCase(), // Normalizar email
        password: hashedPassword,
      });

      // Guardar en base de datos
      const usuarioGuardado = await this.usuarioRepository.save(usuario);
      
      // Convertir a DTO de respuesta (sin password)
      return plainToInstance(UserResponseDto, usuarioGuardado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al registrar usuario: ${errorMessage}`);
    }
  }

  /**
   * Autenticar usuario y generar token JWT
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // Buscar usuario por email
    const usuario = await this.usuarioRepository.findOne({
      where: { email: loginDto.email.toLowerCase() }
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(loginDto.password, usuario.password);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Crear payload del JWT
    const payload: JwtPayload = { 
      sub: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol,
      empleadaId: usuario.empleadaId 
    };

    // Generar token y respuesta
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

  /**
   * Validar usuario para la estrategia JWT
   */
  async validateUser(payload: JwtPayload): Promise<AuthUser | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: payload.sub }
    });

    if (!usuario) {
      return null;
    }

    // Devolver usuario sin contraseña
    const { password: _ , ...userWithoutPassword } = usuario;

    console.log(_)
    return userWithoutPassword;
  }
}