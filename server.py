from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

lessons = [
    {"Descriptio": "This lesson covers x,y,z", 
     "Completed": True
    }
    
] 
current_id = 4

# ROUTES
@app.route('/')
def welcome():
   return render_template('welcome.html')   

@app.route('/lessons')
def lessons():
    return render_template('lessons.html', lessons = lessons)  

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




