import { createContext, useContext, useState } from "react"

export type State = {
    words: {
        content: string
        isPunc?: boolean
        isLine?: boolean
    }[]
    isPause: boolean
    isOriginal: boolean
    source: string[]
    translation: string[]
}

const init = {
    words: [],
    source: [],
    translation: [],
    isPause: false,
    isOriginal: false,
    isLine: false
}

const Context = createContext<[State, React.Dispatch<React.SetStateAction<State>>]>([init, () => null])

export const Provider: React.FC<{}> = ({ children }) => {

    const state = useState<State>(init)

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    )

}

interface UProps extends State {

    setStore: React.Dispatch<React.SetStateAction<State>>
    pushWord: (string) => void
    setTranslate: (word: string, index: number) => void

}

export const useStore = (): UProps => {

    const [state, setState] = useContext(Context)

    const pushWord = (word: string) => {
        if (!word) return null
        setState((s) => {
            const { source } = s
            source.push(word)
            return ({ ...s, source })
        }
        )
    }

    const setTranslate = (word: string, index: number) => setState((s) => {
        const { translation } = s
        translation[index] = word
        return ({ ...s, translation })
    })


    return {
        ...state,
        setStore: setState,
        pushWord: (word) => pushWord(word),
        setTranslate: (w, i) => setTranslate(w, i)
    }

}