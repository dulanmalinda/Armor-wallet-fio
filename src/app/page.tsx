'use client'

import Header from './components/Header'
import Footer from './components/Footer'
import Walletconnect from './components/Walletconnect'
import Info from './components/Info'

import { useRef, useEffect, useState } from 'react';
import Reginput from './components/Reginput'

const apiURL = "https://prompt.armorwallet.ai/api/";

interface Prompt {
  walletAddress: string;
  prompt: string;
  upVoteCount: number;
  downVoteCount: number;
  upVotedWallets: string[];
  downVotedWallets: string[];
}

const Page = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [btnDistanceFromTop, setBtnDistanceFromTop] = useState<number | null>(0);
  const [renderBtns, setRenderBtns] = useState<boolean>(false);



  return (
    <>
    <div className="flex flex-col min-h-screen inter.variable">
      <Header></Header>
      
      <div className="flex hideOnMobile min-h-screen">
        <div className="flex-custom-1-2 flex justify-end">
          <div style={{position:"absolute",top:`${btnDistanceFromTop}px`}}>
            {
              renderBtns? 
              <Walletconnect setWalletAddress={setWalletAddress} baseApiURL={apiURL} />
              : ''
            }
          </div>
        </div>
        <div className="flex-custom-2-3">
          
          <Info setBtnDistanceFromTop={setBtnDistanceFromTop} setRenderBtns={setRenderBtns} isDesktop={true}/> 

          <Reginput/>

        </div>
        <div className="flex-custom-1-2 flex justify-start">
          
        </div>
      </div>


      <div className="flex-1 flex flex-col gap-4 p-4 hideOnDesktop">

          <Info setBtnDistanceFromTop={setBtnDistanceFromTop} setRenderBtns={setRenderBtns} isDesktop={false}/>

          <Walletconnect setWalletAddress={setWalletAddress} baseApiURL={apiURL} />
        
            
      </div>
      
      <Footer/>
      </div>
    </>
  )
}

export default Page