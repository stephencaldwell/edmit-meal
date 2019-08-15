import {
  Entity,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
  ManyToOne
} from 'typeorm';
import { Tag } from './tag';
import { ObjectType, Field, ID } from 'type-graphql';
import { RecipeIngredient } from './recipeIngredient';

@Entity()
@ObjectType()
export class Ingredient {
  @Field(_ => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column({ nullable: false })
  public name: string;

  @Field()
  @Column({ nullable: false })
  public unitPriceInCents: number;

  @Field(_ => [Tag])
  @ManyToMany(_ => Tag)
  @JoinTable()
  public tags: Promise<Tag[]>;

  @OneToMany(_ => RecipeIngredient, ri => ri.ingredient)
  public recipes: RecipeIngredient[];
}
