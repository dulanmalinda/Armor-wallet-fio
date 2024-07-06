'use client'

import Header from './components/Header'
import Footer from './components/Footer'
import Walletconnect from './components/Walletconnect'
import Info from './components/Info'

import { useRef, useEffect, useState } from 'react';
import Reginput from './components/Reginput'

const apiURL = "https://armorfio-server.vercel.app/api/";

const Page = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [btnDistanceFromTop, setBtnDistanceFromTop] = useState<number | null>(0);
  const [renderBtns, setRenderBtns] = useState<boolean>(false);

  const [user, setUser] = useState<any>();
  const [exisitingHandledChecked, setExisitingHandledChecked] = useState(false);

  const [armorHandle,setArmorhandle] = useState("");

  useEffect(() => {
    if(!walletAddress){
      if(user){
        setUser("");
      }

      if(armorHandle){
        setArmorhandle("");
      }
    }
  }, [walletAddress]);

  return (
    <>
    <div className="flex flex-col min-h-screen inter.variable">
      <Header></Header>
      
      <div className="flex hideOnMobile min-h-screen">
        <div className="flex-custom-1-2 flex justify-end">
          <div style={{position:"absolute",top:`${btnDistanceFromTop}px`}}>
            {
              renderBtns? 
              <Walletconnect setWalletAddress={setWalletAddress}  baseApiURL={apiURL} setArmorhandle={setArmorhandle} setUser={setUser} setExisitingHandledChecked={setExisitingHandledChecked}/>
              : ''
            }
          </div>
        </div>
        <div className="flex-custom-2-8">
          
          <Info setBtnDistanceFromTop={setBtnDistanceFromTop} setRenderBtns={setRenderBtns} isDesktop={true}/> 

          <Reginput walletAddress={walletAddress} armorHandle={armorHandle} setArmorhandle={setArmorhandle}  baseApiURL={apiURL} exisitingHandledChecked={exisitingHandledChecked}/>

        </div>
        <div className="flex-custom-0-4">

        </div>
      </div>


      <div className="flex-1 flex flex-col gap-4 p-4 hideOnDesktop">

          <Info setBtnDistanceFromTop={setBtnDistanceFromTop} setRenderBtns={setRenderBtns} isDesktop={false}/>

          <Walletconnect setWalletAddress={setWalletAddress} baseApiURL={apiURL} setArmorhandle={setArmorhandle} setUser={setUser} setExisitingHandledChecked={setExisitingHandledChecked}/>
        
          <Reginput walletAddress={walletAddress} armorHandle={armorHandle} setArmorhandle={setArmorhandle}  baseApiURL={apiURL} exisitingHandledChecked={exisitingHandledChecked}/>
            
      </div>
      
      <Footer/>
      </div>
    </>
  )
}

export default Page