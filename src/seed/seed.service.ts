import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from './../pokemon/entities/pokemon.entity';
import { PokemonResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';


@Injectable()
export class SeedService {

    private apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=450';

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly http: AxiosAdapter
    ) {}

    async executeSeed(){
        await this.pokemonModel.deleteMany({});
        const data = await this.http.get<PokemonResponse>(this.apiUrl);

        // FORMA 1 DE INSERTAR EN BULK
        // const insertPromisesArray = [];
        // data.results.forEach( async ( { name, url }) => {
        //     const segment = url.split('/');
        //     const no = +segment[ segment.length -2 ];
        //         name = name.toLocaleLowerCase();
        //         insertPromisesArray.push(this.pokemonModel.create( { name, no } ));
        // });
        // await Promise.all( insertPromisesArray );

        // FORMA 2 DE INSERTAR EN BULK
        const pokemoToInsert: { name: string, no: number }[] = [];
        data.results.forEach( async ( { name, url }) => {
            const segment = url.split('/');
            const no = +segment[ segment.length -2 ];
            name = name.toLocaleLowerCase();
            pokemoToInsert.push({ name, no });
        });
        this.pokemonModel.insertMany(pokemoToInsert);
        return 'Seed executed';
    }

}
