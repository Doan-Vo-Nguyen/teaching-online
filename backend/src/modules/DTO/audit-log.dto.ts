import { IsEnum, IsNumber, IsOptional, IsString, IsDateString, IsIP, IsUrl } from 'class-validator';
import { ActionType } from '../entity/AuditLog.mongo';

export class AuditLogDTO {
    @IsNumber()
    user_id: number;

    @IsString()
    username: string;

    @IsString()
    fullname: string;

    @IsEnum(ActionType)
    action: ActionType;

    @IsNumber()
    @IsOptional()
    target_id?: number;

    @IsString()
    @IsOptional()
    target_type?: string;

    @IsIP()
    @IsOptional()
    ip_address?: string;

    @IsString()
    @IsOptional()
    user_agent?: string;

    @IsUrl()
    @IsOptional()
    page_url?: string;

    @IsString()
    @IsOptional()
    details?: string;

    @IsDateString()
    start_time: Date;

    @IsDateString()
    @IsOptional()
    end_time?: Date;

    @IsNumber()
    @IsOptional()
    duration_seconds?: number;
}

export class AuditLogQueryDTO {
    @IsNumber()
    @IsOptional()
    user_id?: number;

    @IsString()
    @IsOptional()
    username?: string;

    @IsEnum(ActionType)
    @IsOptional()
    action?: ActionType;

    @IsDateString()
    @IsOptional()
    start_date?: Date;

    @IsDateString()
    @IsOptional()
    end_date?: Date;
} 