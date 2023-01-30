import { MetroCard } from './MetroCard'
import { MetroPassengerFactory, Passenger, PassengerFactory } from './Passenger'
import { MetroStation, Station } from './Station'
import { DISCOUNT_PERCENT, TRANSACTION_FEE_PERCENT } from './constants'

describe('Station', () => {
  let fromStation: Station
  let toStation: Station
  beforeEach(() => {
    fromStation = new MetroStation('Pune')
    toStation = new MetroStation('Delhi')
  })

  describe('makeJourney', () => {
    it('charges station fee if metro card not having enough balance', () => {
      const balance = 150
      const passenger = createPassenger({ balance })

      fromStation.makeJourney(passenger, toStation)

      const cost = passenger.getBaseCost()
      const expectedFee = (cost - balance) * TRANSACTION_FEE_PERCENT
      expect(fromStation.getCollection()).toBe(cost + expectedFee)
    })
  })
})

describe('Return Journey', () => {
  let passenger: Passenger
  let fromStation: Station
  let toStation: Station

  beforeAll(() => {
    fromStation = new MetroStation('Pune')
    toStation = new MetroStation('Delhi')

    passenger = createPassenger()
    passenger.isReturnJourney = jest.fn().mockReturnValue(true)
  })

  it('applies discount if return journey', () => {
    fromStation.makeJourney(passenger, toStation)

    const expectedDiscount = passenger.getBaseCost() * DISCOUNT_PERCENT
    expect(fromStation.getDiscount()).toBe(expectedDiscount)
  })

  // it('does NOt apply return journey discount if travlled 3rd time', () => {
  //   fromStation.makeJourney(passenger, toStation)

  // })
})

function createPassenger({ balance } = { balance: 200 }) {
  const metroCard = new MetroCard('mc1', balance)
  const passengerFactory: PassengerFactory = new MetroPassengerFactory(metroCard)
  const passenger = passengerFactory.create('ADULT')
  return passenger
}
