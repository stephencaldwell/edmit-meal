import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecipeIngredient } from './recipeIngredient';
import { Field, ObjectType, ID } from 'type-graphql';

@Entity()
@ObjectType()
export class Recipe {
  @Field(_ => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: false })
  name: string;

  @Field(_ => [RecipeIngredient])
  @OneToMany(_ => RecipeIngredient, ri => ri.recipe)
  ingredients: Promise<RecipeIngredient[]>;
}
