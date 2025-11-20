// src/types.ts
export interface IPublicKey {
    type: number
    keyType: string
    purpose: string
    securityLevel: string
    contractBounds: anystring
    dataBytes: string | null
    readOnly: boolean
    disabledAt: boolean
}
export interface IIdentity {
    idx: number
    publicKeys: IPublicKey[]
}
