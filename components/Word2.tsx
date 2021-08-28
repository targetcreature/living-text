import { useEffect, useMemo, useState } from "react"
import { useStore } from "../context"
import fetch from "isomorphic-unfetch"

export const Word: React.FC<{ word: string, index: number }> = ({ word, index }) => {

    const { isPause, isOriginal, setTranslate } = useStore()
    const [synonyms, setSynonyms] = useState([word])
    const [current, setCurrent] = useState(0)
    const [pauseCount, setPause] = useState(0)

    useEffect(() => {

        const interval = setInterval(() => setCurrent((c) => c + 1), 5000)

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

        return () => clearInterval(interval)
    }, [])


    const triggerPause = () => setPause(current)

    useEffect(() => {
        if (isPause) {
            triggerPause()
        }
    }, [isPause])

    const idxCount = synonyms.length > 1 ? current > synonyms.length - 1 ? 0 : current : 0
    const idx = !idxCount ? 0 : isPause ? pauseCount : current

    const isLower = word[0] == word[0].toLowerCase() && word[0] != word[0].toUpperCase()

    const syn = synonyms[idx]
    const first = isLower ? syn[0] : syn[0].toUpperCase()
    const end = syn.slice(1)

    const print = isOriginal ? word : `${first}${end}`

    useEffect(()=>{
        setTranslate(print, index)
    },[print])


    return null

    // return (
    //     <div
    //         style={{ display: "inline-block" }}
    //     >
    //         {print}
    //     </div>
    // )

}