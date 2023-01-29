import { Journey } from './Journey'
import { MetroCard } from './MetroCard'
import { Passenger } from './Passenger'
import { Station } from './Station'

class Simulator {
  private metroCards: MetroCard[] = []
  private passengers: Passenger[] = []
  private airport = new AirportStation()
  private centralStation = new CentralStation()

  simulate(fileContent: string) {
    const lines = fileContent.split('\n')

    return lines.forEach(l => {
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
    const metroCard = this.metroCards.find(card => card.getId() === metroCardId)
    if (!metroCard) throw Error('card not found')

    const passenger = this.passengers.find(p => p.hasCard(metroCard))
    if (passenger) return passenger

    return this.createNewPassenger(passengerType, metroCard)
  }

  private createNewPassenger(passengerType: string, metroCard: MetroCard) {
    let passenger: Passenger

    if (passengerType === 'ADULT') passenger = new Adult(metroCard)
    else if (passengerType === 'SENIOR_CITIZEN') passenger = new SeniorCitizen(metroCard)
    else passenger = new Kid(metroCard)

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
    if (stationId === 'CENTRAL') {
      this.centralStation.checkIn(passenger, new Journey(this.centralStation, this.airport))
    } else {
      this.airport.checkIn(passenger, new Journey(this.airport, this.centralStation))
    }
  }

  private handlePrintSummaryRequest() {
    this.centralStation.printSummary()
    this.airport.printSummary()
  }
}

export function main(fileContent: string) {
  new Simulator().simulate(fileContent)
}

class Adult extends Passenger {
  constructor(card: MetroCard) {
    super(card, 200, 'ADULT')
  }
}
class Kid extends Passenger {
  constructor(card: MetroCard) {
    super(card, 50, 'KID')
  }
}
class SeniorCitizen extends Passenger {
  constructor(card: MetroCard) {
    super(card, 100, 'SENIOR_CITIZEN')
  }
}

class CentralStation extends Station {
  constructor() {
    super('CENTRAL')
  }
}
class AirportStation extends Station {
  constructor() {
    super('AIRPORT')
  }
}
