# -*- coding: utf-8 -*-
"""3-channel line sensor utilities used by service_handler.

Extracted from tracertest.py.
"""

try:
    import RPi.GPIO as GPIO  # type: ignore[import-not-found]
except Exception:  # pragma: no cover
    GPIO = None


# =========================
# Line sensor pins (BCM)
# =========================
LS_LEFT = 5
LS_CENTER = 6
LS_RIGHT = 22

# =========================
# Sensor output logic
# =========================
# Adjust LINE/SPACE if your module is inverted.
LINE = 1
SPACE = 0


def setup_line_tracer():
    if GPIO is None:
        raise RuntimeError("RPi.GPIO is required to read line sensors")
    GPIO.setup(LS_LEFT, GPIO.IN)
    GPIO.setup(LS_CENTER, GPIO.IN)
    GPIO.setup(LS_RIGHT, GPIO.IN)


def read_line_sensors():
    if GPIO is None:
        raise RuntimeError("RPi.GPIO is required to read line sensors")
    left = GPIO.input(LS_LEFT)
    center = GPIO.input(LS_CENTER)
    right = GPIO.input(LS_RIGHT)
    return left, center, right


def is_node_pattern(left, center, right):
    """Node pattern: all sensors detect LINE."""
    return (left == LINE) and (center == LINE) and (right == LINE)
