import { Contract } from 'ethers'

export interface IContractMap {
  [k: string]: Contract
}

export interface IABIInputItem {
  indexed: boolean
  internalType: string
  name: string
  type: string
}

export interface IABIItem {
  anonymous: boolean
  inputs: IABIInputItem[]
  name: string
  type: string
}

export interface IEventHook {
  eventName: string
  eventArgs: string[]
  contract: Contract
  argus: any[]
  callback: (args: string[]) => void
}
