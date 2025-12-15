# -*- coding: utf-8 -*-
"""Motor control primitives used by service_handler.

Extracted from keyboard_control.py to keep service_handler dependencies minimal.
"""

try:
    import RPi.GPIO as GPIO  # type: ignore[import-not-found]
except Exception:  # pragma: no cover
    GPIO = None

from key_input import get_key

# Motor states
STOP = 0
FORWARD = 1
BACKWARD = 2

# Motor channels
CH1 = 0  # right wheel
CH2 = 1  # left wheel

HIGH = 1
LOW = 0

# =========================
# Motor pin definitions
# =========================
ENA = 12  # right PWM
ENB = 13  # left PWM

IN1 = 25  # right dir1
IN2 = 8   # right dir2
IN3 = 24  # left dir1
IN4 = 23  # left dir2

# =========================
# Speed presets
# =========================
SPEED_FORWARD = 65
SPEED_TURN = 60
SPEED_SLOW = 40

# Global PWM objects (initialized lazily)
pwmA = None
pwmB = None


def setPinConfig(EN, INA, INB):
    """Initialize pins and start PWM (expects GPIO mode already set)."""
    if GPIO is None:
        raise RuntimeError("RPi.GPIO is required to control motors")
    GPIO.setup(EN, GPIO.OUT)
    GPIO.setup(INA, GPIO.OUT)
    GPIO.setup(INB, GPIO.OUT)

    pwm = GPIO.PWM(EN, 100)
    pwm.start(0)
    return pwm


def setMotorControl(pwm, INA, INB, speed, stat):
    """Control a single motor."""
    if GPIO is None:
        raise RuntimeError("RPi.GPIO is required to control motors")
    speed = max(0, min(100, speed))
    pwm.ChangeDutyCycle(speed)

    if stat == FORWARD:
        GPIO.output(INA, HIGH)
        GPIO.output(INB, LOW)
    elif stat == BACKWARD:
        GPIO.output(INA, LOW)
        GPIO.output(INB, HIGH)
    else:
        GPIO.output(INA, LOW)
        GPIO.output(INB, LOW)


def setMotor(ch, speed, stat):
    """Control motor by channel."""
    global pwmA, pwmB
    if pwmA is None or pwmB is None:
        return

    if ch == CH1:
        setMotorControl(pwmA, IN1, IN2, speed, stat)
    else:
        setMotorControl(pwmB, IN3, IN4, speed, stat)


def ensure_motors_initialized():
    """Initialize PWM objects once (expects GPIO.setmode already done)."""
    global pwmA, pwmB
    if pwmA is None:
        pwmA = setPinConfig(ENA, IN1, IN2)
    if pwmB is None:
        pwmB = setPinConfig(ENB, IN3, IN4)


def stop():
    """Stop both motors."""
    global pwmA, pwmB
    if pwmA is None or pwmB is None:
        return
    setMotor(CH1, 0, STOP)
    setMotor(CH2, 0, STOP)


def forward(speed=SPEED_FORWARD):
    ensure_motors_initialized()
    setMotor(CH1, speed, FORWARD)
    setMotor(CH2, speed + 3, FORWARD)


def backward(speed=SPEED_FORWARD):
    ensure_motors_initialized()
    setMotor(CH1, speed, BACKWARD)
    setMotor(CH2, speed + 3, BACKWARD)


def turn_left(speed=SPEED_TURN):
    ensure_motors_initialized()
    setMotor(CH1, speed, FORWARD)
    setMotor(CH2, speed, BACKWARD)


def turn_right(speed=SPEED_TURN):
    ensure_motors_initialized()
    setMotor(CH1, speed, BACKWARD)
    setMotor(CH2, speed, FORWARD)


def forward_left(speed=SPEED_FORWARD):
    ensure_motors_initialized()
    setMotor(CH1, speed, FORWARD)
    setMotor(CH2, speed * 0.3, FORWARD)


def forward_right(speed=SPEED_FORWARD):
    ensure_motors_initialized()
    setMotor(CH1, speed * 0.3, FORWARD)
    setMotor(CH2, speed, FORWARD)
