import { Journey } from './Journey'
import { MetroCard } from './MetroCard'

export abstract class Passenger {
  protected todayJourneys: Journey[]
  constructor(protected metroCard: MetroCard, protected baseCost: number) {
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

  calculateJourneyCost(journey: Journey) {
    let baseCost = this.baseCost

    const returnJourney = journey.getReturnJourney()
    const isReturnJourney = this.getTodaysJourneys().some(journey =>
      journey.isSameAs(returnJourney)
    )

    if (isReturnJourney) baseCost = 0.5 * baseCost

    return baseCost
  }
}
