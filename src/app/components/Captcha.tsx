'use client'

import {useRef , useEffect, useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import styles from './Captcha.module.css'
import ReCAPTCHA from 'react-google-recaptcha';

interface captchaProps {
    isOpen: boolean;
    onClose: () => void;
    armorHandle: string | null;
    captchaToken: string | null;
    setCaptchaToken: (newValue: string | null) => void;
    handleSignMessage: () => void;
  }

const Captcha = ({ isOpen, onClose,armorHandle,captchaToken,setCaptchaToken,handleSignMessage}:captchaProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (isOpen) {
        setIsVisible(true);
    }
}, [isOpen]);

useEffect(() => {
  if (captchaToken) {
      const timer = setTimeout(() => {
        closePopUp();
      }, 450);

      return () => clearTimeout(timer);
  }
}, [captchaToken]);

  const setPopUpVisibleState = (isopen:boolean) =>{
    if(!isopen)
    {
      setIsVisible(false);
    }
  }

  const closePopUp = () =>{
    onClose();
  }

  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token);
  };


  return (
    <>
    <div onClick={closePopUp}>
      <div
        className={`
          ${styles.blurBG}
          ${isVisible ? 'visible' : 'invisible'} ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      >
      </div>

      <div
        className={`${isVisible ? 'visible' : 'invisible'} fixed inset-0 flex items-center justify-center transition-transform transition-opacity duration-300 z-20 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        onTransitionEnd={() => setPopUpVisibleState(isOpen)}
        //onClick={(e) => e.stopPropagation()}  // Prevent click propagation to the background
      >
        <div className="pl-4">
          
        <ReCAPTCHA
            sitekey="6LfjewYqAAAAACtB-x_sXpPPO134pSfwqBQyn-yZ"
            ref={recaptchaRef}
            onChange={handleCaptchaVerify}
            className={`${armorHandle ? "hidden":""}`}
            style={{minHeight:"6rem"}}
        />

        </div>
      </div>
    </div>
    </>
  )
}

export default Captcha