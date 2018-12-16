import RPi.GPIO as gpio
gpio.setmode(gpio.BCM)
gpio.setwarnings(False)
hallpin = 2
ledpin = 3
gpio.setup( hallpin, gpio.IN)
gpio.setup(ledpin, gpio.OUT)
while True:
    if(gpio.input(hallpin) == False):
        gpio.output(ledpin, True)
        print("magnetic material detected")
    else:
        gpio.output(ledpin, False)
        print("All is well")
