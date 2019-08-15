import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Ingredient } from './ingredient';
import { Recipe } from './recipe';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity()
@ObjectType()
export class RecipeIngredient {
  @Field(_ => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'int', nullable: false, default: 1 })
  quantity: number;

  @Field(_ => Ingredient)
  @ManyToOne(_ => Ingredient, ing => ing.recipes)
  ingredient: Promise<Ingredient>;

  @Field(_ => Recipe)
  @ManyToOne(_ => Recipe, r => r.ingredients)
  recipe: Promise<Recipe>;
}
