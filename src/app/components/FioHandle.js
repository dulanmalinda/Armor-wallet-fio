import React, { useState, useEffect } from 'react';
import { FIOSDK } from '@fioprotocol/fiosdk';
import fetch from 'node-fetch';
import ClipLoader from "react-spinners/ClipLoader";

const FioHandle = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      fio_address: 'user10006@fiotestnet',
      owner_fio_public_key: publicKey,
      max_fee: 10000000000000,
      tpid: '',
      actor: account
    };

    const user = new FIOSDK(privateKey, publicKey, apiNode, fetchJson);

    try {
      const result = await user.genericAction('pushTransaction', {
        action: action,
        account: contract,
        data: actionData
      });
      setResult(result);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <button
              className={`mt-4 mr-4 bg-[#BDFF6A] ${( false )? "opacity-50": "transition-colors duration-300 ease-in-out hover:bg-[#D9FFA3]"} px-4 py-2`}
              onClick={registerFioHandle}
              style={{ width: '300px', fontSize: "1rem" }}
              disabled={false}
            >
              {/* {loading ? (
                <ClipLoader
                  color={"#000000"}
                  loading={true}
                  size={15}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Submit Your Prompt"
              )} */}
              <ClipLoader
                  color={"#000000"}
                  loading={true}
                  size={15}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
            </button>
    </div>
  );
};

export default FioHandle;
