import { speechToText } from "../util/speechToText.js"
import translateSRT from "../util/translateSRT.js";

export const subtitleController = async(req,res)=>{
    try{
        const audioBuffer = req.body;
        const subLanguage = req.headers['subtitle-language'];
        const inputVideoLanguage = req.headers['input-language'];

        const srtContent = await speechToText(audioBuffer , inputVideoLanguage);

        if(!srtContent){
            throw new Error("Error while generating subtitles");
        }

        if( subLanguage === inputVideoLanguage){
            res.status(200).json({subtitles : srtContent});
        }
        const translatedSrtContent =  await translateSRT(srtContent , inputVideoLanguage,  subLanguage);

       
        res.status(200).json({subtitles : translatedSrtContent});

    }catch(error){
        console.log(" error during transcription :- ", error)
        res.status(500).json({error})
    }
}