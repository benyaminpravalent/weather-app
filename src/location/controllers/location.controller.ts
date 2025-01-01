import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateLocationInput } from '../dtos/create-location-input.dto';
import { LocationOutput } from '../dtos/location-output.dto';
import { LocationService } from '../services/location.service';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  /**
   * Add a location to the user's favorites.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a location to user favorites',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(LocationOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async addLocation(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateLocationInput,
  ): Promise<BaseApiResponse<LocationOutput>> {
    const location = await this.locationService.addLocation(ctx, input);
    return { data: location, meta: {} };
  }

  /**
   * Retrieve the user's favorite locations.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user favorite locations',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([LocationOutput]),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getLocations(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<LocationOutput[]>> {
    // Extract userId from the token in the RequestContext
    const userId = ctx.user!.id;

    const locations = await this.locationService.getLocations(ctx, userId);
    return { data: locations, meta: {} };
  }

  /**
   * Remove a location from the user's favorites.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a location from user favorites',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async deleteLocation(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<void> {
    await this.locationService.deleteLocation(ctx, id);
  }
}
