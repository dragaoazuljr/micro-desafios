import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partida } from 'src/partidas/interfaces/partidas.interface';
import { Desafio, DesafioStatus } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {

    private readonly logger = new Logger(DesafiosService.name);

    constructor(
        @InjectModel('Desafios') private readonly _desafiosModel: Model<Desafio>,
    ){}

    async criarDesafio(desafio: Desafio){
        try{
            let desafioCriado = new this._desafiosModel(desafio);
            desafioCriado.status = DesafioStatus.PENDENTE;
            await desafioCriado.save();
        } catch(error) {
            this.logger.error(`error: ${error.message}`)
            throw new RpcException(error.message);
        }
    }

    async consultarDesafiosPorJogador(_id:  any) {
        try {
            return await this._desafiosModel.find().where('jogadores').in(_id)
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }

    async consultarDesafios(_id: string) {
        try {
            if(_id){
                return await this._desafiosModel.findOne({_id}).exec()
            } else {
                return await this._desafiosModel.find().exec();
            }
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }

    async atualizarDesafio(_id: string, desafio: Desafio) {
        try{
            let desafioEncontrado = await this._desafiosModel.findOne({_id}).exec();
            desafioEncontrado.status = desafio.status;

            return await this._desafiosModel.findByIdAndUpdate({_id}, desafioEncontrado).exec();
        } catch(error){
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }

    async apagarDesafios( _id: string ) {
        try {
            let desafio = await this._desafiosModel.findOne({_id}).exec();
            desafio.status = DesafioStatus.CANCELADO;
            return this._desafiosModel.findByIdAndUpdate({_id}, desafio).exec();
        } catch (error) {
            this.logger.error(`error: ${error.message}`);
            throw new RpcException(error.message);
        }
    }

    async atualizarDesafioPartida(_id: string, desafio: Desafio){
        try {
            desafio.status = DesafioStatus.REALIZADO;
            desafio.partida = _id;
            return await this._desafiosModel.findByIdAndUpdate({_id: desafio._id}, desafio).exec();
        } catch (error){
            this.logger.error(`error: ${JSON.stringify(error.menssage)}`)
            throw new RpcException(error.message);
        }
    }
}
