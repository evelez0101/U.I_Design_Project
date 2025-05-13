from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

lesson_plan = {
    0: {
        "title": "Getting Started",
        "description": "how to read guitar tabs and the basics", 
        "completed": False,
        "type": "lesson",
        "lesson_id": 1
    },
    1:{
        "title": "C Major",
        "description": "the basic, open C major shape", 
        "completed": False,
        "type": "lesson",
        "lesson_id": 2
    },
    2 : {
        "title": "Assessment 1",
        "description": "tests comprehension of Getting Started and C Major", 
        "completed": False,
        "type": "quiz",
        "lesson_id": 3,
        "quiz_id": 2,
    },
    3: {
        "title": "A Major",
        "description": "the basic, open A major shape", 
        "completed": False,
        "type": "lesson",
        "lesson_id": 4
    },
    4: {
        "title": "G Major",
        "description": "the basic, open G major shape", 
        "completed": False,
        "type": "lesson",
        "lesson_id": 5
    },
    5: {
        "title": "Assessment 2",
        "description": "tests comprehension of A Major and G Major", 
        "completed": False,
        "type": "quiz",
        "lesson_id": 3,
        "quiz_id": 5,
    },
    6: {
        "title": "E Major",
        "description": "the basic, open E major shape",
        "completed": False,
        "type": "lesson",
        "lesson_id": 6
    },
    7: {
        "title": "D Major",
        "description": "the basic, open D major shape",
        "completed": False,
        "type": "lesson",
        "lesson_id": 7
    },
    8: {
        "title": "Assessment 3",
        "description": "tests comprehension of E Major and D Major", 
        "completed": False,
        "type": "quiz",
        "lesson_id": 3,
        "quiz_id": 8,
    },
}

lesson_content = {
    0: [# Meta Data
        {
            "lessons": ["Visualizing the Fretboard", "Fret Diagram"],
        },
        {
            "chord": "Guitar Parts",
            "image": "https://lh4.googleusercontent.com/proxy/Zx1cspM_AYlp_Z8fTd3iKLkJWG-TI_27IMgcwzu58SRqcSjGL9-9Tjtjsm6JVThgWI8sDx3cwxqCw7sb6FLOBnBSL-s4-xrnyVliTkG0V0w",
            "description": "This is general physical layout of your typical guitar. Starting from the nut and going right, the vertical lines dividing the fretboard \
                            (frets) are numbered starting from 1, all the way to however many frets your guitar has.",
            "type": "lessonzero",
            "order": 1,
            "lesson_id": 0
        },
        {
            "chord": "Diagram",
            "image": "https://acousticlife.tv/wp-content/uploads/2023/06/How-to-read-guitar-chords1-1160x653.jpg",
            "description": "As the image shows, the dots tell you where to place your fingers, the number indicates which finger to use, and the x's or o's above the nut indicate \
                            whether to not play the string, or play it openly respectively.",
            "type": "lessonzero",
            "order": 2,
            "lesson_id": 0
        }
        ],
        # Lesson Data
    1: [
        {
            "lessons": ["C Major","C Major Tab"],
        },
        {
            "chord": "C Major",
            "image": "https://richterguitar.com/wp-content/uploads/2024/03/c-major.png",
            "notes": ["E", "C", "G", "E", "C", "X"],
            "video": "https://www.youtube.com/embed/69-jsNK3FBs?si=BK_0kFcoWjRYQN_X",
            "audio": "file path",
            "type": "info",
            "order": 1,
            "lesson_id": 1
        },
        {
            "chord": "C Major Tab",
            "notes": ["E", "C", "G", "E", "C", "X"],
            "type": "chord",
            "order": 2,
            "lesson_id": 2
        }],
    3: [
        {
            "lessons": ["A Major", "A Major Tab"]
        },
        {
            "chord": "A Major",
            "image": "https://richterguitar.com/wp-content/uploads/2024/03/A-Major-Version-2.png",
            "notes": ["E", "C#", "A", "E", "A", "X"],
            "video": "https://www.youtube.com/embed/kTyYAEZgLLA?si=dQu6v_Kwk8X9nkgg",
            "audio": "file path",
            "type": "info",
            "order": 1,
            "lesson_id": 3
        },
        {
            "chord": "A Major Tab",
            "notes": ["E", "C#", "A", "E", "A", "X"],
            "type": "chord",
            "order": 2,
            "lesson_id": 2
        }
    ],
    4: [
        {
            "lessons": ["G Major","G Major Tab"]
        },
        {
            "chord": "G Major",
            "image": "https://richterguitar.com/wp-content/uploads/2024/03/G-major.png",
            "notes": ["G", "B", "G", "D", "B", "G"],
            "video": "https://www.youtube.com/embed/mGyY4sAG-ac?si=tz25CBwkyConBjJp",
            "audio": "file path",
            "type": "info",
            "order": 1,
            "lesson_id": 4
        },
        {
            "chord": "G Major Tab",
            "notes": ["G", "B", "G", "D", "B", "G"],
            "type": "chord",
            "order": 2,
            "lesson_id": 2
        }
    ],
    6: [
        {
            "lessons": ["E Major","E Major Tab"]
        },
        {
            "chord": "E Major",
            "image": "https://richterguitar.com/wp-content/uploads/2024/03/E-Major.png",
            "notes": ["E", "B", "G#", "E", "B", "E"],
            "video": "https://www.youtube.com/embed/aHDVoHKQsJM?si=Z4oKKDKxX74NCDw7",
            "audio": "file path",
            "type": "info",
            "order": 1,
            "lesson_id": 6
        },
        {
            "chord": "E Major Tab",
            "notes": ["E", "B", "G#", "E", "B", "E"],
            "type": "chord",
            "order": 2,
            "lesson_id": 2
        }
    ],
    7: [
        {
            "lessons": ["D Major", "D Major Tab"]
        },
        {
            "chord": "D Major",
            "image": "https://richterguitar.com/wp-content/uploads/2024/03/D-Major.png",
            "notes": ["F#", "D", "A", "D", "X", "X"],
            "video": "https://www.youtube.com/embed/xub0SHW1Kbk?si=AqpBXygG-btl5NLD",
            "audio": "file path",
            "type": "info",
            "order": 1,
            "lesson_id": 7
        },
        {
            "chord": "D Major Tab",
            "notes": ["F#", "D", "A", "D", "X", "X"],
            "type": "chord",
            "order": 2,
            "lesson_id": 2
        }
    ],
}

quiz_content = {
# Quiz 1 
2:[ 
    # Question 1
    {
        "task": "Play an C Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ["E", "C", "G", "E", "C", "X"],
        "user": [],
        "type": "chord",
        "lesson_id": 1
    },
    # Question 2
    {
        "task": "Guitar Basics",
        "directions": "What is the name of the vertical divider that sections that guitar and determines what note is played?",
        "answer": "A",
        "user": [],
        "type": "mult",
        "lesson_id": 0,
        "options": [
                    { "value": "A", "text": "Fret Wires" },
                    { "value": "B", "text": "The Nut" },
                    { "value": "C", "text": "Half-steps" },
                    { "value": "D", "text": "Fret Markers" }
                    ]
            
    },
    # Question 3
    {
        "task": "Guitar Basics",
        "directions": "When reading a chord shape, what does an X mean?",
        "answer": "B",
        "user": [],
        "type": "mult",
        "lesson_id": 0,
        "options": [
                    { "value": "A", "text": "Play the string openly" },
                    { "value": "B", "text": "Don't play the string" },
                    { "value": "C", "text": "Play that string loudly" },
                    { "value": "D", "text": "Play the string with your thumb" }
                    ]
    }],
5:[ 
    # Question 1
    {
        "task": "Play an A Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ["E", "C#", "A", "E", "A", "X"],
        "type": "chord",
        "user": [],
        "lesson_id": 3
    },
    # Question 2
    {
        "task": "Play an G Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ["G", "B", "G", "D", "B", "G"],
        "type": "chord",
        "user": [],
        "lesson_id": 4
    }],
8:[ 
    # Question 1
    {
        "task": "Play an E Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ["E", "B", "G#", "E", "B", "E"],
        "type": "chord",
        "user": [],
        "lesson_id": 6
    },
    # Question 2
    {
        "task": "Play an D Major Chord",
        "directions": "Please Select which notes to play and which notes to play.",
        "answer": ["F#", "D", "A", "D", "X", "X"],
        "type": "chord",
        "lesson_id": 7
    }]
    }

# Handles Peristatnce of lesson during learn section 
current_lesson_id = 1

# Handles Peristatnce of answers during quiz section 
current_question = 1

# ROUTES
@app.route('/')
def welcome():
   return render_template('welcome.html')   

@app.route('/report')
def report():
   return render_template('report_page.html', lesson_plan = lesson_plan)   

@app.route('/lesson_plan')
def lessons():
    print(lesson_plan)
    return render_template('lessons.html', lessons = lesson_plan)  

@app.route('/learn/<id>')
def learn(id):
    idx = int(id)

    return render_template('learn.html',lesson_content = lesson_content[idx], 
                                        current_lesson_id = current_lesson_id,
                                        id = id)  

@app.route('/quiz/<id>')
def quiz(id):
    id = int(id)
    return render_template('quiz_layout.html',
                            quiz_content = quiz_content[id],
                            current_question = current_question,
                            quiz_id = id)

@app.route('/results/<id>')
def results(id):
    id = int(id)
    return render_template('results.html', quiz_content = quiz_content[id], quiz_id = id)   

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
    id = int(json_data[2])

    # Add client to list if they arent already there
    quiz_content[id][idx]["user"] = answer

    print(quiz_content[id][idx])

    #send back the WHOLE array of sales, so the client can redisplay it
    return jsonify(quiz_content = quiz_content[id][idx])

@app.route('/mark_complete', methods=['GET', 'POST'])
def mark_complete():
    global lesson_plan

    json_data = request.get_json()   

    print(json_data)

    idx = int(json_data["idx"])

    lesson_plan[idx]['completed'] = True

    print(lesson_plan)

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

    #send back the array of sales, so the client can redisplay it
    return jsonify(current_question = current_question)

@app.route('/quiz/reset_question', methods=['GET', 'POST'])
def reset_question():
    global current_question 

    current_question = 1

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




