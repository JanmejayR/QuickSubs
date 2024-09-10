import { AssemblyAI } from 'assemblyai'
import dotenv from 'dotenv'
dotenv.config();

const client = new AssemblyAI({apiKey: process.env.ASSEMBLYAI_API_KEY})

export const speechToText = async (audioBuffer , inputVideoLanguage ) => {
    try{
    const transcript = await client.transcripts.transcribe({audio: audioBuffer , language_code: inputVideoLanguage})
    if (transcript.status === "error") {
        throw new Error(transcript.error);
      }
      const srtContent = await client.transcripts.subtitles(transcript.id, "srt");
      console.log(" the srt :- ", srtContent)
      return srtContent;
    }catch(error){
        console.log("error during transciption :-" , error)
        return;
    }
  };
