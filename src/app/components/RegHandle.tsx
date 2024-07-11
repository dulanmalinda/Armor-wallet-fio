import React, {useEffect,useState} from 'react'
import { useActiveAccount } from "thirdweb/react";
import { useSendTransaction } from "thirdweb/react";
import { defineChain, sendAndConfirmTransaction,createThirdwebClient } from "thirdweb";
import { prepareTransaction, toWei } from "thirdweb";
import ClipLoader from "react-spinners/ClipLoader";
import emojiRegex from 'emoji-regex';
import Spinner from './Utils/Spinner';

interface RegHandleProps {
  togglePopUp: () => void;
  signature: string;
  setSignature: (newValue: string ) => void;
  setInputEnabled: (newValue: boolean ) => void;
  nameInput: string;
  setnameInput: (newValue: string ) => void;
  armorHandle: string|null;
  setArmorhandle: (newValue: string ) => void;
  walletAddress: string|null;
  isLoading: boolean;
  setIsLoading: (newValue: boolean ) => void;
  hasRequested: boolean;
  setHasRequested: (newValue: boolean ) => void;
  requestSuccess: boolean;
  setRequestSuccess: (newValue: boolean ) => void;
  baseApiURL: String;
  captchaToken: string|null;
  error:string|null;
  setError:(newValue: string|null ) => void;
}

const RegHandle = ({
        togglePopUp,
        signature,
        setSignature,
        setInputEnabled,
        nameInput,
        setnameInput,
        armorHandle,
        setArmorhandle,
        walletAddress,
        isLoading, 
        setIsLoading,
        hasRequested,
        setHasRequested,
        requestSuccess,
        setRequestSuccess,
        baseApiURL,
        captchaToken,
        error,
        setError
      }:RegHandleProps) => {

    const [result, setResult] = useState(null);

    const [showRequestStat, setShowRequestStat] = useState(false);

    const activeAccount = useActiveAccount();

    const client = createThirdwebClient({
        clientId: "08619b8bbdba4199b603733acf52c24c",
      });

    const textToHex = (text: string) => {
      const _handle = text + "@armor"
      return _handle
        .split('')
        .map((char) => char.charCodeAt(0).toString(16))
        .join('');
    };

    const containsSentence = (input: string, sentence: string): boolean => {
      const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();
    
      const normalizedInput = normalize(input);
      const normalizedSentence = normalize(sentence);
    
      return normalizedInput.includes(normalizedSentence);
    };
      
    const sendTransaction = async (username:string) => {
      try {
        const transaction = prepareTransaction({
          to: activeAccount?.address,
          value: toWei("0"),
          chain: defineChain(8453),
          data: `0x${textToHex(username)}`,
          client:client,
        });
        
        if(activeAccount){
            const receipt = await sendAndConfirmTransaction({
                transaction,
                account: activeAccount,
          });

          saveUser(receipt.transactionHash);
        }
      }
      catch (err:any){
        setIsLoading(false);
        setInputEnabled(true);

        if(containsSentence(err.message,"user rejected") || containsSentence(err.message,"user denied"))
        {
          setError("User rejected the request");
        }
        else
        {
          setError(err.message);
        }

        setRequestSuccess(false);
      }
    };

    const saveUser = async (tnxHash:string) => {
        const fioUsername = `${nameInput}@armor`;
    
        const res = await fetch(`${baseApiURL}user/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "fioUsername":fioUsername,"walletAddress":walletAddress,"tnxHash":tnxHash}),
        });
    
      const data = await res.json(); 
      
      if(error)
      {
        setError(null);
      }

      setRequestSuccess(true);
      setIsLoading(false);
    }
  

    const checkUsernameAvailability = () => {
      setIsLoading(true);
      setInputEnabled(false);
      setHasRequested(true);

      fetch(`${baseApiURL}checkUsernameAvailability/${nameInput}@armor`)
        .then((response) => response.json())
        .then((data) => {
            if(data.available)
            {
              sendTransaction(nameInput);
            }
            else
            {
              setIsLoading(false);
              setInputEnabled(true);

              setError("Handle is already taken.");

              setRequestSuccess(false);
            }
        });
    };

    const inputValidate = () => {
      if (error) {
        setError(null);
      }
    
      // Regex for letters, numbers, dots, dashes, and underscores (excluding spaces)
      const baseRegex = /^[a-zA-Z0-9._-]+$/;
    
      // Get the emoji regex
      const regex = emojiRegex();
    
      // Check if the value matches the base regex or contains emojis
      let isBaseValid = true;
      for (const char of nameInput) {
        if (!baseRegex.test(char) && !regex.test(char)) {
          isBaseValid = false;
          break;
        }
      }
    
      if (!isBaseValid) {
        setError("Only .-_ and letters, numbers, and emojis are allowed. No spaces.");
      } else {
        if(captchaToken)
        {
          checkUsernameAvailability();
        }
        else
        {
          togglePopUp();
        }
      }
    };

    const reloadPage = ()=>{
      window.location.reload();
    }

    useEffect(() => {
      if (captchaToken) {
          const timer = setTimeout(() => {
            checkUsernameAvailability();
          }, 450);
  
          return () => clearTimeout(timer);
      }
  }, [captchaToken]);

  useEffect(() => {
    if(!isLoading && hasRequested)
    {
      setShowRequestStat(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if(hasRequested && !requestSuccess)
    {
      setShowRequestStat(false);
      setHasRequested(false);
    }
  }, [nameInput]);

  useEffect(() => {
    if(!walletAddress)
    {
      setShowRequestStat(false);
      setHasRequested(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if(requestSuccess)
    {
      const timer = setTimeout(() => {
        reloadPage();
      }, 6000); 

      return () => clearTimeout(timer);
    }
  }, [requestSuccess]);

  return (
    <>
    <div className='hideOnMobile'>
    <button 
          className={`${(showRequestStat && requestSuccess)? "hidden":""} ml-5 mr-4 bg-[#BDFF6A] ${( isLoading || !nameInput || !walletAddress)? "opacity-50": "transition-colors duration-300 ease-in-out hover:bg-[#D9FFA3]"} px-4 py-2 flex justify-center items-center`}
          onClick={inputValidate}
          style={{ width:"22rem",height:"2.5rem", fontSize: "1rem",fontWeight:"400"}} disabled={isLoading || !nameInput || !walletAddress}>
            {
              isLoading?
                <Spinner width={25} height={25} /> 
              :
              'REGISTER'
            }                      
        </button>
        
        <div className={`${(!showRequestStat) ? "hidden" : ""}`} style={{ width:"25rem",marginLeft:"5rem",lineHeight:"1.375rem",fontSize:"1rem",fontWeight:"700"}}>
          <span className={`${(requestSuccess) ? "text-[#7CDF00]" : "hidden"}`}>
            Congratulations, you have registered your handle.
          </span>

        </div>


    </div>

    <div className='hideOnDesktop'>
    <button 
          className={`${(showRequestStat && requestSuccess)? "hidden":""} ml-5 mr-4 bg-[#BDFF6A] ${( isLoading || !nameInput || !walletAddress)? "opacity-50": "transition-colors duration-300 ease-in-out hover:bg-[#D9FFA3]"} px-4 py-2 flex justify-center items-center`}
          onClick={inputValidate}
          style={{ width:"10rem",height:"2.5rem", fontSize: "1rem",fontWeight:"400"}} disabled={isLoading || !nameInput || !walletAddress}>
            {
              isLoading?
                <Spinner width={18} height={18} /> 
              :
              'REGISTER'
            }                      
        </button>
        
        <div className={`${(!showRequestStat) ? "hidden" : ""}`} style={{ width:"10rem",marginLeft:"1rem",lineHeight:"1.375rem",fontSize:"1rem",fontWeight:"700"}}>
          <span className={`${(requestSuccess) ? "text-[#7CDF00]" : "hidden"}`}>
            Congratulations, you have registered your handle.
          </span>
            
        </div>
    </div>
    </>
  )
}

export default RegHandle