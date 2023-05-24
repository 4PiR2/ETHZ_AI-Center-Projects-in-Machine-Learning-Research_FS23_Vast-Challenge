from flask_restful import Api
from flask import request
from dummy_server.resources.calculate_scores import get_scores
from dummy_server.resources.get_data import get_graph, get_illegal_nodes, get_user_flags, add_user_flag, add_illegal_node

def add_routes(app):
    api = Api(app)

    @app.route('/api/v1/scores', methods=['POST'])
    def get_suspicion_scores():
        data = request.get_json()
        graph = data.get('graph')
        illegal_nodes = data.get('illegal_nodes')
        user_flags = data.get('user_flags')

        scores = get_scores(graph, illegal_nodes, user_flags)
        return scores


    @app.route('/api/v1/graph')
    def get_graph_data():
        return get_graph()

    @app.route('/api/v1/illegal_nodes')
    def get_illegal_nodes_data():
        return get_illegal_nodes()

    @app.route('/api/v1/user_flags')
    def get_user_flags_data():
        return get_user_flags()

    @app.route('/api/v1/illegal_nodes', methods=['POST'])
    def add_illegal_node_data():
        data = request.get_json()
        new_node = data.get('new_node')
        if new_node:
            add_illegal_node(new_node)
            return jsonify({"message": f"Added {new_node} to illegal nodes"}), 201
        else:
            return jsonify({"error": "No new_node provided"}), 400

    @app.route('/api/v1/user_flags', methods=['POST'])
    def add_user_flag_data():
        data = request.get_json()
        new_flag = data.get('new_node')
        if new_flag:
            add_user_flag(new_flag)
            return jsonify({"message": f"Added {new_flag} to user flags"}), 201
        else:
            return jsonify({"error": "No new_flag provided"}), 400


    return api

