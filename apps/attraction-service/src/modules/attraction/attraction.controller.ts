import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { AttractionEntity } from './entities/attraction.entity';
import { AttractionService } from './attraction.service';

interface GetAttractionByIdRequest {
  id: string;
}

interface ListAttractionsRequest {
  country?: string;
  city?: string;
}

@Controller()
export class AttractionController {
  constructor(private readonly attractionService: AttractionService) {}

  @GrpcMethod('AttractionService', 'ListAttractions')
  async listAttractions(data: ListAttractionsRequest) {
    const attractions = await this.attractionService.listAttractions(data.country, data.city);
    return {
      attractions: attractions.map((attraction) => this.toResponse(attraction)),
      total: attractions.length,
    };
  }

  @GrpcMethod('AttractionService', 'GetAttractionById')
  async getAttractionById(data: GetAttractionByIdRequest) {
    try {
      const attraction = await this.attractionService.getAttractionById(data.id);
      return this.toResponse(attraction);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  private toResponse(attraction: AttractionEntity) {
    return {
      id: attraction.id,
      name: attraction.name,
      rating: attraction.rating,
      address: attraction.address,
      price: attraction.price,
      images: attraction.images,
      country: attraction.country,
      cityName: attraction.cityName,
    };
  }
}
