declare module '@fioprotocol/fiosdk' {
    export class FIOSDK {
      constructor(privateKey: string, publicKey: string, baseUrl: string);
  
      publicKey: string;
      static createPrivateKeyMnemonic(mnemonic: string): string;
      static createPublicKey(privateKey: string): string;
      static validateMnemonic(mnemonic: string): boolean;
      static convertToFIOPubKey(publicKey: string): string;
      genericAction(action: string, params: any): Promise<any>;
    }
  }