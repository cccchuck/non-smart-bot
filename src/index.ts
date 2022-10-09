import { getContractABI } from './api'
import {
  contractOn,
  getContract,
  getContractEvent,
  getContractEventArgs,
  getContractEventList,
} from './api/contract'
import { IEventHook } from './types'
import bot from './utils/bot'

async function main() {
  const ABI = await getContractABI('0xdAC17F958D2ee523a2206206994597C13D831ec7')
  const USDT = await getContract(
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    ABI
  )

  const event = getContractEvent(ABI)
  const eventList = getContractEventList(event)
  const eventArgs = getContractEventArgs('Transfer', event)

  if (USDT) {
    contractOn('Transfer', eventArgs, USDT, (args) => {
      bot.sendRichText('NFT', args)
    })
  }
  // const abi = await getContractABI('0xd0d1be9a388c26b1847b52f8b1b5108d8f97aef3')
  // const event = getContractEvent(abi)
  // const eventList = getContractEventList(event)
  // console.log(eventList)
}

main()
