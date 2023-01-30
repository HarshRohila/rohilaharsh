import { MemoryInput } from './input/Input'
import { MetroCard } from './MetroCard'
import { MetroPassengerFactory, Passenger } from './Passenger'
import { AirportStation, CentralStation, Station } from './Station'

class Simulator {
  private metroCards: MetroCard[] = []
  private passengers: Passenger[] = []
  private airport = new AirportStation()
  private centralStation = new CentralStation()

  simulate(fileContent: string) {
    const input = new MemoryInput(fileContent)
    const requests = input.getRequests()

    return requests.forEach(l => {
      const [type, ...params] = l.split(' ')

      if (type === 'BALANCE') {
        this.handleBalanceRequest(params)
      } else if (type === 'CHECK_IN') {
        this.handleCheckInRequest(params)
      } else {
        this.handlePrintSummaryRequest()
      }
    })
  }

  private handleBalanceRequest(params: string[]) {
    const metroCard = new MetroCard(params[0], +params[1])
    this.metroCards.push(metroCard)
  }

  private getPassenger(passengerType: string, metroCardId: string) {
    const metroCard = this.getMetroCard(metroCardId)

    const passenger = this.passengers.find(p => p.hasCard(metroCard))
    if (passenger) return passenger

    return this.createNewPassenger(passengerType, metroCard)
  }

  private getMetroCard(metroCardId: string) {
    const metroCard = this.metroCards.find(card => card.getId() === metroCardId)
    if (!metroCard) throw Error('card not found')
    return metroCard
  }

  private createNewPassenger(passengerType: string, metroCard: MetroCard) {
    const passengerFactory = new MetroPassengerFactory(metroCard)
    const passenger = passengerFactory.create(passengerType)

    this.passengers.push(passenger)

    return passenger
  }

  private handleCheckInRequest(params: string[]) {
    const passengerType = params[1]
    const metroCardId = params[0]
    const stationId = params[2]

    const passenger = this.getPassenger(passengerType, metroCardId)

    this.checkInPassenger(stationId, passenger)
  }

  private checkInPassenger(stationId: string, passenger: Passenger) {
    let fromStation: Station
    let toStation: Station

    if (stationId === 'CENTRAL') {
      fromStation = this.centralStation
      toStation = this.airport
    } else {
      fromStation = this.airport
      toStation = this.centralStation
    }

    fromStation.makeJourney(passenger, toStation)
  }

  private handlePrintSummaryRequest() {
    this.centralStation.printSummary()
    this.airport.printSummary()
  }
}

export function main(fileContent: string) {
  new Simulator().simulate(fileContent)
}
