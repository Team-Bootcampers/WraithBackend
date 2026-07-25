import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RestaurantEntity } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

interface GetRestaurantByIdRequest {
  id: string;
}

interface ListRestaurantsRequest {
  country?: string;
  city?: string;
}

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @GrpcMethod('RestaurantService', 'ListRestaurants')
  async listRestaurants(data: ListRestaurantsRequest) {
    const restaurants = await this.restaurantService.listRestaurants(data.country, data.city);
    return {
      restaurants: restaurants.map((restaurant) => this.toResponse(restaurant)),
      total: restaurants.length,
    };
  }

  @GrpcMethod('RestaurantService', 'GetRestaurantById')
  async getRestaurantById(data: GetRestaurantByIdRequest) {
    try {
      const restaurant = await this.restaurantService.getRestaurantById(data.id);
      return this.toResponse(restaurant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new RpcException({ code: status.NOT_FOUND, message: error.message });
      }
      throw new RpcException({ code: status.INTERNAL, message: error.message });
    }
  }

  private toResponse(restaurant: RestaurantEntity) {
    return {
      id: restaurant.id,
      name: restaurant.name,
      rating: restaurant.rating,
      address: restaurant.address,
      price: restaurant.price,
      images: restaurant.images,
      country: restaurant.country,
      cityName: restaurant.cityName,
    };
  }
}
