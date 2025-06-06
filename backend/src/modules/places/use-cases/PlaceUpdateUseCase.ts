import { ServerError } from "../../../shared/errors/serverError";
import { placeDTO } from "../dtos/placeDTO";
import { PlaceRepository } from "../repositories/PlaceRepository";
import { CityRepository } from "../../cities/repositories/CityRepository";
import { parseImageInput } from "../../../shared/utils/parseImageInput";
import { normalizePlaceInput } from "../utils/normalizePlaceInput";

export class PlaceUpdateUseCase {
  constructor(
    private placeRepository: PlaceRepository,
    private cityRepository: CityRepository
  ) {}

  async execute(id: string, data: Partial<placeDTO>) {
    const place = await this.placeRepository.findUnique(id);
    if (!place) throw new ServerError("Place not found", 404);

    const city = await this.cityRepository.findUnique(place.cityId);
    if (!city) throw new ServerError("City not found", 404);

    const normalizedData = normalizePlaceInput(data);

    if (normalizedData.imageUrl) {
      const parsed = parseImageInput(normalizedData.imageUrl);
      normalizedData.imageUrl = parsed ?? undefined;
    }

    const updatedPlace = await this.placeRepository.update(id, normalizedData);

    return updatedPlace;
  }
}
