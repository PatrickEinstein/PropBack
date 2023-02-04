import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorsInterceptor } from './interceptors/error.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import * as morgan from 'morgan';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1/', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.use(morgan('combined'));
  app.use(cors());

  const PORT = Number(process.env.PORT || 0) || 3001;

  await app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
}
bootstrap();
