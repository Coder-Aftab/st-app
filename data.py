from turtle import pd
from nsepy import get_history
from datetime import date

data = get_history(symbol='SBIN',
                   start=date(2022, 7, 30),
                   end=date.today())
#print(data.to_json())

from binance.client import Client

api_key = ""
api_secret = ""

client = Client(api_key, api_secret)
exchange_info = client.get_exchange_info()
for s in exchange_info['symbols']:
    print(s['symbol'])