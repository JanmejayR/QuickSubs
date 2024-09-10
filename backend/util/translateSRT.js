import * as deepl from 'deepl-node';
import dotenv from 'dotenv'
dotenv.config();
// Replace with your DeepL API key
const authKey = process.env.DEEPL_API_KEY
; 
const translator = new deepl.Translator(authKey);

export default async (srtContent, sourceLanguage, targetLanguage) => {
    try {
        // Convert source and target language codes to uppercase
        const sourceLangUpper = sourceLanguage.toUpperCase();
        const targetLangUpper = targetLanguage.toUpperCase();

        // Extract text segments from SRT content
        const srtLines = srtContent.split('\n');
        const segments = [];
        let currentSegment = [];

        for (const line of srtLines) {
            if (line.trim() === '' || line.match(/^\d+$/) || line.includes('-->')) {
                if (currentSegment.length > 0) {
                    segments.push(currentSegment.join('\n'));
                    currentSegment = [];
                }
            } else {
                currentSegment.push(line);
            }
        }

        if (currentSegment.length > 0) {
            segments.push(currentSegment.join('\n'));
        }

        // Translate text segments
        const translations = await Promise.all(
            segments.map(segment => 
                translator.translateText(segment, sourceLangUpper, targetLangUpper)
            )
        );

        // Reconstruct translated SRT content
        let translatedSRT = '';
        let segmentIndex = 0;

        for (const line of srtLines) {
            if (line.trim() === '' || line.match(/^\d+$/) || line.includes('-->')) {
                translatedSRT += line + '\n';
            } else {
                if (segmentIndex < translations.length) {
                    translatedSRT += translations[segmentIndex].text + '\n';
                    segmentIndex++;
                } else {
                    translatedSRT += line + '\n';
                }
            }
        }

        return translatedSRT.trim();
    } catch (error) {
        console.error('Error translating SRT content:', error);
        throw error;
    }
};