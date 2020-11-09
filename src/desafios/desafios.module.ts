import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { DesafioSchema } from './interfaces/desafio.schema';

@Module({
  controllers: [DesafiosController],
  providers: [DesafiosService],
  imports: [
    MongooseModule.forFeature([{
      name: 'Desafios',
      schema: DesafioSchema
    }]),
    ClientProxyModule
  ]
})
export class DesafiosModule {}
