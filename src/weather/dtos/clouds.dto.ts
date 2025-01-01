import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Clouds {
  @Field(() => Int)
  all: number;
}
