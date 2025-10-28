import runSTS from './models/sts.js';
async function main() {
    console.log("=== Testing Edge Models ===");
    // const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';
    const path = './js/sample/jfk.wav';
    await runSTS(path, "./js/sample/tts_hin_output.wav");
}

main();
