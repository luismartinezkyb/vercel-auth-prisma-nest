import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class FilterDataDto {
  @IsOptional()
  orderBy?: 'asc' | 'desc';
  @IsOptional()
  orderByField?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  skip?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  take?: number = 10;
  @IsString()
  @IsOptional()
  globalFilter: string;
}
