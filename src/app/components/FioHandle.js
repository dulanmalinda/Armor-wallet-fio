import React, { useState, useEffect } from 'react';
import { FIOSDK } from '@fioprotocol/fiosdk';
import fetch from 'node-fetch';
import ClipLoader from "react-spinners/ClipLoader";
import { useActiveAccount } from "thirdweb/react";

const FioHandle = ({nameInput,setnameInput,armorHandle,setArmorhandle,walletAddress,isLoading, setIsLoading,hasRequested,setHasRequested,requestSuccess,setRequestSuccess,baseApiURL,captchaToken}) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [signature, setSignature] = useState("");

  const [showRequestStat, setShowRequestStat] = useState(false);

  const activeAccount = useActiveAccount();

  const fetchJson = async (uri, opts = {}) => {
    return fetch(uri, opts);
  };

  const registerFioHandle = async () => {
    const apiNode = 'https://test.fio.eosusa.io/v1/';
    const privateKey = '5KTQVwCTwEvdhBEpXcpYWdpCatDaY3j61aPHMYzGgHQKNj2Zydz';
    const publicKey = 'FIO5n2XM5cz9dFsfc2ayjE2aWtC716Q4HdbqsberQHaWAmkYuoZM6';
    const account = FIOSDK.accountHash(publicKey).accountnm;

    const action = 'regaddress';
    const contract = 'fio.address';

    const actionData = {
      fio_address: `${nameInput}@fiotestnet`,
      owner_fio_public_key: publicKey,
      max_fee: 10000000000000,
      tpid: '',
      actor: account
    };

    const user = new FIOSDK(privateKey, publicKey, apiNode, fetchJson);

    try {
      setSignature(null);
      setHasRequested(true);
      const result = await user.genericAction('pushTransaction', {
        action: action,
        account: contract,
        data: actionData,
      });
      setResult(result);
      setRequestSuccess(true);
    } catch (err) {
      setError(err);
      setRequestSuccess(false);
    } finally {
      saveUser();
    }
  };

  const handleSignMessage = async () => {
    if (!nameInput) {
      alert('Please enter a handle to sign.');
      return;
    }

    setIsLoading(true);

    try {
      const signature = await activeAccount?.signMessage({message:"Confirm you armor handle"});

      if(signature)
      {
        setSignature(signature?.toString());
      }

    } catch (error) {
      console.error("Error signing message:", error);
      setLoading(false);
    }
  }; 

  useEffect(() => {
    if(!isLoading && hasRequested)
    {
      setShowRequestStat(true);
    }
  }, [isLoading]);


  useEffect(() => {
    if(signature)
    {
      registerFioHandle();
    }
  }, [signature]);


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
      setSignature(null);
      setShowRequestStat(false);
      setHasRequested(false);
    }
  }, [walletAddress]);

  const saveUser = async () => {
    const fioUsername = `${nameInput}@fiotestnet`;

    const res = await fetch(`${baseApiURL}user/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "fioUsername":fioUsername,"walletAddress":walletAddress}),
    });

    const data = await res.json(); 
    setIsLoading(false);
  }


  return (
    <>
    <div className='hideOnMobile'>
    <button 
          className={`${(showRequestStat)? "hidden":""} ml-5 mr-4 bg-[#BDFF6A] ${( isLoading || !nameInput || !walletAddress || !captchaToken)? "opacity-50": "transition-colors duration-300 ease-in-out hover:bg-[#D9FFA3]"} px-4 py-2`}
          onClick={handleSignMessage}
          style={{ width:"22rem",height:"2.5rem", fontSize: "1rem",fontWeight:"400"}} disabled={isLoading || !nameInput || !walletAddress || !captchaToken}>
            {
              isLoading?
                <ClipLoader
                  color={"#000000"}
                  loading={isLoading}
                  size={15}
                  aria-label="Loading Spinner desktop"
                  data-testid="loader desktop"
                />  
              :
              'REGISTER'
            }                      
        </button>
        
        <div className={`${(!showRequestStat) ? "hidden" : ""}`} style={{ width:"25rem",marginLeft:"5rem",lineHeight:"1.375rem",fontSize:"1rem",fontWeight:"700"}}>
          <span className={`${(requestSuccess) ? "text-[#7CDF00]" : "hidden"}`}>
            Congratulations, you have registered your handle.
          </span>

          <span className={`${(!requestSuccess) ? "text-[#F70000]" : "hidden"}`}>
            {error?.message || String(error)}
          </span>
        </div>
    </div>

    <div className='hideOnDesktop'>
    <button 
          className={`${(showRequestStat)? "hidden":""} ml-5 mr-4 bg-[#BDFF6A] ${( isLoading || !nameInput || !walletAddress)? "opacity-50": "transition-colors duration-300 ease-in-out hover:bg-[#D9FFA3]"} px-4 py-2`}
          onClick={handleSignMessage}
          style={{ width:"10rem",height:"2.5rem", fontSize: "1rem",fontWeight:"400"}} disabled={isLoading || !nameInput || !walletAddress}>
            {
              isLoading?
                <ClipLoader
                  color={"#000000"}
                  loading={isLoading}
                  size={15}
                  aria-label="Loading Spinner mobile"
                  data-testid="loader mobile"
                />  
              :
              'REGISTER'
            }                      
        </button>
        
        <div className={`${(!showRequestStat) ? "hidden" : ""}`} style={{ width:"10rem",marginLeft:"1rem",lineHeight:"1.375rem",fontSize:"1rem",fontWeight:"700"}}>
          <span className={`${(requestSuccess) ? "text-[#7CDF00]" : "hidden"}`}>
            Congratulations, you have registered your handle.
          </span>

          <span className={`${(!requestSuccess) ? "text-[#F70000]" : "hidden"}`}>
            {error?.message || String(error)}
          </span>
        </div>
    </div>
    </>
  );
};

export default FioHandle;
