import { useEffect } from "react";
import fetch from "isomorphic-unfetch"
import { Word } from "../components/Word";
import { Provider, useStore } from "../context";
import { Form } from "../components/Form";

const App: React.FC = () => {

    useEffect(()=>{

        
        
        
    },[])

    return (
        <Provider>
            <Form/>
        </Provider>
    )
}

export default App