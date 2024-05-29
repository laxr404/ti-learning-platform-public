function submitQuiz() {
    var form = document.getElementById('quizForm');
    var output = document.getElementById('output');
    var formData = new FormData(form);
    var results = "You answered:\n";
    results += "1. What is the capital of France? - " + (formData.get('q1') || "Not answered") + "\n";
    results += "2. Which planet is known as the Red Planet? - " + (formData.get('q2') || "Not answered") + "\n";
    results += "3. What is the largest ocean on Earth? - " + (formData.get('q3') || "Not answered") + "\n";
    results += "4. What is the square root of 64? - " + (formData.get('q4') || "Not answered") + "\n";
    results += "5. Who wrote \"To Kill a Mockingbird\"? - " + (formData.get('q5') || "Not answered") + "\n";
    output.innerText = results;
    output.style.color = "#495057";
}
