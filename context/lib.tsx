import fetch from "isomorphic-unfetch"
import { Data } from "./_types"

/* Returns [word, punctuation] */
export const stripPunc = (word: string) => {
    const idx = word.match(/[^a-zA-Z0-9]/)?.index
    return [
        word.slice(0, idx),
        idx ? word.slice(idx) : ""
    ]
}

export const fetchData = (w: string, cb: (data: Data) => void) => {

    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + w)
        .then(r => r.json())
        .then(data => {
            if (data.length > 0) {
                cb(data as Data)
            }
        })
}

export const getPrint = (source: string, word: string, punc: string) => {

    if (!word) return source

    const isLower = source[0] !== source[0].toUpperCase()
    const first = isLower ? word[0] : word[0].toUpperCase()
    const end = word.slice(1)

    return `${first}${end}${punc}`

}

export const getPos = (p: string) => {
    const dic = {
        adjective: "Adj",
        adverb: "Adv",
        suffix: "Sx"
    }
    return dic[p] || p[0].toUpperCase()
}

export const removeIndex = (arr, i) => {
    return [...arr.slice(0, i), ...arr.slice(i + 1)]
  }