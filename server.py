from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

lesson_plan = {
    0: {
        "title": "Getting Started",
        "description": "how to read guitar tabs and the basics", 
        "completed": False,
        "lesson_id": 1
    },
    1:{
        "title": "C Major",
        "description": "the basic, open C major shape", 
        "completed": False,
        "lesson_id": 2
    },
    2 : {
        "title": "Quiz 1",
        "description": "test understanding of the lessons above", 
        "completed": False,
        "lesson_id": 3
    },
    3: {
        "title": "A Major",
        "description": "the basic, open A major shape", 
        "completed": False,
        "lesson_id": 4
    },
    4: {
        "title": "G Major",
        "description": "the basic, open G major shape", 
        "completed": False,
        "lesson_id": 5
    },
    5 : {
        "title": "D Major",
        "description": "the basic, open D major shape",
        "completed": False,
        "lesson_id": 6
    },
    6 : {
        "title": "D Major",
        "description": "the basic, open D major shape",
        "completed": False,
        "lesson_id": 7
    }
}

lesson_content = {
    0: [# Meta Data
        {
            "lessons": ["Getting Started", "Guitar ","Chords", "Practice"],
        },
        {
            "chord": "Getting Started",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "order": 1,
            "type": "info",
            "lesson_id": 1
        },
        ],
        # Lesson Data
    1: [
        {
            "lessons": ["C Major", "General Shape"],
        },
        {
            "chord": "C Major",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "order": 1,
            "type": "info",
            "lesson_id": 1
        },
        {
            "chord": "C Major Shape",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "order": 1,
            "type": "chord",
            "lesson_id": 2
        }
        ],

     2: [
        {
            "chord": "A Major",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "order": 3,
            "lesson_id": 3
        },
        {
            "chord": "G Major",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "order": 4,
            "lesson_id": 4
        },
        {
            "chord": "G Major",
            "image": "https://chordbank.com/cb4dg/artful_mae_1_750.png",
            "notes": ["A", "E", "A", "C#", "E"],
            "video": "video link",
            "audio": "file path",
            "order": 5,
            "lesson_id": 5
        }]
}

quiz_content = {
# Quiz 1 
0:[ 
    # Question 1
    {
        "task": "Play an A Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ['E', 'A', 'E', 'A', 'C#', 'X'],
        "user": [],
    },
    # Question 2
    {
        "task": "Test Question",
        "directions": "Please Select the best answer.",
        "answer": "A",
        "user": [],
        "options": [
                    { "value": "A", "text": "Choice A" },
                    { "value": "B", "text": "Choice B" },
                    { "value": "C", "text": "Choice C" },
                    { "value": "D", "text": "Choice D" }
                    ]
    },
    # Question 3
    {
        "task": "Play an C Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ['X', 'X', 'X', 'X', 'X', 'X'],
        "user": []
    },
     # Question 4
    {
        "task": "Play an G Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ['X', 'X', 'X', 'X', 'X', 'X'],
        "user": []
    }
]
    }

# Handles Peristatnce of lesson during learn section 
current_lesson_id = 1

# Handles Peristatnce of answers during quiz section 
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
    idx = int(id)

    return render_template('learn.html',lesson_content = lesson_content[idx], target_id = (current_lesson_id))  

@app.route('/quiz/<id>')
def quiz(id):
    id = int(id)
    return render_template('quiz_layout.html',
                            quiz_content = quiz_content[id],
                            current_question = current_question)

@app.route('/results/<id>')
def results(id):
    id = int(id)
    return render_template('results.html', quiz_content = quiz_content[id])   

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
    global quiz_content 

    json_data = request.get_json()   

    answer = json_data[0]
    idx = json_data[1] - 1
    
    # Add client to list if they arent already there
    quiz_content[0][idx]["user"] = answer

    print(quiz_content[0][idx])

    #send back the WHOLE array of sales, so the client can redisplay it
    return jsonify(quiz_content = quiz_content[0][idx])

@app.route('/mark_complete', methods=['GET', 'POST'])
def mark_complete():
    global lesson_plan

    json_data = request.get_json()   

    idx = json_data["idx"] - 1
    lesson_plan[idx]['completed'] = True

    return jsonify(current_question = current_question)


@app.route('/next_lesson', methods=['GET', 'POST'])
def next_lesson():
    global current_lesson_id 

    current_lesson_id += 1

    print(current_lesson_id)

    #send back the array of sales, so the client can redisplay it
    return jsonify(current_lesson_id = current_lesson_id)

@app.route('/prev_lesson', methods=['GET', 'POST'])
def prev_lesson():
    global current_lesson_id 

    current_lesson_id -= 1

    print(current_question)
    #send back the array of sales, so the client can redisplay it
    return jsonify(current_lesson_id = current_lesson_id)

@app.route('/reset_lesson', methods=['GET', 'POST'])
def reset_lesson():
    global current_lesson_id 

    current_lesson_id = 1

    #send back the array of sales, so the client can redisplay it
    return jsonify(current_question = current_question)

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




