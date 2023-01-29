import { Journey } from './Journey'
import { MetroCard } from './MetroCard'

export abstract class Passenger {
  protected todayJourneys: Journey[]
  constructor(protected metroCard: MetroCard, protected baseCost: number, protected type) {
    this.todayJourneys = []
  }

  getBalance() {
    return this.metroCard.getBalance()
  }

  makeJourney(journey: Journey, cost: number) {
    this.metroCard.deductMoney(cost)
    this.todayJourneys.push(journey)
  }

  getTodaysJourneys() {
    return this.todayJourneys
  }

  recharge(amount: number) {
    this.metroCard.recharge(amount)
  }

  hasCard(card: MetroCard) {
    return this.metroCard.isSameAs(card)
  }

  isReturnJourney(journey: Journey) {
    const returnJourney = journey.getReturnJourney()
    const isReturnJourney = this.getTodaysJourneys().some(journey =>
      journey.isSameAs(returnJourney)
    )
    return isReturnJourney
  }

  isSameAs(passenger: Passenger) {
    return this.metroCard.isSameAs(passenger.metroCard)
  }

  getBaseCost() {
    return this.baseCost
  }

  static print(passengers: Passenger[]) {
    const groupedByType = passengers.reduce((acc, p) => {
      const list = acc[p.type]
      if (list) list.push(p)
      else acc[p.type] = [p]
      return acc
    }, {} as Record<string, Passenger[]>)

    Object.entries(groupedByType).forEach(([type, passengers]) => {
      console.log(type, ' ', passengers.length)
    })
  }
}
