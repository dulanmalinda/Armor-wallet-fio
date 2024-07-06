import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import regCircle from '../assets/regpanel/regCircle.svg'
import FioHandle from '../components/FioHandle'
import Captcha from './Captcha';
import { useActiveAccount } from 'thirdweb/react';

interface InfoProps {
  walletAddress: string | null
  armorHandle: string | null
  setArmorhandle: (newValue: string) => void;
  baseApiURL:String;
}

const Reginput = ({walletAddress,armorHandle,setArmorhandle,baseApiURL}:InfoProps) => {
   const [nameInput, setnameInput] = useState<string>("");

  const contentElementRef = useRef<HTMLDivElement>(null);
  const [heightContent, setHeightContent] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const [inputEnabled, setInputEnabled] = useState(true);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [signature, setSignature] = useState("");
  const activeAccount = useActiveAccount();

  const handleChange = (e: { target: { value: any; }; }) => {
    const input = e.target.value;
    const characterLimit = 100; 

    if (input.length <= characterLimit) {
        setnameInput(input);
    } else {
      // alert(`Word limit of ${wordLimit} exceeded`);
    }
  };

  const handleSignMessage = async () => {
    if (!nameInput) {
      alert('Please enter a handle to sign.');
      return;
    }

    setIsLoading(true);
    setInputEnabled(false);

    try {
      const signature = await activeAccount?.signMessage({message:"Confirm you armor handle"});

      if(signature)
      {
        setSignature(signature?.toString());
      }

    } catch (error) {
      console.error("Error signing message:", error);
      setIsLoading(false);
    }
  }; 

  useEffect(() => {
    if (contentElementRef.current) {
      setHeightContent(contentElementRef.current.offsetHeight + 30);
    }
  }, [armorHandle,walletAddress]);

  useEffect(() => {
    if (!walletAddress) {
      if(nameInput){
        setnameInput("");
      }

      if(requestSuccess){
        setRequestSuccess(false);
      }

      if(hasRequested){
        setHasRequested(false);
      }

      setCaptchaToken(null);
    }
  }, [walletAddress]);

  const togglePopUp  = () =>{
    setShowPopup((prevState) => !prevState);
}

  return (
    <>
        <div className="flex flex-row items-start p-4 pt-0 sm:pt-4 max-w-full sm:max-w-3xl">
          <div className="flex-shrink-0 flex flex-row items-start">

            <div className="flex items-center">
                <div className="w-5 h-5 mb-0 mr-2 cursor-pointer hideOnMobile" >
                    
                </div>
                <div className="w-5 h-5 mb-0 " style={{marginRight:"0.2rem"}} >

                </div>
                {/* <span className="font-bold mx-2 sm:mx-0 sm:ml-2 text-gray-500 text-lg" style={{ width: '40px', display: 'inline-block', textAlign: 'right' }}>
                    
                </span> */}
                <span className="mx-1 sm:mx-0 sm:ml-2 flex justify-end" style={{ width: '2rem'}}>
                    <Image src={regCircle} alt="reg circle" style={{width:"1.25rem",height:"1.25rem",marginTop:"0.25rem"}}/>
                </span>
            </div>

            <div
            className=""
            style={{
                width: '2px',
                height: `${heightContent}px`,
                backgroundColor: 'black',
                marginTop: '0.5vh',
                marginLeft : '0.5vw'
            }}
            />
            </div>
          <div className="ml-4 mt-0" ref={contentElementRef}>
              <div className="flex flex-col items-Start">
                <span style={{fontSize:"1rem",fontWeight:"400",marginBottom:"1rem"}}>
                    {
                      armorHandle?
                      "Your @armor handle"
                      :
                      "Register your @armor handle"
                    }
                </span>
                
                  <div className="items-center">
                    <Captcha isOpen={showPopup} onClose={togglePopUp} armorHandle={armorHandle} captchaToken={captchaToken} setCaptchaToken={setCaptchaToken} handleSignMessage={handleSignMessage} />
                  </div>

                <div className={`${armorHandle ? "hidden":""} flex justify-start items-center`}>
                    <input disabled={!inputEnabled} type="text" className="hideOnMobile border border-black p-2 text-right focus:outline-none" style={{width:"18rem",height:"2.5rem"}} placeholder="myname" onChange={handleChange} value={nameInput}/>
                    <input disabled={!inputEnabled} type="text" className="hideOnDesktop border border-black p-2 text-right focus:outline-none" style={{width:"10rem",height:"2.5rem"}} placeholder="myname" onChange={handleChange} value={nameInput}/>

                    <span style={{fontSize:"1rem",fontWeight:"700",marginLeft:"0.5rem"}}>
                      @armor
                    </span>
                    <FioHandle 
                      togglePopUp={togglePopUp}
                      signature={signature}
                      setSignature={setSignature}
                      handleSignMessage={handleSignMessage}
                      setInputEnabled={setInputEnabled}
                      nameInput={nameInput} setnameInput={setnameInput}
                      armorHandle={armorHandle} setArmorhandle={setArmorhandle}
                      walletAddress={walletAddress} 
                      isLoading={isLoading} setIsLoading={setIsLoading} 
                      hasRequested={hasRequested} setHasRequested={setHasRequested} 
                      requestSuccess={requestSuccess}  setRequestSuccess={setRequestSuccess}
                      baseApiURL={baseApiURL}
                      captchaToken={captchaToken}/>
                </div>

                <div className={`${armorHandle ? "":"hidden"} flex justify-start items-center`} style={{fontSize:"2.25rem",fontWeight:"400"}}>
                    {armorHandle}
                </div>

              </div>
          </div>
        </div>
    </>
  )
}

export default Reginput