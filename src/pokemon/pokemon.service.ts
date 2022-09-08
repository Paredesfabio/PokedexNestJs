import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from './../common/dto/PaginationDto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

    private defaultLimit: number;
    private defaultOfset: number;

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly configService: ConfigService,
    ) {
        this.defaultLimit = configService.get<number>('defaultLimit');
        this.defaultOfset = configService.get<number>('defaultOffset');
    }

    async create(createPokemonDto: CreatePokemonDto) {
        try {
            createPokemonDto.name =  createPokemonDto.name.toLocaleLowerCase();
            const pokemon = await this.pokemonModel.create( createPokemonDto );
            return pokemon;
        } catch (error) {
            this.handledExceptions(error);
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const { limit = this.defaultLimit, offset = this.defaultOfset } = paginationDto;
        return await this.pokemonModel.find()
                        .limit( limit )
                        .skip( offset )
                        .sort({ no: 1 });
    }

    async findOne(term: string) {
        let pokemon: Pokemon;
        if( !isNaN(+term) ){
            pokemon = await this.pokemonModel.findOne( { no: term } );
        }

        // MongoId
        if( !pokemon && isValidObjectId(term)){
            pokemon = await this.pokemonModel.findById( term );
        }

        // Name
        if(!pokemon){
            pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
        }

        // Si no existe ningun pokemon
        if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)

        return pokemon;
    }

    async update(term: string, updatePokemonDto: UpdatePokemonDto) {
        const pokemon = await this.findOne( term );
        if( updatePokemonDto.name )
            updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
        try {
            await pokemon.updateOne( updatePokemonDto, { new: true } );
            return { ...pokemon.toJSON(), ...updatePokemonDto};
        } catch (error) {
            this.handledExceptions(error);
        }
    }

    async remove(id: string) {
        const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id  });
        if(deletedCount === 0)
            throw new BadRequestException(`Pokemon with id "${id}" not found`);
        return deletedCount;
    }

    // Se crea nuevo metodo para exepciones no controladas
    private handledExceptions(error: any) {
        if(error.code === 11000){
            throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify(error.keyValue) }`);
        }
        throw new InternalServerErrorException(`Can't create Pokemon - Check sever logs`);
    }
}
