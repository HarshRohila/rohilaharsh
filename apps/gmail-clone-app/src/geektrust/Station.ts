import { Journey } from './Journey'
import { InsufficientBalanceError } from './MetroCard'
import { Passenger } from './Passenger'
import { PassengerJourney } from './PassengerJourney'

export abstract class Station {
  constructor(
    protected name: string,
    protected collection: number,
    protected discount: number,
    protected checkedInPassengers: Passenger[]
  ) {}

  protected addPassenger(passenger: Passenger) {
    const found = this.checkedInPassengers.find(p => p.isSameAs(passenger))
    if (!found) this.checkedInPassengers.push(passenger)
  }

  public isSameAs(station: Station) {
    return this.name === station.getName()
  }

  getCollection() {
    return this.collection
  }

  getName() {
    return this.name
  }

  protected checkIn(passenger: Passenger, journey: Journey) {
    const passengerJourney = this.createPassengerJourney(passenger, journey)

    const journeyCost = passengerJourney.getJourneyCost()
    this.addToCollection(journeyCost)

    this.addPassenger(passenger)
  }

  private createPassengerJourney(passenger: Passenger, journey: Journey) {
    const passengerJourney = new PassengerJourney(passenger, journey)

    const discount = passengerJourney.getDiscount()
    this.discount += discount

    this.tryJourney(passengerJourney)

    return passengerJourney
  }

  private tryJourney(passengerJourney: PassengerJourney) {
    try {
      passengerJourney.makeJourney()
    } catch (err) {
      if (err instanceof InsufficientBalanceError)
        this.handleInsufficientBalanceError(passengerJourney)
      else throw err
    }
  }

  private handleInsufficientBalanceError(passengerJourney: PassengerJourney) {
    const serviceCharge = passengerJourney.getServiceCharge()

    this.addToCollection(serviceCharge)

    passengerJourney.rechargeAndDoJourney()
  }

  private addToCollection(amount: number) {
    this.collection += amount
  }

  getDiscount() {
    return this.discount
  }

  makeJourney(passenger: Passenger, toStation: Station) {
    const journey = new Journey(this, toStation)
    this.checkIn(passenger, journey)
  }

  printSummary() {
    console.log(`TOTAL_COLLECTION ${this.name} ${this.collection} ${this.discount}`)
    console.log(`PASSENGER_TYPE_SUMMARY`)
    Passenger.print(this.checkedInPassengers)
  }
}

export class MetroStation extends Station {
  constructor(name: string) {
    super(name, 0, 0, [])
  }
}
