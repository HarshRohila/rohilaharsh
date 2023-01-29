import { Journey } from './Journey'
import { MetroCard } from './MetroCard'
import { Passenger } from './Passenger'
import { Station } from './Station'

export function main(fileContent: string) {
  const requests = new FileRequestsFactory(fileContent).createRequests()
}

// abstract class Request {
//   constructor(protected type: string) {}

//   getType() {
//     return this.type
//   }
// }

interface RequestsFactory {
  createRequests(): void
}

class FileRequestsFactory implements RequestsFactory {
  constructor(private fileContent: string) {}

  createRequests(): void {
    const lines = this.fileContent.split('\n')

    const metroCards: MetroCard[] = []
    const passengers: Passenger[] = []

    const airport = new AirportStation()
    const centralStation = new CentralStation()

    function getPassenger(passengerType: string, metroCardId: string) {
      const metroCard = metroCards.find(card => card.getId() === metroCardId)

      if (!metroCard) throw Error('card not found')

      const passenger = passengers.find(p => p.hasCard(metroCard))
      if (passenger) return passenger

      if (passengerType === 'ADULT') return new Adult(metroCard)
      else if (passengerType === 'SENIOR_CITIZEN') return new SeniorCitizen(metroCard)
      else return new Kid(metroCard)
    }

    return lines.forEach(l => {
      const [type, ...params] = l.split(' ')

      if (type === 'BALANCE') {
        metroCards.push(new MetroCard(params[0], +params[1]))
      } else if (type === 'CHECK_IN') {
        const passengerType = params[1]
        const metroCardId = params[0]
        const stationId = params[2]

        const passenger = getPassenger(passengerType, metroCardId)

        if (stationId === 'CENTRAL') {
          centralStation.checkIn(passenger, new Journey(centralStation, airport))
        } else {
          airport.checkIn(passenger, new Journey(airport, centralStation))
        }

        passengers.push(passenger)
      } else {
        // return new PrintSummaryRequest(type)
        console.log(centralStation.getCollection())
        console.log(airport.getCollection())
      }
    })
  }
}

// class BalanceRequest extends Request {
//   constructor(protected type: string, private metroCard: MetroCard) {
//     super(type)
//   }

//   // getMetroCardId() {
//   //   return this.metroCardId
//   // }

//   // getBalance() {
//   //   return this.balance
//   // }
// }

// class CheckInRequest extends Request {
//   constructor(protected type: string, private passenger: Passenger, private station: Station) {
//     super(type)
//   }
// }

// class PrintSummaryRequest extends Request {
//   constructor(protected type: string) {
//     super(type)
//   }
// }

class Adult extends Passenger {
  constructor(card: MetroCard) {
    super(card, 200)
  }
}
class Kid extends Passenger {
  constructor(card: MetroCard) {
    super(card, 50)
  }
}
class SeniorCitizen extends Passenger {
  constructor(card: MetroCard) {
    super(card, 100)
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
