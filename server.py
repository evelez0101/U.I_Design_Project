from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

lesson_plan = {
    0: {
        "title": "Getting Started",
        "description": "How to read guitar tabs and the basics", 
        "completed": False,
        "lesson_id": 0
    },
    1:{
        "title": "C Major",
        "description": "the basic, open C major shape", 
        "completed": False,
        "lesson_id": 1
    },
    2: {
        "title": "A Major",
        "description": "the basic, open A major shape", 
        "completed": False,
        "lesson_id": 2
    },
    3: {
        "title": "G Major",
        "description": "the basic, open G major shape", 
        "completed": False,
        "lesson_id": 3
    },
    4 : {
        "title": "Quiz 1",
        "description": "the basic, open E major shape", 
        "completed": False,
        "lesson_id": 4
    },
    5 : {
        "title": "D Major",
        "description": "the basic, open D major shape",
        "completed": False,
        "lesson_id": 5
    }
}

lesson_content = {
    0: {
            "chord": "Getting Started",
            "text": "Text for page",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "future_lessons": ["Getting Started","A Major", "G Major", "Check Point 1"],
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "next": "/learn/1",
            "back": "/lesson_plan",
            "order": 1
        },
    1: {
            "chord": "A Major",
            "text": "Text for page",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "future_lessons": ["Getting Started", "C Major","A Major", "G Major", "Check Point 1"],
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "next": "/quiz/0",
            "back": "/learn/0",
            "order": 2
        }
}

quiz_content = {
    0: 
        # First Question 1
        [ 
        {"title": "Quiz 1", 
        "task": "Play an A Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ["Open", "E", "A", "C#", "X"],
        "image": "link to image",
        "video": "video link",
        "audio": "file path",
        "next": "/quiz"},
        {"title": "Quiz 1", 
        "answer": "a",
        "image": "link to image",
        "video": "video link",
        "audio": "file path",
        "next": "/quiz"}
        ]
    }

current_answers = []

current_question = 1

# ROUTES
@app.route('/')
def welcome():
   return render_template('welcome.html')   

@app.route('/lesson_plan')
def lessons():
    return render_template('lessons.html', lessons=lesson_plan)  

@app.route('/learn/<id>')
def learn(id):
    id = int(id)
    return render_template('learn.html',lesson_content = lesson_content[id])  

@app.route('/quiz/<id>')
def quiz(id):
    id = int(id)
    return render_template('quiz_layout.html',quiz_content = quiz_content[id],current_question = current_question)  

# AJAX FUNCTIONS

# ajax for log_sales.js
@app.route('/save_answer', methods=['GET', 'POST'])
def save_answer():
    global current_answers 

    json_data = request.get_json()   

    print(json_data)

    answer = json_data["answer"] 
    question_number = json_data["question_number"] 
    
    # Add client to list if they arent already there
    current_answers[question_number] = answer

    #send back the WHOLE array of sales, so the client can redisplay it
    return jsonify(current_answers = current_answers)

@app.route('/chord_quiz', methods=['GET'])
def chord_quiz():
     return render_template('chord_quiz.html')

# ajax for log_sales.js
@app.route('/quiz/next_question', methods=['GET', 'POST'])
def next_question():
    global current_question 

    current_question += 1

    print(current_question)
    #send back the array of sales, so the client can redisplay it
    return jsonify(current_question = current_question)

# ajax for log_sales.js
@app.route('/quiz/prev_question', methods=['GET', 'POST'])
def prev_question():
    global current_question 

    current_question -= 1

    print(current_question)
    #send back the array of sales, so the client can redisplay it
    return jsonify(current_question = current_question)

if __name__ == '__main__':
   app.run(debug = True, port=5001)




