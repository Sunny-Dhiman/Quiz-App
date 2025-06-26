# 🎯 Quiz App

A simple, interactive *web-based Quiz App* built with *HTML, **CSS, and **JavaScript*.

- ✅ Choose a difficulty level: *Easy, **Moderate, **Medium, **Hard, or **Harder*.
- 📁 Upload a custom JSON file and dynamically add it to the difficulty selector.
- 🏁 Click *“Go to Quiz”* after uploading to play custom questions.
- 🗄 Maintain seamless user experience by merging uploaded questions with the defaults.

---

## 🌐 Demo
Try it live 👉 [https://codecraft.22web.org/quiz-app/index.html](https://codecraft.22web.org/quiz-app/index.html)

---

## 📋 Features
- 🏁 Multiple difficulty levels
- 📁 Custom JSON file upload
- ✅ Client-side JSON schema validation
- 🗂 Dynamic injection of custom questions
- ⚡ Pure JavaScript + JSON (no backend required for the core quiz)

---

## ⚡ Getting Started

### ✅ Prerequisites
- A modern browser
- No build tools required (just open index.html)

### 📥 Installation
1. Clone the repository:
    bash
    git clone https://github.com/Sunny-Dhiman/Quiz-App.git
    
2. Open index.html in a browser.

---

## ⚙ Usage
1. Open index.html.
2. *Upload a JSON file* matching the required schema.
3. Click *Go to Quiz*.
4. Choose a difficulty level (including your uploaded custom quiz).
5. Start answering questions!

---

## ⚡ Required JSON Schema
Each uploaded JSON file *must be an array of questions*:

### ✅ Example
```json
[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "Berlin", "Rome", "Madrid"],
    "answer": "Paris"
  },
  {
    "question": "Which planet is known as the Red Planet?",
    "options": ["Earth", "Venus", "Mars", "Jupiter"],
    "answer": "Mars"
  }
]
```

### ⚡ JSON Schema Specification
```json
{
  "title": "Question Array Schema",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "question": { "type": "string", "minLength": 1 },
      "options": {
        "type": "array",
        "items": { "type": "string", "minLength": 1 },
        "minItems": 4,
        "maxItems": 4
      },
      "answer": { "type": "string", "minLength": 1 }
    },
    "required": ["question", "options", "answer"],
    "additionalProperties": false
  }
}
```

---
## 📁 Project Structure
```
quiz-app/
├─ src/
│  ├─ quiz-files/        # Folder for sample JSON files
│  ├─ index.html         # Main page with upload & "Go to Quiz" button
│  ├─ script.js          # App logic (questions loader, difficulty handler, quiz rendering)
│  ├─ style.css          # Styles for the app
│  ├─ delete_file.php    # Deletes uploaded files when the session ends (or tab is closed/reloaded)
│  └─ upload.php         # Processes JSON file uploads
├─ README.md             # Project Documentation
├─ LICENCE.txt           # Project License
```

---

## 👥 Contribution
This is a *personal project* and is not open for external contributions.

---

## 🗄 Links
- 🌐 Demo: [https://codecraft.22web.org/quiz-app/index.html](https://codecraft.22web.org/quiz-app/index.html)  
- 💻 Source Code: [https://github.com/Sunny-Dhiman/Quiz-App/](https://github.com/Sunny-Dhiman/Quiz-App/)

---

## ⚡ License
This project is licensed under the *MIT License*.