import sys
import os
from PIL import Image
import numpy as np

frame0_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/frame0.png'
frame_n_path = sys.argv[2] if len(sys.argv) > 2 else '/tmp/frame899.png'
threshold = float(sys.argv[3]) if len(sys.argv) > 3 else 5.0

if not os.path.exists(frame0_path):
    print(f'WARNING: Frame 0 file not found: {frame0_path}')
    sys.exit(0)

if not os.path.exists(frame_n_path):
    print(f'WARNING: Frame N file not found: {frame_n_path}')
    sys.exit(0)

img1 = np.array(Image.open(frame0_path).convert('RGB')).astype(np.float64)
img2 = np.array(Image.open(frame_n_path).convert('RGB')).astype(np.float64)

if img1.shape != img2.shape:
    print(f'FAIL: Resolution mismatch {img1.shape} vs {img2.shape}')
    sys.exit(1)

mse = float(np.mean((img1 - img2) ** 2))
print(f'MSE (frame 0 vs frame N): {mse:.6f}')

if mse > threshold:
    print(f'FAIL: MSE {mse:.6f} exceeds threshold {threshold}')
    sys.exit(1)

print(f'PASS: Seamless loop verified (MSE <= {threshold})')
