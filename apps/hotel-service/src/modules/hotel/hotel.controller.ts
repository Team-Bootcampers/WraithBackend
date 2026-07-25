import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { HotelEntity } from './entities/hotel.entity';
import { HotelService } from './hotel.service';

interface GetHotelByIdRequest {
  id: string;
}

interface ListHotelsRequest {
  country?: string;
  city?: string;
}

@Controller()
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @GrpcMethod('HotelService', 'ListHotels')
  async listHotels(data: ListHotelsRequest) {
    const hotels = await this.hotelService.listHotels(data.country, data.city);
    return {
      hotels: hotels.map((hotel) => this.toResponse(hotel)),
      total: hotels.length,
    };
  }

  @GrpcMethod('HotelService', 'GetHotelById')
  async getHotelById(data: GetHotelByIdRequest) {
    try {
      const hotel = await this.hotelService.getHotelById(data.id);
      return this.toResponse(hotel);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  private toResponse(hotel: HotelEntity) {
    return {
      id: hotel.id,
      name: hotel.name,
      rating: hotel.rating,
      address: hotel.address,
      price: hotel.price,
      images: hotel.images,
      country: hotel.country,
      cityName: hotel.cityName,
    };
  }
}
