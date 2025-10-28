import { pipeline } from "@huggingface/transformers";

let translator = null;
const model_cache = "./model_cache/translation";
export async function runTranslation(text) {
    if (!translator) {
        translator = await pipeline("translation", "Xenova/opus-mt-en-hi", {
            cache_dir: model_cache, dtype: "fp16"
        });
    }
    const output = await translator(text);
    return output[0].translation_text;
}
