import { MetroCard } from './MetroCard'
import { MetroPassengerFactory, PassengerFactory } from './Passenger'
import { MetroStation, Station } from './Station'

describe('Station', () => {
  describe('makeJourney', () => {
    let fromStation: Station
    let toStation: Station
    beforeEach(() => {
      fromStation = new MetroStation('Pune')
      toStation = new MetroStation('Delhi')
    })

    it('applies discount if return journey', () => {
      const passenger = createPassenger()
      passenger.isReturnJourney = jest.fn().mockReturnValue(true)

      fromStation.makeJourney(passenger, toStation)

      const expectedDiscount = passenger.getBaseCost() / 2
      expect(fromStation.getDiscount()).toBe(expectedDiscount)
    })

    it('charges station fee if metro card not having enough balance', () => {
      const balance = 150
      const passenger = createPassenger({ balance })

      fromStation.makeJourney(passenger, toStation)

      const cost = passenger.getBaseCost()
      const expectedFee = (cost - balance) * 0.02
      expect(fromStation.getCollection()).toBe(cost + expectedFee)
    })
  })
})

function createPassenger({ balance } = { balance: 200 }) {
  const metroCard = new MetroCard('mc1', balance)
  const passengerFactory: PassengerFactory = new MetroPassengerFactory(metroCard)
  const passenger = passengerFactory.create('ADULT')
  return passenger
}
