# Practical Pipeline for Edge Device

For real-time Gujarati → Hindi on mobile, I’d suggest a 3-stage pipeline with lightweight models:
ASR (Gujarati → Text)

- Use Whisper-small/medium quantized with whisper.cpp.
- Whisper handles Gujarati fairly well.

MT (Gujarati Text → Hindi Text)

- Use a lightweight MarianMT or IndicTrans2 model (optimized for Indic languages).
- Can be quantized to 8-bit or run with ONNX.

TTS (Hindi Text → Hindi Speech)

- Use Vakyansh TTS (open-source for Hindi, optimized for Indic) or Coqui TTS.
- There are lightweight Hindi voices that run on-device.

🔧 Optimizations:

- All models quantized (int8 or int4).
- Use streaming inference (chunk 1–2s audio).
- VAD (Voice Activity Detection) to reduce wasted inference.
