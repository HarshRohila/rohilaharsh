import { Journey } from './Journey'
import { InsufficientBalanceError } from './MetroCard'
import { Passenger } from './Passenger'

export abstract class Station {
  protected collection: number
  protected discount: number
  protected name: string

  constructor(name: string) {
    this.collection = 0
    this.discount = 0
    this.name = name
  }

  checkIn(passenger: Passenger, journey: Journey) {
    const journeyCost = passenger.calculateJourneyCost(journey)

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
  }

  isSameAs(station: Station) {
    return this.name === station.name
  }

  getCollection() {
    return this.collection
  }
}
