import { pipeline } from "@huggingface/transformers";
import wavefile from 'wavefile';

let stt = null;
// Default model and options. Callers can override with setSTTModel or by passing modelPath to runSTT
let sttModel = "indicconformer_stt_hi_ctc_only_fp16.onnx";
let sttOptions = { cache_dir: "./model_cache/", device: "auto", dtype: "float16" };

/**
 * Set the STT model to a custom ONNX model path or repo id.
 * modelPath: local path or remote repo id supported by the transformers pipeline
 * options: forwarded to pipeline() (e.g., cache_dir, device, dtype)
 */
export function setSTTModel(modelPath, options = {}) {
    if (!modelPath) throw new Error('modelPath is required');
    sttModel = modelPath;
    sttOptions = { ...sttOptions, ...options };
    stt = null; // force reload on next run
}

/**
 * Run speech-to-text on an audio file (wav). You can pass an optional modelPath
 * and options to use a custom ONNX model for this call. If provided, modelPath
 * will override the previously-set model.
 */
export async function runSTT(audioPath, modelPath = null, options = null) {
    if (modelPath) setSTTModel(modelPath, options || {});

    if (!stt) {
        stt = await pipeline("automatic-speech-recognition", sttModel, sttOptions);
    }

    let buffer = Buffer.from(await fetch(audioPath).then(x => x.arrayBuffer()));

    // Read .wav file and convert it to required format
    let wav = new wavefile.WaveFile(buffer);
    wav.toBitDepth('32f'); // Pipeline expects input as a Float32Array
    wav.toSampleRate(16000); // Pipeline expects audio with a sampling rate of 16000
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
