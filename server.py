from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

lesson_plan = {
    0: {
        "title": "Getting Started",
        "description": "how to read guitar tabs and the basics", 
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
            "future_lessons": ["Getting Started", "C Major","A Major", "G Major"],
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "next": "/learn/1",
            "back": "/lesson_plan",
            "order": 1
        },
    1: {
            "chord": "C Major",
            "text": "Text for page",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "future_lessons": ["Getting Started", "C Major","A Major", "G Major"],
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "next": "/learn/2",
            "back": "/learn/0",
            "order": 2
        },
    2: {
        "chord": "A Major",
        "text": "Text for page",
        "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
        "future_lessons": ["Getting Started", "C Major","A Major", "G Major"],
        "notes": ["A", "E", "A", "C#", "E"],
        "video": "video link",
        "audio": "file path",
        "next": "/learn/3",
        "back": "/learn/1",
        "order": 3
    },
    3: {
        "chord": "G Major",
        "text": "Text for page",
        "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
        "future_lessons": ["Getting Started", "C Major","A Major", "G Major"],
        "notes": ["A", "E", "A", "C#", "E"],
        "video": "video link",
        "audio": "file path",
        "next": "/lesson_plan",
        "back": "/learn/2",
        "order": 4
    }
}

quiz_content = {
# Quiz 1 
0:[ 
    # Question 1
    {
        "task": "Play an A Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ['E', 'A', 'E', 'A', 'C#', 'X'],
    },
    # Question 2
    {
        "task": "Sample Questions",
        "directions": "Please Select the best answer.",
        "answer": "a",
        "options": [
                    { "value": "A", "text": "Choice A" },
                    { "value": "B", "text": "Choice B" },
                    { "value": "C", "text": "Choice C" },
                    { "value": "D", "text": "Choice D" }
                    ]
    },
    # Question 3
    {
        "task": "Play an A Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ['E', 'A', 'E', 'A', 'C#', 'X'],
    },
     # Question 4
    {
        "task": "Play an A Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ['E', 'A', 'E', 'A', 'C#', 'X'],
    }
]
    }

# Handles Peristatnce of answers during quiz section 
current_answers = [[],'','']
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
    return render_template('quiz_layout.html',
                            quiz_content = quiz_content[id],
                            current_question = current_question, 
                            current_answers = current_answers)  

# Endpoints for templates
@app.route('/chord_quiz', methods=['GET'])
def chord_quiz():
     return render_template('chord_quiz.html')

@app.route('/multiple_choice', methods=['GET'])
def mp_quiz():
     return render_template('multiple_choice.html')


# AJAX FUNCTIONS
@app.route('/quiz/save_answer', methods=['GET', 'POST'])
def save_answer():
    global current_answers 

    json_data = request.get_json()   

    answer = json_data[0]
    idx = json_data[1] - 1
    
    # Add client to list if they arent already there
    current_answers[idx] = answer

    print(current_answers)

    #send back the WHOLE array of sales, so the client can redisplay it
    return jsonify(current_answers = current_answers)

@app.route('/quiz/next_question', methods=['GET', 'POST'])
def next_question():
    global current_question 

    current_question += 1

    print(current_question)
    #send back the array of sales, so the client can redisplay it
    return jsonify(current_question = current_question)

@app.route('/quiz/prev_question', methods=['GET', 'POST'])
def prev_question():
    global current_question 

    current_question -= 1

    print(current_question)
    #send back the array of sales, so the client can redisplay it
    return jsonify(current_question = current_question)

if __name__ == '__main__':
   app.run(debug = True, port=5001)




