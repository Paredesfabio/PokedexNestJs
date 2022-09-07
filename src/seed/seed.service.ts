import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces/poke-response.interface';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class SeedService {

    private apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10';
    private readonly axios: AxiosInstance = axios

    constructor(
    ) {}

    async executeSeed(){
        const { data } = await this.axios.get<PokemonResponse>(this.apiUrl);
        data.results.forEach(  ( { name, url }) => {
            console.log(name);
            console.log(url);
            const segment = url.split('/');
            const no = +segment[ segment.length -2 ];
            console.log( { name, no } )
        });
        return data;
    }

}
