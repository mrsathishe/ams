from flask import jsonify

def response(message, status=True, data=None, status_code=200):
    response = {
        "message": message,
        "status": "SUCCESS" if status else "FAILED"
    }
    if data:
        response["data"] = data
    return jsonify(response), status_code