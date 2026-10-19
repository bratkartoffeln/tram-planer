#!/usr/bin/env python3
"""Generate original MP3 chimes; build-time dependency: PyAV (pip install av)."""
import math
from pathlib import Path
import av
import numpy as np

DESTINATION = Path(__file__).resolve().parents[1] / 'app/src/main/assets/audio/chimes'


def write_chime(name, frequencies):
    rate = 44100
    duration = len(frequencies) * 0.42 + 0.45
    samples = np.zeros(round(duration * rate), dtype=np.float64)
    for index, frequency in enumerate(frequencies):
        start = round(index * 0.42 * rate)
        for i in range(min(round(0.85 * rate), len(samples) - start)):
            t = i / rate
            envelope = min(1, t / 0.008) * math.exp(-6 * t)
            samples[start + i] += 0.32 * envelope * (math.sin(2 * math.pi * frequency * t) + 0.12 * math.sin(4 * math.pi * frequency * t))
    pcm = (np.clip(samples, -0.95, 0.95) * 32767).astype(np.int16).reshape(1, -1)
    DESTINATION.mkdir(parents=True, exist_ok=True)
    with av.open(str(DESTINATION / name), 'w', format='mp3') as output:
        stream = output.add_stream('libmp3lame', rate=rate)
        stream.bit_rate = 96000
        stream.layout = 'mono'
        frame = av.AudioFrame.from_ndarray(pcm, format='s16', layout='mono')
        frame.sample_rate = rate
        for packet in stream.encode(frame):
            output.mux(packet)
        for packet in stream.encode():
            output.mux(packet)


write_chime('ding_dong.mp3', [1046.50, 783.99])
write_chime('dong_dong_ding.mp3', [659.25, 659.25, 1046.50])
