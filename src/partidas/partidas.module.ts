import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';
import { PartidaSchema } from './interfaces/partidas.schema';
import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';

@Module({
  controllers: [PartidasController],
  providers: [PartidasService],
  imports: [
    MongooseModule.forFeature([{
      name: 'Partida',
      schema: PartidaSchema
    }]),
    ClientProxyModule
  ]
})
export class PartidasModule {}
