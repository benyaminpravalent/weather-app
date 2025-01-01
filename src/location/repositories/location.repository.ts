import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Location } from '../entities/location.entity';

@Injectable()
export class LocationRepository extends Repository<Location> {
  constructor(private dataSource: DataSource) {
    super(Location, dataSource.createEntityManager());
  }

  /**
   * Get all favorite locations for a user.
   */
  async getByUserId(userId: number): Promise<Location[]> {
    return this.find({ where: { userId } });
  }

  /**
   * Add a location to the user's favorites.
   */
  async addLocation(userId: number, cityName: string): Promise<Location> {
    const location = this.create({ userId, cityName });
    return this.save(location);
  }

  /**
   * Remove a location by ID.
   */
  async deleteById(id: number): Promise<void> {
    const result = await this.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }
}
