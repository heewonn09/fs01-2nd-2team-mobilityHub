# -*- coding: utf-8 -*-
"""Terminal key input utilities (Raspberry Pi SSH demo).

This module intentionally keeps the same blocking behavior as the original code.
"""

import sys
import tty
import termios


def get_key() -> str:
    """Read a single key press from stdin (blocking, raw mode)."""
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    try:
        tty.setraw(fd)
        ch = sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    return ch
