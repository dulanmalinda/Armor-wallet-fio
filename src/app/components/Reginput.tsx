import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import regCircle from '../assets/regpanel/regCircle.svg'
import FioHandle from '../components/FioHandle'

const Reginput = () => {
   const [nameInput, setnameInput] = useState<string>("");

  const contentElementRef = useRef<HTMLDivElement>(null);
  const [heightContent, setHeightContent] = useState(0);

  const fioBtnRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: { target: { value: any; }; }) => {
    const input = e.target.value;
    const characterLimit = 100; 

    if (input.length <= characterLimit) {
        setnameInput(input);
    } else {
      // alert(`Word limit of ${wordLimit} exceeded`);
    }
  };

  useEffect(() => {
    if (contentElementRef.current) {
      setHeightContent(contentElementRef.current.offsetHeight + 30);
    }
  }, []);

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
                    <Image src={regCircle} alt="reg circle" style={{width:"1rem",height:"1rem",marginTop:"0.25rem"}}/>
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
          <div className="ml-4 mt-2 sm:mt-0" ref={contentElementRef}>
              <div className="flex flex-col items-Start">
                <span style={{fontSize:"1rem",fontWeight:"400",marginBottom:"1rem"}}>
                    Register your @armor handle
                </span>

                <div ref={fioBtnRef} className="flex justify-start items-center">
                    <input  type="text" className="border border-black p-2 text-right focus:outline-none" style={{width:"18rem",height:"2.5rem"}} placeholder="myname" onChange={handleChange} value={nameInput}/>
                    
                    <span style={{fontSize:"1rem",fontWeight:"700",marginLeft:"0.5rem"}}>
                      @armor
                    </span>
                    <FioHandle isLoading={isLoading} setIsLoading={setIsLoading}/>
                </div>
              </div>
          </div>
        </div>
    </>
  )
}

export default Reginput