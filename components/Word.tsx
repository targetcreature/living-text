import { useEffect, useState } from "react"
import { useStore } from "../context"
import fetch from "isomorphic-unfetch"

export const Word: React.FC<{ index: number }> = ({ index }) => {

    const { setStore, words } = useStore()
    const [word, setWord] = useState("")
    const [synonyms, setSynonyms] = useState([])
    const [init, setInit] = useState(true)
    const [initFetch, setInitFetch] = useState(true)
    const [current, setCurrent] = useState(0)

    useEffect(() => {

        if (init) {
            setWord(words[index])
            setSynonyms([words[index]])
            setInit(false)
        }

    }, [words, init])

    useEffect(() => {

        if (word) {

            if (initFetch) {

                fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
                    .then(r => r.json())
                    .then(data => {
                        data.length > 0 && data.map((d) =>
                            d.meanings.map((m) =>
                                m.definitions.map((def) =>
                                    setSynonyms((s) => {
                                        return [...s, ...def.synonyms]
                                    }))))
                    })
            }

            setInitFetch(false)
        }

    }, [word, initFetch])

    useEffect(() => {

        if (synonyms.length > 1) {
            setInterval(()=>{
                setCurrent((c)=> {
                    if (c+1 > synonyms.length) return 0
                    else return c + 1
                })
            },10000)

        }

    }, [synonyms])

    return (
        <div style={{ display: "inline-block" }}>{synonyms[current]}&nbsp;</div>
    )

}