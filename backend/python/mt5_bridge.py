#!/usr/bin/env python3
"""
MT5 Bridge - Python script to connect to MetaTrader 5 and provide trading functionality
This script serves as a REST API bridge between Node.js and MT5
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import MetaTrader5 as mt5
import pandas as pd
from datetime import datetime
import time
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global variable to store MT5 connection state
mt5_initialized = False
current_account = None


def initialize_mt5():
    """Initialize MT5 connection"""
    global mt5_initialized
    if not mt5.initialize():
        logger.error(f"MT5 initialization failed, error code: {mt5.last_error()}")
        return False
    mt5_initialized = True
    logger.info("MT5 initialized successfully")
    return True


def shutdown_mt5():
    """Shutdown MT5 connection"""
    global mt5_initialized
    mt5.shutdown()
    mt5_initialized = False
    logger.info("MT5 shutdown")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'mt5_initialized': mt5_initialized,
        'timestamp': datetime.now().isoformat()
    })


@app.route('/connect', methods=['POST'])
def connect():
    """Connect to MT5 account"""
    global current_account

    try:
        data = request.json
        account = int(data.get('account'))
        password = data.get('password')
        server = data.get('server')

        if not all([account, password, server]):
            return jsonify({'error': 'Missing credentials'}), 400

        # Initialize MT5 if not already done
        if not mt5_initialized:
            if not initialize_mt5():
                return jsonify({'error': 'Failed to initialize MT5'}), 500

        # Login to account
        authorized = mt5.login(account, password=password, server=server)

        if not authorized:
            error = mt5.last_error()
            logger.error(f"Login failed: {error}")
            return jsonify({'error': f'Login failed: {error}'}), 401

        current_account = account
        account_info = mt5.account_info()

        if account_info is None:
            return jsonify({'error': 'Failed to get account info'}), 500

        logger.info(f"Successfully connected to account {account}")

        return jsonify({
            'success': True,
            'account': account,
            'name': account_info.name,
            'server': account_info.server,
            'currency': account_info.currency,
            'balance': account_info.balance,
            'equity': account_info.equity,
            'margin': account_info.margin,
            'margin_free': account_info.margin_free,
            'margin_level': account_info.margin_level,
            'leverage': account_info.leverage
        })

    except Exception as e:
        logger.error(f"Connection error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/account/info', methods=['GET'])
def get_account_info():
    """Get account information"""
    try:
        if not mt5_initialized:
            return jsonify({'error': 'MT5 not initialized'}), 400

        account_info = mt5.account_info()

        if account_info is None:
            return jsonify({'error': 'Failed to get account info'}), 500

        return jsonify({
            'login': account_info.login,
            'name': account_info.name,
            'server': account_info.server,
            'currency': account_info.currency,
            'balance': account_info.balance,
            'equity': account_info.equity,
            'profit': account_info.profit,
            'margin': account_info.margin,
            'margin_free': account_info.margin_free,
            'margin_level': account_info.margin_level,
            'leverage': account_info.leverage,
            'trade_allowed': account_info.trade_allowed,
            'trade_expert': account_info.trade_expert
        })

    except Exception as e:
        logger.error(f"Error getting account info: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/symbols/prices', methods=['POST'])
def get_symbol_prices():
    """Get current prices for multiple symbols"""
    try:
        if not mt5_initialized:
            return jsonify({'error': 'MT5 not initialized'}), 400

        data = request.json
        symbols = data.get('symbols', ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD'])

        prices = {}

        for symbol in symbols:
            tick = mt5.symbol_info_tick(symbol)

            if tick is None:
                logger.warning(f"Failed to get tick for {symbol}")
                continue

            # Calculate spread in pips (for most pairs, multiply by 10000)
            # For JPY pairs, multiply by 100
            multiplier = 100 if 'JPY' in symbol else 10000
            spread_pips = (tick.ask - tick.bid) * multiplier

            prices[symbol] = {
                'symbol': symbol,
                'bid': tick.bid,
                'ask': tick.ask,
                'last': tick.last,
                'spread': round(spread_pips, 1),
                'time': datetime.fromtimestamp(tick.time).isoformat()
            }

        return jsonify({'prices': prices})

    except Exception as e:
        logger.error(f"Error getting prices: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/positions', methods=['GET'])
def get_positions():
    """Get all open positions"""
    try:
        if not mt5_initialized:
            return jsonify({'error': 'MT5 not initialized'}), 400

        positions = mt5.positions_get()

        if positions is None:
            return jsonify({'positions': []})

        positions_list = []

        for pos in positions:
            positions_list.append({
                'ticket': pos.ticket,
                'symbol': pos.symbol,
                'type': 'BUY' if pos.type == 0 else 'SELL',
                'volume': pos.volume,
                'price_open': pos.price_open,
                'price_current': pos.price_current,
                'sl': pos.sl,
                'tp': pos.tp,
                'profit': pos.profit,
                'swap': pos.swap,
                'commission': pos.commission,
                'time': datetime.fromtimestamp(pos.time).isoformat(),
                'comment': pos.comment
            })

        return jsonify({'positions': positions_list})

    except Exception as e:
        logger.error(f"Error getting positions: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/orders/history', methods=['POST'])
def get_order_history():
    """Get trade history"""
    try:
        if not mt5_initialized:
            return jsonify({'error': 'MT5 not initialized'}), 400

        data = request.json
        days = data.get('days', 30)  # Default to last 30 days

        from_date = datetime.now().timestamp() - (days * 24 * 60 * 60)
        to_date = datetime.now().timestamp()

        deals = mt5.history_deals_get(from_date, to_date)

        if deals is None:
            return jsonify({'history': []})

        history_list = []

        for deal in deals:
            if deal.entry == 1:  # Entry in (opening trade)
                history_list.append({
                    'ticket': deal.ticket,
                    'order': deal.order,
                    'symbol': deal.symbol,
                    'type': 'BUY' if deal.type == 0 else 'SELL',
                    'volume': deal.volume,
                    'price': deal.price,
                    'profit': deal.profit,
                    'commission': deal.commission,
                    'swap': deal.swap,
                    'time': datetime.fromtimestamp(deal.time).isoformat(),
                    'comment': deal.comment
                })

        return jsonify({'history': history_list})

    except Exception as e:
        logger.error(f"Error getting history: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/trade/open', methods=['POST'])
def open_trade():
    """Open a new trade"""
    try:
        if not mt5_initialized:
            return jsonify({'error': 'MT5 not initialized'}), 400

        data = request.json
        symbol = data.get('symbol')
        order_type = data.get('type')  # 'BUY' or 'SELL'
        volume = float(data.get('volume', 0.01))
        sl = float(data.get('sl', 0))
        tp = float(data.get('tp', 0))
        comment = data.get('comment', 'Web Trade')

        if not symbol or not order_type:
            return jsonify({'error': 'Missing required parameters'}), 400

        # Get symbol info
        symbol_info = mt5.symbol_info(symbol)
        if symbol_info is None:
            return jsonify({'error': f'Symbol {symbol} not found'}), 404

        # Enable symbol if not already enabled
        if not symbol_info.visible:
            if not mt5.symbol_select(symbol, True):
                return jsonify({'error': f'Failed to select symbol {symbol}'}), 500

        # Get current price
        tick = mt5.symbol_info_tick(symbol)
        if tick is None:
            return jsonify({'error': 'Failed to get current price'}), 500

        # Determine order type and price
        if order_type.upper() == 'BUY':
            trade_type = mt5.ORDER_TYPE_BUY
            price = tick.ask
        else:
            trade_type = mt5.ORDER_TYPE_SELL
            price = tick.bid

        # Prepare trade request
        request_dict = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": symbol,
            "volume": volume,
            "type": trade_type,
            "price": price,
            "sl": sl,
            "tp": tp,
            "deviation": 20,
            "magic": 234000,
            "comment": comment,
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }

        # Send trade request
        result = mt5.order_send(request_dict)

        if result is None:
            return jsonify({'error': 'Trade request failed'}), 500

        if result.retcode != mt5.TRADE_RETCODE_DONE:
            return jsonify({
                'error': f'Trade failed: {result.comment}',
                'retcode': result.retcode
            }), 400

        logger.info(f"Trade opened successfully: {result.order}")

        return jsonify({
            'success': True,
            'order': result.order,
            'ticket': result.deal,
            'volume': result.volume,
            'price': result.price,
            'comment': result.comment
        })

    except Exception as e:
        logger.error(f"Error opening trade: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/trade/close', methods=['POST'])
def close_trade():
    """Close an existing trade"""
    try:
        if not mt5_initialized:
            return jsonify({'error': 'MT5 not initialized'}), 400

        data = request.json
        ticket = int(data.get('ticket'))

        if not ticket:
            return jsonify({'error': 'Missing ticket number'}), 400

        # Get position info
        position = mt5.positions_get(ticket=ticket)

        if position is None or len(position) == 0:
            return jsonify({'error': 'Position not found'}), 404

        position = position[0]

        # Determine close type (opposite of open)
        if position.type == 0:  # BUY position
            trade_type = mt5.ORDER_TYPE_SELL
            price = mt5.symbol_info_tick(position.symbol).bid
        else:  # SELL position
            trade_type = mt5.ORDER_TYPE_BUY
            price = mt5.symbol_info_tick(position.symbol).ask

        # Prepare close request
        request_dict = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": position.symbol,
            "volume": position.volume,
            "type": trade_type,
            "position": ticket,
            "price": price,
            "deviation": 20,
            "magic": 234000,
            "comment": "Web Close",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }

        # Send close request
        result = mt5.order_send(request_dict)

        if result is None:
            return jsonify({'error': 'Close request failed'}), 500

        if result.retcode != mt5.TRADE_RETCODE_DONE:
            return jsonify({
                'error': f'Close failed: {result.comment}',
                'retcode': result.retcode
            }), 400

        logger.info(f"Position closed successfully: {ticket}")

        return jsonify({
            'success': True,
            'ticket': ticket,
            'close_price': result.price,
            'profit': position.profit
        })

    except Exception as e:
        logger.error(f"Error closing trade: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/disconnect', methods=['POST'])
def disconnect():
    """Disconnect from MT5"""
    try:
        shutdown_mt5()
        return jsonify({'success': True, 'message': 'Disconnected from MT5'})
    except Exception as e:
        logger.error(f"Error disconnecting: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Initialize MT5 on startup
    initialize_mt5()

    # Start Flask server
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    logger.info(f"Starting MT5 Bridge on port {port}")

    try:
        app.run(host='0.0.0.0', port=port, debug=False)
    finally:
        shutdown_mt5()
