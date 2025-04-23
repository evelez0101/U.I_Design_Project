from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

lesson_plan = {
    0: {
        "description": "the basic, open C major shape", 
        "completed": True,
    },
    1: {
        "description": "the basic, open A major shape", 
        "completed": False,
    },
    2: {
        "description": "the basic, open G major shape", 
        "completed": True,
        "id": 2
    },
    3 : {
        "description": "the basic, open E major shape", 
        "completed": False,
    },
    4 : {
        "description": "the basic, open D major shape",
        "completed": False,
    }
}

lesson_content = {
    0: {
            "title": "a,b,c", 
            "text": "Text for page",
            "image": "link to image",
            "video": "video link",
            "audio": "file path",
            "next": "/quiz",
            "back": "/lesson_plan"
        }
}

quiz_content = {
    0: {
        "title": "Quiz 1", 
        "answer": [""],
        "image": "link to image",
        "video": "video link",
        "audio": "file path",
        "next": "/quiz",
    }

}

current_id = 4

# ROUTES
@app.route('/')
def welcome():
   return render_template('welcome.html')   

@app.route('/lessons')
def lessons():
    return render_template('lessons.html', lessons=lesson_plan)  

@app.route('/learn/<id>')
def learn(id):
    id = int(id)
    return render_template('learn.html',lesson_content = lesson_content[id])  

@app.route('/quiz/<id>')
def quiz(id):
    id = int(id)
    return render_template('chord_quiz.html',quiz_content = quiz_content[id])  

# AJAX FUNCTIONS

# ajax for log_sales.js
@app.route('/save_sale', methods=['GET', 'POST'])
def add_sale():
    global sales 
    global clients
    global current_id 

    json_data = request.get_json()   

    print(json_data)

    salesperson = json_data["salesperson"] 
    client = json_data["client"] 
    reams = json_data["reams"] 
    
    # Add client to list if they arent already there
    if (client not in clients):
        clients.append(client)
    
    # add new entry to array with 
    # a new id and the name the user sent in JSON
    current_id += 1
    new_id = current_id 
    new_sale = ({
                "salesperson": salesperson,
                "client": client,
                "reams": reams,
                "id": new_id
                })

    sales.append(new_sale)

    #send back the WHOLE array of sales, so the client can redisplay it
    return jsonify(sales = sales, clients = clients)

# ajax for log_sales.js
@app.route('/delete_sale', methods=['GET', 'POST'])
def delete_sale():
    global sales 

    json_data = request.get_json()   
    print("data: " + str(json_data))
    id_to_delete = json_data
    
    # Search for the entry in out list of sales
    for sale in sales:
        # Once its found it gets removed
        if sale["id"] == id_to_delete:
            sales.remove(sale)
            # break to remove unecessary search
            break

    #send back the array of sales, so the client can redisplay it
    return jsonify(sales = sales)

if __name__ == '__main__':
   app.run(debug = True, port=5001)




