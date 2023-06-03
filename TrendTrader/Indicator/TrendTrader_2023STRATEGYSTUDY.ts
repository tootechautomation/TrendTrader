############################################################################################################
####                                             DEVELOPER INFO                                          ###
############################################################################################################
# Developer: FollowTheTrend
# Project Title: TrendTrader - The Complete Package To Profits
# Description: This Indicator Works with the TrendTrader Bundle to Auto Trade For You
# Version: 2.0
# Release Date: 1/19/2023
#
# Rumble: https://rumble.com/user/FollowTheTrend
# GitHub: https://github.com/tootechautomation/TrendTrader
# TOS: https://tos.mx/1gO8fyV
# Note: For Interactive Brokers - Purchase the following Market Subscriptions: (Level 1)
#       1. NYSE (Network A/CTA) - Trader Workstation ($1.50)
#       2. NYSE American, BATS, ARCA, IEX, and Regional Exchanges (Network B) - Trader Workstation ($1.50)
#          Why? This allows you to send orders without a confirmation prompt
#          Note: Enable instant transmit and disable all neccessary order confirmations under messages
#       3. CBOT Real-Time - Trader Workstation ($1.25) - Futures Data
#       Note: Make sure to set preset amounts in IB to allow the more than total cost of (stocks/futures position #x 2) 
#
# PLEASE NOTE:
#  SOXL: 4 MIN 
#  /TN : 5 MIN
############################################################################################################
####                                             MAIN VARIABLES                                          ###
############################################################################################################
#hidePricePlot(yes);
def TradeCheck        = if getSymbol() == "SOXL"     then 2 else    # ETF 
                        if getSymbol() == "SOXS"     then 2 else
                        if getSymbol() == "/TN:XCBT" then 1 else 0; # Future
########################
###  CORE SCRIPT     ###
########################
def xdiff             = if TradeCheck == 1 then 0.65 else if TradeCheck == 2 then 0.30 else 0;
def OpenDiff          = 1;
def futuredigit       = 1;
def futurecount       = 2;
def futureagg         = AggregationPeriod.FIVE_MIN;
def CandleBody        = BodyHeight();
def vhl2              = hl2;
def vhigh             = high;
def vlow              = low;
def vohlc4            = ohlc4;
def vclose            = close;
def vopen             = open;
def avghb             = round(Average(vhigh[1] - vlow[1], 5),2);
def avghb1            = if (vhigh[1] - vLow[1]) > (avghb * 2) or
                           (vhigh[1] - vLow[1]) >= (xdiff + 0.02)  then 1 else 0;
def isRollover        = GetYYYYMMDD() != GetYYYYMMDD()[1];
def beforeStart       = GetTime() < RegularTradingStart(GetYYYYMMDD());
def afterEnd          = GetTime() > RegularTradingEnd(GetYYYYMMDD());
def firstBarOfDay     = if (beforeStart[1] == 1 and beforeStart == 0) or (isRollover and beforeStart == 0)                                then 1          else 0;
def lastBarOfDay      = if (afterEnd[-1] == 1 and afterEnd == 0) or (isRollover[-1] and firstBarOfDay[-1])                                then 1          else 0;
def reduceddiff       = if OpenDiff        then (vopen + (xdiff - 0.265)) >= vhigh and (vopen - (xdiff - 0.265)) <= vlow else 1;
def limitcandles      = if TradeCheck == 2 then 1 else if TradeCheck == 1                                                                 then 0          else 1;
def x1                = if TradeCheck == 2 then round(Average(vhl2,1),1)                                                                                  else 
                        if TradeCheck == 1 then round(SimpleMovingAvg(close(period = futureagg),futurecount),futuredigit)                                 else round(Average(vhl2,1),1); ;
def x2                = if TradeCheck == 2 then round(vohlc4[1],1)                                                                                        else 
                        if TradeCheck == 1 then round(ohlc4(period = futureagg),futuredigit)                                                              else round(vohlc4[1],1);
def x3                = if TradeCheck == 1 then round(WildersAverage(close(period = futureagg),futurecount),futuredigit)                                  else round(WildersAverage(close(period = futureagg),2),1);
def CORE_LINE_2       = if TradeCheck == 2 and x2 == x2[1] and x1 != x1[1]                                                                then x2         else
                        if TradeCheck == 2 and x1 == x1[2] and x2 != x2[1]                                                                then x1         else x1;
def CORE_LINE_1       = if TradeCheck == 1 and x1 == CORE_LINE_1[1]                                                                       then x1         else
                        if TradeCheck == 1 and x2 == CORE_LINE_1[1]                                                                       then x2[1]      else
                        if TradeCheck == 1 and x3 == CORE_LINE_1[1]                                                                       then x3[1]      else                                                
                        if TradeCheck == 1 and x3 == x3[1] and x2 != x2[1] or TradeCheck == 1 and x3 == x3[1] and x1 != x1[1]             then x3[1]      else
                        if TradeCheck == 1 and x3 == x3[1] and x2 != x2[1] and x1 != x1[1]                                                then x3[1]      else
                        if TradeCheck == 1 and x2 == x2[1] and x1 != x1[1] or TradeCheck == 1 and x2 == x2[1] and x3 != x3[1]             then x2[1]      else
                        if TradeCheck == 1 and x2 == x2[1] and x1 != x1[1] and x3 != x3[1]                                                then x2[1]      else
                        if TradeCheck == 1 and x1 == x1[1] and x2 != x2[1] or TradeCheck == 1 and x1 == x1[1] and x3 != x3[1]             then x1         else
                        if TradeCheck == 1 and x1 == x1[1] and x2 != x2[1] and x3 != x3[1]                                                then x1         else x3[1];
def CORE_LINE         = if TradeCheck == 2 then CORE_LINE_2                                                                                               else
                        if TradeCheck == 1 then CORE_LINE_1                                                                                               else 0;
plot C_LINE           = if TradeCheck == 2 and CORE_LINE == 0                                                                             then Double.NaN else
#                        if TradeCheck == 1 then x1                                                                                                        else
                        if TradeCheck == 2 then CORE_LINE                                                                                                 else CORE_LINE;
plot C_LINE1          = if TradeCheck == 1 then CORE_LINE                                                                                                 else Double.NaN;
def  CORE_X           = if vhigh > C_LINE and vlow <= (round(vhigh,1) - (xdiff - 0.10)) and round(vhl2,1) <= C_LINE                       then 1 else
                        if vlow  < c_LINE and vhigh > (round(vlow,1)  + (xdiff - 0.10)) and round(vhl2,1) >= C_LINE                       then 2 else 0;
def CORE_PRE          = if TradeCheck == 2 and CORE_X == 1 and CORE_LINE == CORE_LINE[1]                                                  then 1          else
                        if TradeCheck == 2 and CORE_X == 2 and CORE_LINE == CORE_LINE[1]                                                  then 2          else
                        if CORE_LINE > CORE_LINE[1] and !(x1 > x1[1] and x2[1] < x2[2]) and !(x1 < x1[1] and x2[1] > x2[2])               then 2          else 
                        if CORE_LINE < CORE_LINE[1] and !(x1 > x1[1] and x2[1] < x2[2]) and !(x1 < x1[1] and x2[1] > x2[2])               then 1          else  CORE_PRE[1];
def CORE_BIG          = if TradeCheck == 2 and CORE_LINE > CORE_LINE[1] and CORE_LINE[1] > CORE_LINE[2]                                   then 2          else 
                        if TradeCheck == 2 and vhigh[1] - vLow[1] >= xdiff and avghb1 and CORE_PRE[1] == 1 and 
                           round(vHigh,1) - round(vLow,1) >= (xdiff - 0.10) and vHigh > vHigh[1]                                          then 2          else
                        if TradeCheck == 2 and BarNumber() == 2 and vhigh[1] - vLow[1] >= xdiff and avghb1 and CORE_PRE[1] == 1           then 2          else
                        if TradeCheck == 2 and vhigh[1] - vLow[1] >= xdiff and avghb1 and CORE_PRE[1] == 1 and
                         !(CandleBody[2] >= (xdiff - 0.10)) and vhl2 > vlow[1]                                                            then 2          else
                        if TradeCheck == 2 and CORE_LINE < CORE_LINE[1] and CORE_LINE[1] < CORE_LINE[2]                                   then 1          else 
                        if TradeCheck == 2 and vhigh[1] - vLow[1] >= xdiff and avghb1 and CORE_PRE[1] == 2 and 
                           round(vHigh,1) - round(vLow,1) >= (xdiff - 0.10) and vLow < vLow[1]                                            then 1          else
                        if TradeCheck == 2 and BarNumber() == 2 and vhigh[1] - vLow[1] >= xdiff and avghb1 and CORE_PRE[1] == 2           then 1          else
                        if TradeCheck == 2 and vhigh[1] - vLow[1] >= xdiff and avghb1 and CORE_PRE[1] == 2 and
                         !(CandleBody[2] >= (xdiff - 0.10)) and vhl2 < vhigh[1]                                                           then 1          else
                        if TradeCheck == 2 and CORE_LINE != CORE_LINE[1]                                                                  then 0          else CORE_BIG[1];
def CORE_POSITION_POS = if TradeCheck == 2 and firstBarOfDay or
                           TradeCheck == 2 and lastBarOfDay                                                                               then 3          else
                        if TradeCheck == 1 and x1 > CORE_LINE                                                                             then 2          else 
                        if TradeCheck == 1 and x1 < CORE_LINE                                                                             then 1          else
                        if TradeCheck == 2 and CORE_BIG == 2 and CORE_BIG[1] != 1                                                         then 2          else
                        if TradeCheck == 2 and CORE_BIG == 1 and CORE_BIG[1] != 2                                                         then 1          else
                        if CORE_PRE == 2 and reduceddiff                                                                                  then 2          else
                        if CORE_PRE == 1 and reduceddiff                                                                                  then 1          else CORE_PRE;
def CORE_POSITION1    = if CORE_POSITION_POS == 2                                                                                         then 2          else
                        if CORE_POSITION_POS == 1                                                                                         then 1          else CORE_POSITION1[1];
########################
### POST-CORE SCRIPT ###
########################
############################################################################################################
####                                             MAIN LABELS                                             ###
############################################################################################################
AddLabel(yes,"Rumble: @FollowTheTrend - Like and Follow                                                 ", Color.GRAY);
AddLabel(yes,          " ", Color.LIGHT_GRAY);
AddLabel(yes, 
              if  CORE_POSITION_POS == 3        then "PENDING"       else
              if  CORE_POSITION_POS == 2        then "UPTREND"       else 
              if  CORE_POSITION_POS == 1        then "DNTREND"       else "WAITING",
              if  CORE_POSITION_POS == 3        then Color.WHITE     else
              if  CORE_POSITION_POS == 2        then Color.GREEN     else 
              if  CORE_POSITION_POS == 1        then Color.RED       else Color.WHITE);
AddLabel(yes,          " ", Color.LIGHT_GRAY);
############################################################################################################
####                                             MAIN COLOR BARS                                         ###
############################################################################################################
assignpricecolor(if TradeCheck == 2   and CORE_X == 1       and CORE_LINE == CORE_LINE[1] then Color.Light_RED else
                 if TradeCheck == 2   and CORE_X == 2       and CORE_LINE == CORE_LINE[1] then Color.Light_Green else
                 if IsNaN(vclose[-1]) and !IsNaN(vclose[1]) and CORE_POSITION_POS == 2    then Color.LIGHT_GREEN else 
                 if IsNaN(vclose[-1]) and !IsNaN(vclose[1]) and CORE_POSITION_POS == 1    then Color.LIGHT_RED else Color.GRAY);
############################################################################################################
####                                             MAIN BACKTEST                                           ###
############################################################################################################
#AddOrder(OrderType.BUY_AUTO,      CORE_POSITION_POS[-1] == 2, name = "", tickcolor = Color.WHITE, arrowcolor = Color.WHITE);
#AddOrder(OrderType.SELL_AUTO,     CORE_POSITION_POS[-1] == 1, name = "", tickcolor = Color.WHITE, arrowcolor = Color.WHITE);
#AddOrder(OrderType.BUY_TO_CLOSE,  CORE_POSITION_POS[-1] == 3, name = "", tickcolor = Color.WHITE, arrowcolor = Color.WHITE);
#AddOrder(OrderType.SELL_TO_CLOSE, CORE_POSITION_POS[-1] == 3, name = "", tickcolor = Color.WHITE, arrowcolor = Color.WHITE);