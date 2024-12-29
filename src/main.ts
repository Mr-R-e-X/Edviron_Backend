import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.CORS_ORIGIN_DEV, process.env.CORS_ORIGIN_PROD],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.PORT);

  // Logger.log('Registered routes:');
  // const server = app.getHttpAdapter().getInstance();
  // Logger.log('Registered routes:');
  // server._router.stack
  //   .filter((layer) => layer.route)
  //   .forEach((layer) => {
  //     Logger.log(
  //       `${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`,
  //     );
  //   });
}
bootstrap();
