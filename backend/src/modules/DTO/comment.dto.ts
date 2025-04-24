import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDate,
  IsOptional,
  IsBoolean,
  IsEnum,
  Length
} from 'class-validator'
import { Type } from '../entity/Comment.mongo'
import { ObjectId } from 'typeorm'
import { Expose, Transform } from 'class-transformer'

export class CommentDTO {
  @IsOptional()
  @Expose()
  id: ObjectId;

  @IsNumber()
  @IsOptional()
  @Expose()
  comment_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  target_id: number;

  @IsEnum(Type)
  @IsNotEmpty()
  @Expose()
  target_type: Type;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  @Expose()
  content: string;

  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @Expose()
  is_private: boolean;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => value instanceof Date ? value : new Date(value))
  @Expose()
  created_at: Date;
}

export class CommentDTOPost {
    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsNumber()
    @IsNotEmpty()
    target_id: number;

    @IsString()
    @IsNotEmpty()
    @Length(1, 1000)
    content: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(1)
    @Transform(({ value }) => Boolean(value))
    is_private: number;
}

export class CommentDTOUpdate {
    @IsString()
    @IsNotEmpty()
    @Length(1, 1000)
    @IsOptional()
    content?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(1)
    @Transform(({ value }) => Boolean(value))
    is_private?: number;
}