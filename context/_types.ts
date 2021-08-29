export type Data = {
    word: string
    phonetics: [
        {
            text: string
            audio: string
        },
        {
            text: string
            audio: string
        }
    ],
    meanings: [
        {
            partOfSpeech: string
            definitions: [
                {
                    definition: string
                    example: string
                    synonyms?: string[]
                }
            ]
        }
    ]
}[]