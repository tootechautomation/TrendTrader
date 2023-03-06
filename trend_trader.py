# TrendTrader Cross Platform Support
from datetime import time
import pyautogui
from python_imagesearch.imagesearch import imagesearcharea, click_image

# Global Variables
global xPosition
global xDirection
global broker_selection

# Main Variables
broker_selection = "TOS"

# IMAGES To Search for Trend Change on TOS and Profit/StopLoss
Long_Image = "/home/ubuntu/Desktop/Images/TOS/Long.png"
Short_Image = "/home/ubuntu/Desktop/Images/TOS/Short.png"
Long_Image_1 = "/home/ubuntu/Desktop/Images/TOS/Long_1.png"
Short_Image_1 = "/home/ubuntu/Desktop/Images/TOS/Short_1.png"
Profits_Image = "/home/ubuntu/Desktop/Images/TOS/PROFITS.png"
Stoploss_Image = "/home/ubuntu/Desktop/Images/TOS/STOPLOSS.png"

# IMAGES FOR TOS POSITION CHANGES
BUY_Image_TOS = "/home/ubuntu/Desktop/Images/TOS/TOS_BUY_ASK.png"
SELL_Image_TOS = "/home/ubuntu/Desktop/Images/TOS/TOS_SELL_BID.png"
Reverse_Image_TOS = "/home/ubuntu/Desktop/Images/TOS/TOS_Reverse.png"
Flatten_Image_TOS = "/home/ubuntu/Desktop/Images/TOS/POS_SHORT_CLOSE.png"
TOS_POS_LONG = "/home/ubuntu/Desktop/Images/TOS/TOS_POS_LONG.png"
TOS_POS_SHORT = "/home/ubuntu/Desktop/Images/TOS/TOS_POS_SHORT.png"
TOS_POS_FLAT = "/home/ubuntu/Desktop/Images/TOS/TOS_POS_FLAT.png"
TOS_Negative_Position = "/home/ubuntu/Desktop/Images/TOS/Went_Negative.png"
TOS_PRE_POST_GREEN_X = "/home/ubuntu/Desktop/Images/TOS/pre-post-green-x.png"
TOS_PRE_POST_RED_X = "/home/ubuntu/Desktop/Images/TOS/pre-post-red-x.png"

# IMAGE FOR APP
FTT_Image = "/home/ubuntu/Desktop/Images/FollowTheTrend/FTT.png"

# Save Configuration File
File_Config = "TrendTrader.conf"



def auto_trade():
    current_position = scan_for_position()
    trend_change = scan_long_short()

    if current_position != trend_change and trend_change != "skip":
        send_a_trade()


def scan_long_short():
    ## TOS scans
    pos = imagesearcharea(Long_Image, 0, 0, 1280, 1024)
    if pos[0] != -1:
        error1 = 2
    pos = imagesearcharea(Short_Image, 0, 0, 1280, 1024)
    if pos[0] != -1:
        error2 = 1
    pos = imagesearcharea(Long_Image_1, 0, 0, 1280, 1024)
    if pos[0] != -1:
        error3 = 2
    pos = imagesearcharea(Short_Image_1, 0, 0, 1280, 1024)
    if pos[0] != -1:
        error4 = 1
    if error1 == -1 and error2 == -1 and error3 == -1 and error4 == -1:
        return "skip"
    else:
        if error1 != -1:
            m = 2
        elif error2 != -1:
            m = 1
        elif error3 != -1:
            m = 2
        elif error4 != -1:
            m = 1

        xDirection = m
        return m


def scan_for_position():
    ## TOS scans
    pos = imagesearcharea(TOS_PRE_POST_GREEN_X, 0, 0, 1280, 1024)
    if pos[0] != -1:
        mouse_position = pyautogui.position()
        click_image(TOS_PRE_POST_GREEN_X, pos, "left", 0, offset=0)
        pyautogui.moveTo(mouse_position[0], mouse_position[1])

    pos = imagesearcharea(TOS_PRE_POST_RED_X, 0, 0, 1280, 1024)
    if pos[0] != -1:
        mouse_position = pyautogui.position()
        click_image(TOS_PRE_POST_RED_X, pos, "left", 0, offset=0)
        pyautogui.moveTo(mouse_position[0], mouse_position[1])

    pos = imagesearcharea(TOS_POS_LONG, 0, 0, 1280, 1024)
    if pos[0] != -1:
        xPosition = 2
        return 2
    pos = imagesearcharea(TOS_POS_SHORT, 0, 0, 1280, 1024)
    if pos[0] != -1:
        xPosition = 1
        return 1
    pos = imagesearcharea(TOS_POS_FLAT, 0, 0, 1280, 1024)
    if pos[0] != -1:
        xPosition = 0
        return 0


def send_a_trade():
    if broker_selection == "TOS":
        trade_tos()


def trade_tos():
    if xPosition == 0 and xDirection == 2:
        automated_trade(BUY_Image_TOS, "POSITION - BUY / LONG")
    elif xPosition == 0 and xDirection == 1:
        automated_trade(SELL_Image_TOS, "POSITION - SELL / SHORT")
    elif xPosition == 1 and xDirection == 2 or xPosition == 2 and xDirection == 1:
        automated_trade(Reverse_Image_TOS, "POSITION - REVERSED")


def automated_trade(position, message):
    mouse_position = pyautogui.position()

    pos = imagesearcharea(position, 0, 0, 1280, 1024)
    if pos[0] != -1:
        click_image(position, pos, "left", 0, offset=0)

    pyautogui.moveTo(mouse_position[0], mouse_position[1])


sleep = 0
while sleep == 0:
    auto_trade()
