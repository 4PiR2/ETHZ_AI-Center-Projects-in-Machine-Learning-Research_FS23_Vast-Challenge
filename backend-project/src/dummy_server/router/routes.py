from flask_restful import Api
from flask import request
from dummy_server.resources.calculate_scores import get_scores
from dummy_server.resources.get_data import get_graph, get_illegal_nodes, get_user_flags

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

    return api

