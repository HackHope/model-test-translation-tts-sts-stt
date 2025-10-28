import { pipeline } from "@huggingface/transformers";
import fs from "fs";
import wavefile from 'wavefile';

let tts = null;

export async function runTTS(text, outPath) {
    if (!tts) {
        tts = await pipeline("text-to-speech", "Xenova/mms-tts-hin", {
            cache_dir: "./model_cache/tts", dtype: "fp32",
        });
    }

    const output = await tts(text);

    const wav = new wavefile.WaveFile();
    wav.fromScratch(1, output.sampling_rate, '32f', output.audio);

    fs.writeFileSync(outPath, wav.toBuffer());
}
