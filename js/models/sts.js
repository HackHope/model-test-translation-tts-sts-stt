import { runSTT } from "./stt.js";
import { runTranslation } from "./translation.js";
import { runTTS } from "./tts.js";

export default async function runSTS(inputAudio, outAudio) {
    // 1. Speech → Text
    const text = await runSTT(inputAudio);
    console.debug("Transcribed:", text);

    // 2. Translate
    const translated = await runTranslation(text);
    console.debug("Translated:", translated);

    // // 3. Text → Speech
    await runTTS(translated, outAudio);
    console.debug("STS pipeline done:", outAudio);
}
