# -*- coding: utf-8 -*-
"""Backward-compatible shim.

service_handler now uses raspi/rc_car/line_sensor.py directly.
This file remains to avoid breaking old imports.
"""

from line_sensor import *
