/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import run from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setresultData] = useState("");

  const onSent = async (prompt) => {
    setresultData('')
    setLoading(true)
    setShowResult(true)
    let result;
    if (prompt!==undefined){
        result=await run(prompt)
        setRecentPrompt(prompt)
    } else{
        setPrevPrompt(prev=>[...prev, input])
        setRecentPrompt(input)
        result=await run(input)
    }
    const responseArray = result.split("**")
    let newResponse="";
    for (let i=0;i<responseArray.length;i++) {
        if(i===0 || i%2!==1) {
            newResponse += responseArray[i];
        } else {
            newResponse += "<b>" + responseArray[i] + "</b>";
        }
    }
    let newResponse2= newResponse.split('*').join("</br>")
    let newResponseArray = newResponse2.split(" ");
    for(let i=0;i< newResponseArray.length; i++){
        const nextWord = newResponseArray[i]
        delayPara(i, nextWord+" ")
    }
    setLoading(false)
    setInput('')
  };

  const delayPara = (index, nextWord)=>{
    setTimeout(()=>{
        setresultData(prev=> prev+nextWord)
    }, 75*index)
  }

  const newChat=()=>{
    setLoading(false)
    setShowResult(false)
  }

  const ContextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={ContextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
