import { pipeline } from "@huggingface/transformers";
import wavefile from 'wavefile';

let stt = null;

export async function runSTT(audioPath) {
    if (!stt) {
        stt = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", {
            cache_dir: "./model_cache/stt", device: "auto"
        });
    }
    let buffer = Buffer.from(await fetch(audioPath).then(x => x.arrayBuffer()))

    // Read .wav file and convert it to required format
    let wav = new wavefile.WaveFile(buffer);
    wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
    wav.toSampleRate(16000); // Whisper expects audio with a sampling rate of 16000
    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
        if (audioData.length > 1) {
            const SCALING_FACTOR = Math.sqrt(2);

            // Merge channels (into first channel to save memory)
            for (let i = 0; i < audioData[0].length; ++i) {
                audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
            }
        }

        // Select first channel
        audioData = audioData[0];
    } else {
        throw new Error(`Unsupported audio format. Expected an array, but got ${typeof audioData}`);
    }


    let start = performance.now();
    const output = await stt(audioData);
    let end = performance.now();

    
    console.log(`STT took ${(end - start).toFixed(2)} ms`);
    return output;
}
