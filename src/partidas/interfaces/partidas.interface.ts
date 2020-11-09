import { Document } from "mongoose";
import { Jogador } from "src/desafios/interfaces/jogador.interface";

export interface Partida extends Document{
    categoria: string;
    jogadores: Jogador[];
    def: Jogador;
    resultado: Resultado[];
    desafio: string;
}

export interface Resultado{
    set: string;
}