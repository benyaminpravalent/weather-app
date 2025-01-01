import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Wind {
  @Field(() => Float)
  speed: number;

  @Field(() => Float)
  deg: number;
}
