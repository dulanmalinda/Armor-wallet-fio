'use client'

import { useRef, useEffect, useState } from 'react';
import { ConnectButton, darkTheme, AutoConnect } from 'thirdweb/react';
import { createWallet} from "thirdweb/wallets";
import { createThirdwebClient,defineChain } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import Image from 'next/image'
import connectCircle from '../assets/walletConnect/circle_walletConnect.svg'
import connectTick from '../assets/walletConnect/tick_walletConnect.svg'

interface WalletconnectProps {
  setWalletAddress: (newValue: string | null) => void;
  baseApiURL:string;
  setArmorhandle: (newValue: string ) => void;
  setUser: (newValue: any) => void;
  setExisitingHandledChecked: (newValue: any) => void;
}

const Walletconnect = ({ setWalletAddress,baseApiURL,setArmorhandle,setUser,setExisitingHandledChecked}: WalletconnectProps) => {
  const [connectedChainId, setConnectedChainId] = useState(0);
  
  const contentElementRef = useRef<HTMLDivElement>(null);
  const [heightContent, setHeightContent] = useState(0);

  const contentElementMobileRef = useRef<HTMLDivElement>(null);
  const [heightContentMobile, setHeightContentMobile] = useState(0);

  const connectedChain = defineChain(connectedChainId);

  const activeAccount = useActiveAccount();

  const client = createThirdwebClient({
    clientId: "08619b8bbdba4199b603733acf52c24c",
  });

  const wallets = [
    createWallet("io.metamask"),
    createWallet("me.rainbow"),
    createWallet("com.trustwallet.app"),
    createWallet("com.coinbase.wallet"),
    createWallet("walletConnect"),
  ];

    const onConnected = (addr:string = "",chainId = 0) =>{
        setWalletAddress(addr);
        setConnectedChainId(chainId);
        fetchUser(addr);
    }

    const onDisconnected = () =>{
      setWalletAddress("");
      setConnectedChainId(0);
      setExisitingHandledChecked(false);
  }

    const truncateText = (text: string, maxLength: number) => {
      if (text.length > maxLength) {
          const halfLength = Math.floor(maxLength / 2);
          const firstHalf = text.substring(0, halfLength);
          const secondHalf = text.substring(text.length - halfLength);
          return firstHalf + '...' + secondHalf;
      }
      return text;
  };

  
  useEffect(() => {
    if(activeAccount?.address){
      setWalletAddress(activeAccount?.address);
    }
  }, [activeAccount?.address]);

  useEffect(() => {
    if (contentElementRef.current) {
      setHeightContent(contentElementRef.current.offsetHeight + 20);
    }
    if (contentElementMobileRef.current) {
      setHeightContentMobile(contentElementMobileRef.current.offsetHeight + 20);
    }
  }, []);

  const fetchUser = (addr:String) => {
    fetch(`${baseApiURL}user/${addr}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setArmorhandle(data.fioUsername);
        setExisitingHandledChecked(true);
      });
  };

  const customRender = () => {
    return (
      <button className='flex bg-[#BDFF6A] transition-colors duration-300 ease-in-out hover:bg-[#D9FFA3]' 
          style={{
            fontSize:"1rem",
            width:"10.66rem",
            height:"3rem",
            borderRadius:"1px", 
            alignItems:"center",
            justifyContent:"center",
            fontWeight:"600"
          }}
        >
          {
            activeAccount?.address ? truncateText(activeAccount.address,8) : ""
          }  
        <Image src={connectTick} alt="wallet connected tick" style={{marginLeft:"0.5rem"}} />
      </button>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start max-w-full sm:max-w-3xl hideOnMobile">
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-start">
              <div className="flex items-center">
              <div className="w-5 h-5 mb-1 sm:mb-0 mr-2 cursor-pointer" >
                  
              </div>
              <div className="w-5 h-5 mb-1 sm:mb-0  cursor-pointer" style={{marginRight:"0.2rem"}}>
                  
              </div>
              {/* <span className="font-bold mx-2 sm:mx-0 sm:ml-2 text-gray-500 text-lg" style={{ width: '40px', display: 'inline-block', textAlign: 'right' }}>
                  
              </span> */}
              <span className="sm:mt-2" style={{width:"0.938rem",height:"0.938rem"}}>
                <Image src={connectCircle} alt="connect circle" layout="responsive" loading='lazy'/>
              </span>
              </div>
              <div 
              style={{
                  width: '2px',
                  height: `${heightContent}px`,
                  backgroundColor: 'black',
                  marginTop: '0.5vh',
                  marginLeft : '0.5vw',
                  marginRight:"0.8vw",
              }}
              />
          </div>
          <div className="mt-2 sm:mt-1" ref={contentElementRef}>
            <div className="flex items-center mb-3">
              <span style={{fontSize:"1rem",fontWeight:"400"}}>
                Connect your wallet
              </span>
            </div>
            <ConnectButton
                connectButton={{
                  label: "Connect Wallet",
                  className: "bg-[#FFFFFF] hover:bg-[#000000] hover:text-white",
                  style: {
                    borderRadius: "1px",
                    outline: "1px solid black",
                    fontSize:"1rem",
                    width:"10.66rem",
                    height:"3rem",
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                  },
                }}
                
                client={client} 

                wallets={wallets} 

                theme={darkTheme({
                  colors: {
                      primaryButtonBg: "#FFFFFF",
                    }
                })}

                onConnect={(wallet) => onConnected(wallet.getAccount()?.address,wallet.getChain()?.id)}

                onDisconnect={onDisconnected}

                autoConnect = {{timeout : 20000}}

                connectModal={{ 
                  size:  "compact",
                  showThirdwebBranding:false
                }}

                detailsButton={{
                  style: { 
                    borderRadius: "1px",
                    backgroundColor: "#BDFF6A",
                    color:"black"
                  },
                  render: customRender
                }}
                
                detailsModal={{
                  payOptions:{
                    buyWithCrypto: false,
                    buyWithFiat:false,
                    prefillBuy: {
                      allowEdits: { amount: true, chain: false, token: false },
                      chain: connectedChain,
                    },
                  }
                }}
            />
          </div>
      </div>


      <div className="flex flex-row items-start p-4 p-4 pt-0 sm:pt-4 max-w-full sm:max-w-3xl hideOnDesktop">
            <div className="flex-shrink-0 flex flex-row items-start">

                <div className="flex items-center">
                    <div className="w-5 h-5 mb-0 mr-2 cursor-pointer hideOnMobile" >
                        
                    </div>
                    <div className="w-5 h-5 mb-0 " style={{marginRight:"0.2rem"}} >
                        
                    </div>
                    {/* <span className="font-bold mx-2 sm:mx-0 sm:ml-2 text-gray-500 text-lg" style={{ width: '40px', display: 'inline-block', textAlign: 'right' }}>
                        
                    </span> */}
                    <span className="mx-1 sm:mx-0 sm:ml-2 " style={{ width: '2rem', display: 'flex', justifyContent: 'flex-end',fontSize:"1rem",fontWeight:"900"}}>
                      <Image src={connectCircle} alt="connect circle" style={{width:"1.2rem",height:"rem"}}  loading='lazy'/>
                    </span>
                </div>

                <div
                className=""
                style={{
                    width: '2px',
                    height: `${heightContentMobile}px`,
                    backgroundColor: 'black',
                    marginTop: '0.5vh',
                    marginLeft : '0.5vw'
                }}
                />
            </div>
            <div className="ml-4 mt-0" ref={contentElementMobileRef}>
                <div className="flex items-center">
                <span style={{fontSize:"1rem",fontWeight:"400", marginBottom:"0.8rem"}}>
                  Connect your wallet
                </span>
                </div>
                <ConnectButton
                connectButton={{
                  label: "Connect Wallet",
                  className: "bg-[#FFFFFF] hover:bg-[#000000] hover:text-white",
                  style: {
                    borderRadius: "1px",
                    outline: "1px solid black",
                    fontSize:"1rem",
                    width:"10.66rem",
                    height:"3rem",
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                  },
                }}
                
                client={client} 

                wallets={wallets} 

                theme={darkTheme({
                  colors: {
                      primaryButtonBg: "#FFFFFF",
                    }
                })}

                onConnect={(wallet) => onConnected(wallet.getAccount()?.address,wallet.getChain()?.id)}

                onDisconnect={onDisconnected}

                autoConnect = {true}

                connectModal={{ 
                  size:  "compact",
                  showThirdwebBranding:false
                }}

                detailsButton={{
                  style: { 
                    borderRadius: "1px",
                    backgroundColor: "#BDFF6A",
                    color:"black"
                  },
                  render: customRender
                }}
                
                detailsModal={{
                  payOptions:{
                    buyWithCrypto: false,
                    buyWithFiat:false,
                    prefillBuy: {
                      allowEdits: { amount: true, chain: false, token: false },
                      chain: connectedChain,
                    },
                  }
                }}
            />
            </div>
        </div>
    </>
  )
}

export default Walletconnect