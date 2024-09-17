# Caller bot

A telegram bot that stores and displays token data from when they were called with the intent to see how much the price has increased since the call was made.

## Features

- Saves token data from any of the chains available on the dexscreener API (mainly SOL and ETH).
- Updates the price every X minutes
- Displays the data through telegram commands

## Todos

- Better multiple chat support. Current setup saves a different entry for every group chat separately which in turn causes more separate API and DB calls to update
  marketcap values
- Add tests
- Add a stats leaderbord for every caller
