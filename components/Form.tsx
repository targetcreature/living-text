import { useEffect, useState } from "react"
import { useStore } from "../context"
import { Word } from "./Word"

export const Form: React.FC = () => {

    const { words, setStore } = useStore()

    const [state, setState] = useState("")

    return (
        <div>
            {
                words.map(({ isPunc, content }, i) =>
                    isPunc ?
                        <span>{content}</span>
                        :
                        <Word key={i} word={content} />
                )
            }
            <input

                ref={input => input && input.focus()}

                onChange={({ target }) => {

                    const { value } = target

                    const isEmpty = !!value[0].match(" ")
                   
                    if(isEmpty){
                        console.log("empty")
                        return
                        
                    }


                    const first = value.slice(0,-1)
                    const last = value.slice(-1)

                    const isPunc = !last.match("^[a-zA-Z0-9]+$") && !last.match(`'`)
                    const isSpace = !!last.match(" ") 
                    
                    console.log({value, first, last, isPunc, isSpace}) 

                    if(isPunc){
                            setStore((s) => {
                                s.words.push({content: first})
                                s.words.push({content: `${last}${!isSpace ? " " : ""}`, isPunc: true})
                                return s
                            })
                            setState("")
                    }
                    else{
                        setState((s) => target.value)
                    }


                    // if(/^[\pL\pN]+$/.test(value)){
                    //     // has non-alphanumeric
                    // }


                    // if (/\s+$/.test(value)) {

                    //     setStore((s) => {
                    //         s.words.push({content: state || " "})
                    //         return s
                    //     })
                    //     setState("")
                    // }
                }} 
                
                value={state}

                style={{
                    border: 0,
                    borderBottom: "3px solid lightgray",
                    fontSize: 40,
                    outline: 0
                }}
            />
        </div>
    )

}