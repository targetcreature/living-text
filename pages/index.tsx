import { useEffect } from "react"
import fetch from "isomorphic-unfetch"
import { Word } from "../components/Word"
import { Provider, useStore } from "../context"
import { Form } from "../components/Form"

const App: React.FC = () => {

    useEffect(() => {




    }, [])

    return (
        <Provider>
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignContent: "center",
                justifyContent: "center"
            }}>

                <div style={{
                    fontSize: 40,
                    width: "50vw"
                }}>
                    <Form />
                </div>
            </div>
        </Provider>
    )
}

export default App