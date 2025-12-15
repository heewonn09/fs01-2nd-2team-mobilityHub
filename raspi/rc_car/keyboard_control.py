# -*- coding: utf-8 -*-
"""Backward-compatible shim.

service_handler now uses raspi/rc_car/motor.py directly.
This file remains to avoid breaking old imports.
"""

from motor import *
