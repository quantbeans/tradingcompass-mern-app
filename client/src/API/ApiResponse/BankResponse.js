import React from "react";
import { useEffect } from "react";
import { useStateContext } from "../../Contexts/ContextProvider";


const BankResponse = () => {
  //get data variable from contextprovider
  const { BankData, setBankData,setBankDaydata ,setBankTimestamp} = useStateContext();

  //fetch,process and stored data
  const getBankChain = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BANKNIFTY_DATA
      );
      
        const responseJSON = await response.json();
        setBankDaydata(responseJSON);
        const daydata = responseJSON[0].datedata;
        const bank = responseJSON[0].datedata[daydata.length - 1].data;
    
        setBankTimestamp(responseJSON[0]?.datedata[daydata.length - 1]?.timestamp)
      //assign value to bankdata and store reponse in local storage for future need
   
      bank.length === 42 && setBankData(bank);
      bank.length === 42 &&
        localStorage.setItem("prevBankRes", JSON.stringify(bank));

      return BankData;
    } catch (error) {
      console.log(error);
    }
  };
  //trigger function to call api
  useEffect(() => {
    getBankChain();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //trigger function to call api
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      if (date.getMinutes() % 1 === 0) {
        getBankChain();
      }
    }, 20000);

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default BankResponse;
