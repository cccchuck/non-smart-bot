import Request from '../../utils/request'
import dotenv from 'dotenv'
import { resolve } from 'path'
import { Contract, ethers } from 'ethers'
import type { IContractMap, IABIItem, IEventHook } from '../../types/index'

// load variable
dotenv.config({ path: resolve(__dirname, '../../../.env') })

const request = new Request()
const { Provider, Etherscan_Key } = process.env

const provider = new ethers.providers.JsonRpcProvider(Provider)
const contractMap: IContractMap = {}

async function getContract(
  address: string,
  abi?: string
): Promise<Contract | null> {
  // Return Cache
  if (contractMap[address]) return contractMap[address]

  // No ABI Pass
  if (!abi) abi = await getContractABI(address)
  // No Open Source
  if (!abi) return null

  // Set Cache
  const contract = new ethers.Contract(address, abi, provider)
  contractMap[address] = contract
  return contract
}

async function getContractABI(address: string): Promise<string> {
  let abi: string = ''

  try {
    const resp = await request.get(
      `/api?module=contract&action=getabi&address=${address}&apikey=${Etherscan_Key}`
    )

    abi = resp.data.result
  } catch (error) {
    console.log((error as Error).message)
  }

  return abi
}

/**
 * Get Contract Event Detail List
 * @param abi Contract ABI
 * @returns
 */
function getContractEvent(abi: string): IABIItem[] {
  const ABI: IABIItem[] = JSON.parse(abi)
  return ABI.filter((item: IABIItem) => item.type === 'event')
}

/**
 * Get Contract Event Name List
 * @param event Contract Event Detail List
 * @returns
 */
function getContractEventList(events: IABIItem[]): string[] {
  const result: string[] = []
  events.forEach((item) => result.push(item.name))
  return result
}

function getContractEventArgs(eventName: string, events: IABIItem[]): string[] {
  const result: string[] = []
  const eventItem = events.find((item) => item.name === eventName)
  const eventInputs = eventItem?.inputs
  eventInputs?.forEach((input) => result.push(input.name))
  return result
}

function contractOn(
  eventName: string,
  eventArgs: string[],
  contract: Contract,
  callback: (args: string[]) => void,
  hook?: (info: IEventHook) => void
) {
  contract.on(eventName, (...argus) => {
    if (!hook) {
      const capitalize = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1)

      let title = `⏰ ${eventName} 有动静了`
      let content = ''
      let url = ''

      const tx = argus.pop()
      const hash: string = tx.transactionHash
      const args: [] = tx.args

      content += `Hash: ${hash}\\n\\n`
      args.forEach((v, i) => {
        content += `${capitalize(eventArgs[i])}: ${v}\\n\\n`
      })

      url = `https://etherscan.io/tx/${hash}`

      callback([title, content, url])
    } else {
      hook({ eventName, eventArgs, contract, argus, callback })
    }
  })
}

export {
  getContract,
  getContractABI,
  getContractEvent,
  getContractEventList,
  getContractEventArgs,
  contractOn,
}
