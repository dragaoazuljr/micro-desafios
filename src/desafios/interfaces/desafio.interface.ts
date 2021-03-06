import { Document } from "mongoose";
import { Partida } from "src/partidas/interfaces/partidas.interface";
import { Jogador } from "./jogador.interface";
// Generated by https://quicktype.io

export interface Desafio extends Document {
    dataHoraDesafio:     Date;
    status:              DesafioStatus;
    dataHoraSolicitacao: Date;
    dataHoraResposta:    Date;
    solicitante:         Jogador;
    categoria:           string;
    jogadores:           Jogador[];
    partida:             string;
}

export enum DesafioStatus {
    REALIZADO = 'REALIZADO',
    PENDENTE = 'PENDENTE',
    ACEITO = 'ACEITO',
    NEGADO = 'NEGADO',
    CANCELADO = 'CANCELADO'
}
