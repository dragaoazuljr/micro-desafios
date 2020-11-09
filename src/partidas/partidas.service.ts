import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { Partida } from './interfaces/partidas.interface';

@Injectable()
export class PartidasService {

    private _clientProxy = this._clientProxyService.createProxyFactory();
    private _clientRanking = this._clientProxyService.createProxyFactoryRankings();
    private _logger = new Logger(PartidasService.name);

    constructor (
        @InjectModel('Partida') private readonly _partidaModel: Model<Partida>,
        private readonly _clientProxyService: ClientProxyService
    ){}

    async criarPartida (partida: Partida){
        try {
            const partidaCriada = new this._partidaModel(partida);
            const result = await partidaCriada.save();
            const idPartida = result._id;

            let desafio = await this._clientProxy.send('consultar-desafios', partida.desafio).toPromise();
            await this._clientProxy.emit('atribuir-desafio-partida', {_id: idPartida, desafio, partida: result});
            return this._clientRanking.emit('processar-partida', {partida: result})
        } catch (error){
            this._logger.error(`error: ${error}`);
            throw new RpcException(error.message);
        }
    }
}
