import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Frontend y otros orígenes
    credentials: true,
  });

  // Pipeline de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Solo propiedades definidas en DTOs
      forbidNonWhitelisted: true, // Rechazar propiedades no definidas
      transform: true, // Transformar automáticamente los tipos
      transformOptions: {
        enableImplicitConversion: true, // Conversión automática de tipos
      },
    }),
  );

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('LIA NAILS API')
    .setDescription('API REST para sistema de gestión de nail salon')
    .setVersion('1.0')
    .addTag('Auth', 'Endpoints de autenticación y autorización')
    .addTag('Empleadas', 'Gestión de empleadas del salon')
    .addTag('Servicios', 'Catálogo de servicios disponibles')
    .addTag('Clientas', 'Gestión de clientas')
    .addTag('Turnos', 'Sistema de reservas y agenda')
    .addTag('Pagos', 'Procesamiento de pagos y comprobantes')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantener token entre recargas
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'LIA NAILS API Docs',
  });

  // Puerto desde variable de entorno o 3000 por defecto
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`🚀 LIA NAILS API corriendo en: http://localhost:${port}`);
  console.log(`📚 Swagger docs en: http://localhost:${port}/api`);
}

bootstrap().catch(error => {
  console.error('❌ Error al iniciar la aplicación:', error);
  process.exit(1);
});