from flask import jsonify

def response(message, status="SUCCESS", data=None, status_code=200):
    response = {
        "message": message,
        "status": status
    }
    if data:
        response["data"] = data
    return jsonify(response), status_code