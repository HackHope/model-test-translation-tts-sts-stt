import { pipeline } from "@huggingface/transformers";

let stt = null;

export async function runSTT(audioPath) {
    if (!stt) {
        stt = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en");
    }
    const output = await stt(audioPath);
    return output.text;
}
