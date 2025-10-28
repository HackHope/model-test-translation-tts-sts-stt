import { runSTT } from "./models/stt.js";

async function main() {
    console.log("=== Testing Edge Models ===");

    // 1. Translation
    // const translated = await runTranslation("Hello I am satyam mishra", "hi");
    // console.log("Translated:", translated);

    // // 2. TTS
    // await runTTS("Bonjour le monde", "./samples/output_tts.wav");

    // 3. STT
    const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
    const textFromAudio = await runSTT(url);

    console.log("STT Output:", textFromAudio);

    // // 4. STS
    // await runSTS("./samples/input.wav", "./samples/output_sts.wav");
}

main();
