import { DISCOUNT_PERCENT, TRANSACTION_FEE_PERCENT } from './constants'
import { Journey } from './Journey'
import { Passenger } from './Passenger'

export class PassengerJourney {
  constructor(private passenger: Passenger, private journey: Journey) {}

  getDiscount() {
    const { passenger, journey } = this

    const passengerCost = passenger.getBaseCost()
    const isReturnJourney = passenger.isReturnJourney(journey)

    let discount = 0
    if (isReturnJourney) discount = passengerCost * DISCOUNT_PERCENT
    return discount
  }

  rechargeAndDoJourney() {
    const { passenger } = this
    const rechargeAmount = this.getRechargeAmount()
    passenger.recharge(rechargeAmount)
    this.makeJourney()
  }

  getServiceCharge() {
    const rechargeAmount = this.getRechargeAmount()
    const serviceCharge = rechargeAmount * TRANSACTION_FEE_PERCENT

    return serviceCharge
  }

  getRechargeAmount() {
    const { passenger } = this
    const journeyCost = this.getJourneyCost()
    const rechargeAmount = journeyCost - passenger.getBalance()
    return rechargeAmount
  }

  makeJourney() {
    const { passenger, journey } = this
    const journeyCost = this.getJourneyCost()
    passenger.makeJourney(journey, journeyCost)
  }

  getJourneyCost() {
    const { passenger } = this

    const passengerCost = passenger.getBaseCost()
    const discount = this.getDiscount()
    const journeyCost = passengerCost - discount

    return journeyCost
  }
}
