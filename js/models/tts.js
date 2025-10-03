import { pipeline } from "@huggingface/transformers";
import fs from "fs";

let tts = null;

export async function runTTS(text, outPath) {
    if (!tts) {
        tts = await pipeline("text-to-speech", "Xenova/speecht5_tts");
    }

    const audio = await tts(text);
    fs.writeFileSync(outPath, audio.audio, "binary");
    console.log("TTS saved:", outPath);
}
    