import { createContext, useContext, useState } from "react"

export type State = {
    words: string[]
}

const init = { words: []}

const Context = createContext<[State, React.Dispatch<React.SetStateAction<State>>]>([init, () => null])

export const Provider: React.FC<{}> = ({ children }) => {

    const state = useState<{words:string[]}>(init)

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    )

}

interface UProps extends State {

    setStore: React.Dispatch<React.SetStateAction<State>>

}

export const useStore = (): UProps => {

    const [state, setState] = useContext(Context)

    return {
        ...state,
        setStore: setState
    }

}