import { Journey } from './Journey'
import { InsufficientBalanceError } from './MetroCard'
import { Passenger } from './Passenger'

export abstract class Station {
  protected collection: number
  protected discount: number
  protected name: string
  protected checkedInPassengers: Passenger[] = []

  constructor(name: string) {
    this.collection = 0
    this.discount = 0
    this.name = name
  }

  addPassenger(passenger: Passenger) {
    const found = this.checkedInPassengers.find(p => p.isSameAs(passenger))
    if (!found) this.checkedInPassengers.push(passenger)
  }

  makeJourney(passenger: Passenger, toStation: Station) {
    const journey = new Journey(this, toStation)
    this.checkIn(passenger, journey)
  }

  private checkIn(passenger: Passenger, journey: Journey) {
    const passengerCost = passenger.getBaseCost()
    const discount = getDiscount()

    const journeyCost = passengerCost - discount
    this.discount += discount

    try {
      passenger.makeJourney(journey, journeyCost)
    } catch (err) {
      if (err instanceof InsufficientBalanceError) {
        const rechargeAmount = journeyCost - passenger.getBalance()
        const serviceCharge = rechargeAmount * 0.02
        this.collection += serviceCharge

        passenger.recharge(rechargeAmount)

        passenger.makeJourney(journey, journeyCost)
      } else {
        throw err
      }
    }

    this.collection += journeyCost
    this.addPassenger(passenger)

    function getDiscount() {
      const isReturnJourney = passenger.isReturnJourney(journey)

      let discount = 0
      if (isReturnJourney) discount = passengerCost * 0.5
      return discount
    }
  }

  isSameAs(station: Station) {
    return this.name === station.name
  }

  getCollection() {
    return this.collection
  }

  printSummary() {
    console.log(`TOTAL_COLLECTION ${this.name} ${this.collection} ${this.discount}`)
    console.log(`PASSENGER_TYPE_SUMMARY`)
    Passenger.print(this.checkedInPassengers)
  }
}

export class CentralStation extends Station {
  constructor() {
    super('CENTRAL')
  }
}
export class AirportStation extends Station {
  constructor() {
    super('AIRPORT')
  }
}
