from  flask import Flask,request,jsonify
from flask_cors import CORS
from models import db,TodoList,Task

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
db.init_app(app)


with app.app_context():
    db.create_all() 
    
    
@app.route('/gettodos', methods=['GET'])
def get_todos():
    todos = TodoList.query.all()
    return jsonify([{'id': todo.id, 'task': todo.task, 'completed': todo.completed} for todo in todos])

@app.route('/createtodos', methods=['POST'])
def create_todos():
    data = request.json

    # Validate incoming data
    if not data or 'name' not in data or 'description' not in data or 'tasks' not in data:
        return jsonify({"message": "Invalid input"}), 400

    # Create a new TodoList
    new_todo_list = TodoList(name=data['name'], description=data['description'])

    # Add tasks to the TodoList
    for task_data in data['tasks']:
        if 'task' in task_data:
            new_task = Task(task=task_data['task'], todo_list=new_todo_list)
            new_todo_list.tasks.append(new_task)

    # Add the new TodoList to the session and commit
    db.session.add(new_todo_list)
    db.session.commit()

    return jsonify({"message": "Todo list created successfully", "id": new_todo_list.id}), 201

    


if __name__ == '__main__':
    app.run(debug=True)
    