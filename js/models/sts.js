import { runSTT } from "./stt.js";
import { runTranslation } from "./translation.js";
import { runTTS } from "./tts.js";

export async function runSTS(inputAudio, outAudio) {
    // 1. Speech → Text
    const text = await runSTT(inputAudio);

    // 2. Translate
    const translated = await runTranslation(text, "fr");

    // 3. Text → Speech
    await runTTS(translated, outAudio);
    console.log("STS pipeline done:", outAudio);
}
