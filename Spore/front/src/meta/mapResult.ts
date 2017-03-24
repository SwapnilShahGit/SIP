export class MapResult implements IMapResult {
    Name: string;
    Cost: number;
    Rating: number;
    Location: string;
    Open: boolean;

    constructor(place: any) {
        this.Name = place && place.name;
        this.Cost = place && place.price_level;
        this.Rating = place && place.rating;

        this.Location = place && place.vicinity;
        this.Open = place && place.opening_hours && place.opening_hours.open_now;
    }
}

interface IMapResult {
    Name: string,
    Cost: number,
    Rating: number,
    Location: string,
    Open: boolean
}
