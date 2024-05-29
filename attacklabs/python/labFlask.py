from flask import Flask, render_template_string, request
from mako.template import Template as MakoTemplate
from django.conf import settings
from django.template import engines
from django.apps import apps

# Configure Django settings
settings.configure(
    INSTALLED_APPS=[
        'django.contrib.contenttypes',
        'django.contrib.auth',
    ],
    TEMPLATES=[
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]
)

# Initialize Django apps
apps.populate(settings.INSTALLED_APPS)

app = Flask(__name__)

# Initialize Django template engine
django_engine = engines['django']

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>School Quiz</title>
    <link rel="stylesheet" href="./static/styles.css">
</head>
<body>

<div class="container">
    <h1>School Quiz</h1>
    <p class="description">Test your knowledge with this fun and challenging quiz!</p>
    <form id="quizForm" method="post">
        <div class="question">
            <h2>1. What is the capital of France?</h2>
            <ul class="answers">
                <li><input type="radio" name="q1" value="Paris"> Paris</li>
                <li><input type="radio" name="q1" value="London"> London</li>
                <li><input type="radio" name="q1" value="Berlin"> Berlin</li>
                <li><input type="radio" name="q1" value="Madrid"> Madrid</li>
            </ul>
        </div>
        <div class="question">
            <h2>2. Which planet is known as the Red Planet?</h2>
            <ul class="answers">
                <li><input type="radio" name="q2" value="Earth"> Earth</li>
                <li><input type="radio" name="q2" value="Mars"> Mars</li>
                <li><input type="radio" name="q2" value="Jupiter"> Jupiter</li>
                <li><input type="radio" name="q2" value="Venus"> Venus</li>
            </ul>
        </div>
        <div class="question">
            <h2>3. What is the largest ocean on Earth?</h2>
            <ul class="answers">
                <li><input type="radio" name="q3" value="Atlantic Ocean"> Atlantic Ocean</li>
                <li><input type="radio" name="q3" value="Indian Ocean"> Indian Ocean</li>
                <li><input type="radio" name="q3" value="Pacific Ocean"> Pacific Ocean</li>
                <li><input type="radio" name="q3" value="Arctic Ocean"> Arctic Ocean</li>
            </ul>
        </div>
        <div class="question">
            <h2>4. What is the square root of 64?</h2>
            <div class="input-answer">
                {{ text_input | safe }}
            </div>
        </div>
        <div class="question">
            <h2>5. Who wrote "To Kill a Mockingbird"?</h2>
            <ul class="answers">
                <li><input type="radio" name="q5" value="Harper Lee"> Harper Lee</li>
                <li><input type="radio" name="q5" value="Mark Twain"> Mark Twain</li>
                <li><input type="radio" name="q5" value="Ernest Hemingway"> Ernest Hemingway</li>
                <li><input type="radio" name="q5" value="F. Scott Fitzgerald"> F. Scott Fitzgerald</li>
            </ul>
        </div>
        <div class="form-group">
            <button type="submit">Submit</button>
        </div>
    </form>
    {% if user_answers %}
    <div class="output">
        <h2>Your Answers</h2>
        <p>1. What is the capital of France? - {{ user_answers.q1 }}</p>
        <p>2. Which planet is known as the Red Planet? - {{ user_answers.q2 }}</p>
        <p>3. What is the largest ocean on Earth? - {{ user_answers.q3 }}</p>
        <p>4. What is the square root of 64? - {{ user_answers.q4 }}</p>
        <p>5. Who wrote "To Kill a Mockingbird"? - {{ user_answers.q5 }}</p>
    </div>
    {% endif %}
</div>

<div class="footer">
    <p>&copy; 2024 School Quiz. All rights reserved.</p>
    <p>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact Us</a>
    </p>
</div>

<script src="/static/script.js"></script>

</body>
</html>
'''

HTML_TEMPLATE_MAKO = HTML_TEMPLATE.replace('{{ text_input | safe }}', '${text_input}').replace('{{ user_answers.q1 }}', '${user_answers["q1"]}').replace('{{ user_answers.q2 }}', '${user_answers["q2"]}').replace('{{ user_answers.q3 }}', '${user_answers["q3"]}').replace('{{ user_answers.q4 }}', '${user_answers["q4"]}').replace('{{ user_answers.q5 }}', '${user_answers["q5"]}').replace('{% if user_answers %}', '% if user_answers:').replace('{% endif %}', '% endif')


@app.route('/lab_i2', methods=['GET', 'POST'])
def jinja2_quiz():
    try:
        user_answers = None
        if request.method == 'POST':
            text_input_raw = request.form.get('q4', '')
            user_answers = {
                'q1': request.form.get('q1', 'Not answered'),
                'q2': request.form.get('q2', 'Not answered'),
                'q3': request.form.get('q3', 'Not answered'),
                'q4': render_template_string(text_input_raw),
                'q5': request.form.get('q5', 'Not answered'),
            }
        text_input = '<input type="text" name="q4" placeholder="Type your answer here...">'
        return render_template_string(HTML_TEMPLATE.replace('{{{{', '{{').replace('}}}}', '}}'), text_input=text_input, user_answers=user_answers)
    except Exception:
        return HTML_TEMPLATE.replace('{{{{', '{{').replace('}}}}', '}}')

@app.route('/lab_i3', methods=['GET', 'POST'])
def django_quiz():
    try:
        user_answers = None
        if request.method == 'POST':
            text_input_raw = request.form.get('q4', '')
            text_input_template = django_engine.from_string(text_input_raw)
            user_answers = {
                'q1': request.form.get('q1', 'Not answered'),
                'q2': request.form.get('q2', 'Not answered'),
                'q3': request.form.get('q3', 'Not answered'),
                'q4': text_input_template.render(),
                'q5': request.form.get('q5', 'Not answered'),
            }
        text_input_template = django_engine.from_string('<input type="text" name="q4" placeholder="Type your answer here...">')
        text_input = text_input_template.render()
        html_template = django_engine.from_string(HTML_TEMPLATE.replace('{{{{', '{{').replace('}}}}', '}}'))
        return html_template.render({'text_input': text_input, 'user_answers': user_answers})
    except Exception:
        return HTML_TEMPLATE.replace('{{{{', '{{').replace('}}}}', '}}')

@app.route('/lab_i4', methods=['GET', 'POST'])
def mako_quiz():
    try:
        user_answers = None
        if request.method == 'POST':
            text_input_raw = request.form.get('q4', '')
            text_input_template = MakoTemplate(text_input_raw)
            user_answers = {
                'q1': request.form.get('q1', 'Not answered'),
                'q2': request.form.get('q2', 'Not answered'),
                'q3': request.form.get('q3', 'Not answered'),
                'q4': text_input_template.render(),
                'q5': request.form.get('q5', 'Not answered'),
            }
        text_input_template = MakoTemplate('<input type="text" name="q4" placeholder="Type your answer here...">')
        text_input = text_input_template.render()
        html_template = MakoTemplate(HTML_TEMPLATE_MAKO)
        return html_template.render(text_input=text_input, user_answers=user_answers)
    except Exception:
        return HTML_TEMPLATE_MAKO

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=44044, debug=True)