import argparse
from pathlib import Path

import cv2
import numpy as np


def smoothstep(edge0: float, edge1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def circular_hue_mask(hue: np.ndarray, center: float, width: float) -> np.ndarray:
    distance = np.abs(hue - center)
    distance = np.minimum(distance, 180.0 - distance)
    return np.clip(1.0 - (distance / width), 0.0, 1.0)


def adjust_saturation(image: np.ndarray, amount: float) -> np.ndarray:
    luma = (
        image[..., 0] * 0.114
        + image[..., 1] * 0.587
        + image[..., 2] * 0.299
    )[..., None]
    return luma + (image - luma) * amount


def apply_grade(frame: np.ndarray) -> np.ndarray:
    image = frame.astype(np.float32) / 255.0

    # Pull the bright gameplay capture toward a darker, cleaner editorial baseline.
    image = np.clip((image - 0.020) / 0.95, 0.0, 1.0)
    image = np.power(image, 1.14)
    image = np.clip((image - 0.5) * 1.14 + 0.5, 0.0, 1.0)

    hsv = cv2.cvtColor((image * 255.0).astype(np.uint8), cv2.COLOR_BGR2HSV)
    hsv = hsv.astype(np.float32)
    hue = hsv[..., 0]
    sat = hsv[..., 1] / 255.0
    val = hsv[..., 2] / 255.0

    green_mask = circular_hue_mask(hue, center=58.0, width=24.0)
    cyan_mask = circular_hue_mask(hue, center=92.0, width=24.0)

    hue = (hue + green_mask * 4.5 + cyan_mask * 2.0) % 180.0
    sat *= 1.0 - (green_mask * 0.34) - (cyan_mask * 0.20)
    val *= 1.0 - (green_mask * 0.16) - (cyan_mask * 0.08)

    hsv[..., 0] = hue
    hsv[..., 1] = np.clip(sat * 255.0, 0.0, 255.0)
    hsv[..., 2] = np.clip(val * 255.0, 0.0, 255.0)
    image = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32) / 255.0

    luma = image[..., 0] * 0.114 + image[..., 1] * 0.587 + image[..., 2] * 0.299
    highlight_mask = smoothstep(0.48, 0.92, luma)[..., None]
    shadow_mask = (1.0 - smoothstep(0.10, 0.46, luma))[..., None]

    image[..., 0] += highlight_mask[..., 0] * 0.040
    image[..., 1] += highlight_mask[..., 0] * 0.012
    image[..., 2] -= highlight_mask[..., 0] * 0.020

    image -= shadow_mask * 0.040
    image = adjust_saturation(image, 0.82)

    blurred = cv2.GaussianBlur(image, (0, 0), 1.3)
    image = cv2.addWeighted(image, 1.10, blurred, -0.10, 0.0)

    return np.clip(image * 255.0, 0.0, 255.0).astype(np.uint8)


def render_previews(video_path: Path, preview_dir: Path) -> None:
    preview_dir.mkdir(parents=True, exist_ok=True)
    capture = cv2.VideoCapture(str(video_path))
    if not capture.isOpened():
        raise RuntimeError(f"Could not open {video_path}")

    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    positions = [0.10, 0.35, 0.60, 0.85]

    for index, position in enumerate(positions, start=1):
        frame_number = min(frame_count - 1, max(0, int(frame_count * position)))
        capture.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        ok, frame = capture.read()
        if not ok:
            continue

        graded = apply_grade(frame)
        comparison = np.concatenate([frame, graded], axis=1)
        cv2.imwrite(str(preview_dir / f"preview_{index}_{frame_number}.png"), comparison)

    capture.release()


def render_video(video_path: Path, output_path: Path) -> None:
    capture = cv2.VideoCapture(str(video_path))
    if not capture.isOpened():
        raise RuntimeError(f"Could not open {video_path}")

    fps = capture.get(cv2.CAP_PROP_FPS) or 60.0
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    writer = cv2.VideoWriter(
        str(output_path),
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (width, height),
    )
    if not writer.isOpened():
        capture.release()
        raise RuntimeError(f"Could not write to {output_path}")

    processed = 0
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        writer.write(apply_grade(frame))
        processed += 1
        if processed % 120 == 0 or processed == frame_count:
            print(f"Processed {processed}/{frame_count} frames")

    writer.release()
    capture.release()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--preview-dir", type=Path)
    parser.add_argument("--preview-only", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.preview_dir:
        render_previews(args.input, args.preview_dir)
    if args.preview_only:
        return
    if not args.output:
        raise RuntimeError("--output is required unless --preview-only is set")
    render_video(args.input, args.output)


if __name__ == "__main__":
    main()
