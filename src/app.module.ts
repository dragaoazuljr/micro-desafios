import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';

@Module({
  imports: [
    DesafiosModule, 
    PartidasModule, 
    ClientProxyModule,
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.zkh1s.mongodb.net/srdesafios?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
