import { Station } from './Station'

export class Journey {
  constructor(private fromStation: Station, private toStation: Station) {}

  isSameAs(journey: Journey) {
    console.log(journey, this)
    return (
      this.fromStation.isSameAs(journey.fromStation) && this.toStation.isSameAs(journey.toStation)
    )
  }

  getReturnJourney() {
    return new Journey(this.toStation, this.fromStation)
  }
}
