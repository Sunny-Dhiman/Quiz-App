// Global declaration for file
let inputFile;
// schema for validation
const schema = {
  title: "Question Array Schema",
  type: "array",
  items: {
    type: "object",
    properties: {
      question: {
        type: "string",
        minLength: 1,
        description: "The text of the question",
      },
      options: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
        },
        minItems: 4,
        maxItems: 4,
        description: "List of 4 options",
      },
      answer: {
        type: "string",
        minLength: 1,
        description: "The correct answer",
      },
    },
    required: ["question", "options", "answer"],
    additionalProperties: false,
  },
};

const ajv = new Ajv();
const validate = ajv.compile(schema);

// Removing files on unloading

window.addEventListener("beforeunload", (event) => {
  const data = new FormData();
  data.append("filename", inputFile);
  navigator.sendBeacon("delete_file.php", data);
});

// Input Validation
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    validateFileInput(event);
  });

function validateFileInput(event) {
  const fileInput = document.getElementById("fileInput");
  const errorDiv = document.getElementById("error-container");

  const allowedTypes = "application/json";
  //   validation //
  if (fileInput.files.length === 0) {
    errorDiv.innerHTML = `<li> <strong>Please choose a file.</strong> </li>`;
    fileInput.value = "";
    return false;
  } else if (fileInput.files[0].size > 1048576) {
    errorDiv.innerHTML = `<li>File size exceeded</li>`;
    fileInput.value = "";
    return false;
  } else if (!allowedTypes.includes(fileInput.files[0].type)) {
    errorDiv.innerHTML = `<li>File type not allowed</li>`;
    fileInput.value = "";
    return false;
  } else if (allowedTypes.includes(fileInput.files[0].type)) {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Compile the schema

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        // console.log(data);

        const isValid = validate(data); // Validate data against schema

        if (isValid) {
          return true;
        } else {
          console.error(validate.error);
          errorDiv.innerHTML = `<li>File data not formated as per Schema</li>`;
          fileInput.value = "";
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    };
    reader.readAsText(file);
  }
}

// File Upload on server
document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();

  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length !== 0) {
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("upload.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.text();
      })
      .then((fileName) => {
        inputFile = fileName;
        Swal.fire({
          title: "File Uploaded Successfully",
          icon: "success",
          footer: "Please proceed to quiz!",
          showConfirmButton: false,
          timer: 1500,
        });
        document.getElementById("error-container").innerHTML = "";
      })
      .catch((error) => {
        console.log(error);
      });
    fileInput.value = "";
    fileInput.setAttribute("disabled", "true");
  } else {
    document.getElementById(
      "error-container"
    ).innerHTML = `<li> <strong>Please choose a file.</strong> </li>`;
  }
});

const quizHTML = `
<div id="quizApp" class="container d-flex justify-content-center py-3">
      <div class="card quiz-card shadow w-100" style="margin: 20px auto">
        <div class="card-body">
          <!-- Theme Toggle Switch -->
          <div class="theme-switch-wrapper">
            <input
              type="checkbox"
              id="themeToggle"
              class="theme-toggle-checkbox"
            />
            <label
              for="themeToggle"
              class="theme-toggle-label"
              title="Toggle Theme"
            ></label>
          </div>
          <h4 class="card-title text-center mb-4">Quiz App</h4>

          <!-- Difficulty Level Selector -->
          <div class="container mt-4">
            <label for="exampleSelect" class="form-label text-center d-block"
              >Choose the Difficulty:</label
            >

            <!-- Centered select box -->
            <div class="d-flex justify-content-center my-4">
              <select class="form-select w-25" id="exampleSelect" required>
                <option selected disabled value="">Select</option>
                <option value="0">Test</option>
                <option value="1">Easy</option>
                <option value="2">Average</option>
                <option value="3">Medium</option>
                <option value="4">Hard</option>
                <option value="5">Harder</option>
              </select>
            </div>
          </div>

          <!-- Progress -->
          <div class="progress mb-4">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: 0%"
              id="progressBar"
            ></div>
          </div>

          <!-- Question -->
          <h5 id="questionText">Question will go here...</h5>

          <!-- Options -->
          <div id="optionsContainer" class="mt-3">
            <button class="btn btn-outline-primary option-btn my-2">
              Option A
            </button>
            <button class="btn btn-outline-primary option-btn my-2">
              Option B
            </button>
            <button class="btn btn-outline-primary option-btn my-2">
              Option C
            </button>
            <button class="btn btn-outline-primary option-btn my-2">
              Option D
            </button>
          </div>

          <!-- Navigation Buttons -->
          <div class="d-flex justify-content-between mt-4">
            <button class="btn btn-secondary" id="prevBtn">Previous</button>
            <button class="btn btn-primary" id="nextBtn">Next</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <footer class="text-center text-muted py-3 mt-5 border-top">
      &copy;2025 CodeCraft. All rights reserved.
    </footer>
`;

document.getElementById("quizLoad").addEventListener("click", function () {
  document.querySelector("body").innerHTML = quizHTML;

  // Theme selection

  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-light");
  });

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

  // Main working

  window.onload = function () {
    const difficultyLevel = document.getElementById("exampleSelect");
    difficultyLevel.value = "";
  };
  // ====================//
  // Globle Variables Declaration//

  let arr = [];

  // ====================//

  // Load file option into select box
  if (inputFile) {
    let newSelectBox = document.createElement("option");
    newSelectBox.setAttribute("value", "6");
    newSelectBox.innerHTML = "Custom Quiz";
    document.getElementById("exampleSelect").appendChild(newSelectBox);
  }

  function selectDifficulty(difficulty) {
    let level;
    switch (difficulty) {
      case "0":
        level = "test.json";
        break;
      case "1":
        level = "easy.json";
        break;
      case "2":
        level = "average.json";
        break;
      case "3":
        level = "medium.json";
        break;
      case "4":
        level = "hard.json";
        break;
      case "5":
        level = "harder.json";
        break;
      case "6":
        level = inputFile;
        break;
      default:
        level = "";
        break;
    }
    return level;
  }

  document
    .getElementById("exampleSelect")
    .addEventListener("change", function (event) {
      StartQuiz(event.target);
    });
  function StartQuiz(target) {
    document.getElementById("exampleSelect").setAttribute("disabled", "true");
    let level = selectDifficulty(target.value);

    fetch(`./quiz-files/${level}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        GetData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const next = document.getElementById("nextBtn");
  const prev = document.getElementById("prevBtn");
  function GetData(data) {
    let index = 0;
    arr.length = data.length;

    next.addEventListener("click", () => {
      document.getElementById("nextBtn").innerHTML = "Skip";
      if (index < data.length) {
        index++;
        prev.removeAttribute("disabled");
        reset();
        loadQuestion(index);
      }
    });
    prev.addEventListener("click", () => {
      document.getElementById("nextBtn").innerHTML = "Skip";
      if (index > 0) {
        index--;
        next.removeAttribute("disabled");
        reset();
        loadQuestion(index);
      }
    });
    loadQuestion(index);

    function loadQuestion(index) {
      if (index === 0) {
        prev.setAttribute("disabled", "true");
      } else if (index === data.length) {
        endQuiz();
        setTimeout(function () {
          showResult(arr);
        }, 1500);

        next.setAttribute("disabled", "true");
      }
      let question = data[index].question;
      let option = data[index].options;
      let answer = data[index].answer;
      displayData(question, option, answer, index);
      Progress(index, data.length);
    }
    function displayData(question, option, correct, index) {
      let optionBtn = document.getElementById("optionsContainer").children;
      document.getElementById("questionText").textContent = question;
      optionBtn[0].textContent = option[0];
      optionBtn[1].textContent = option[1];
      optionBtn[2].textContent = option[2];
      optionBtn[3].textContent = option[3];

      // console.log(arr[index]);

      if (arr[index] !== undefined) {
        if (arr[index].result === true) {
          for (let element of optionBtn) {
            if (element.innerHTML === arr[index].selection) {
              element.classList.remove("btn-outline-primary");
              element.classList.add("btn-success");
            }
          }
        } else if (arr[index].result === false) {
          for (let element of optionBtn) {
            if (element.innerHTML === arr[index].selection) {
              element.classList.remove("btn-outline-primary");
              element.classList.add("btn-danger");
            }
          }
        }
        optionBtn[0].setAttribute("disabled", "true");
        optionBtn[1].setAttribute("disabled", "true");
        optionBtn[2].setAttribute("disabled", "true");
        optionBtn[3].setAttribute("disabled", "true");
      }

      for (let element of optionBtn) {
        let cleanBtn = element.cloneNode(true);
        element.replaceWith(cleanBtn);
        cleanBtn.addEventListener("click", selectOpt);
        function selectOpt(event) {
          document.getElementById("nextBtn").innerHTML = "Next";
          const selectedText = event.target.textContent.trim();
          const correctText = correct.trim();
          event.target.classList.remove("btn-outline-primary");
          if (selectedText === correctText) {
            event.target.classList.add("btn-success");
            trueArrayResult(index, selectedText);
          } else if (selectedText !== correctText) {
            event.target.classList.add("btn-danger");
            falseArrayResult(index, selectedText);
          }
          optionBtn[0].setAttribute("disabled", "true");
          optionBtn[1].setAttribute("disabled", "true");
          optionBtn[2].setAttribute("disabled", "true");
          optionBtn[3].setAttribute("disabled", "true");
        }
      }
    }
  }
  function reset() {
    let options = document.getElementById("optionsContainer").children;
    for (let element of options) {
      element.classList.add("btn-outline-primary");
      element.classList.remove("btn-success");
      element.classList.remove("btn-danger");
      element.removeAttribute("disabled");
    }
  }
  function Progress(index, quizSize) {
    const progressBar = document.getElementById("progressBar");
    let questionNumer = index + 1;
    let percentage = (questionNumer / quizSize) * 100;
    progressBar.style.width = `${percentage}%`;
  }
  function endQuiz() {
    Swal.fire({
      title: "All Done",
      text: "You have reached the end of Quiz!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  // ++++++++++++++++++++//
  // Result Updation //

  function trueArrayResult(index, selectedText) {
    let resultInfo = {};
    if (arr[index] === undefined) {
      resultInfo = {
        result: true,
        selection: selectedText,
      };
      arr[index] = resultInfo;
    }
    console.log(arr);
  }
  function falseArrayResult(index, selectedText) {
    let resultInfo = {};
    if (arr[index] === undefined) {
      resultInfo = {
        result: false,
        selection: selectedText,
      };
      arr[index] = resultInfo;
    }
    console.log(arr);
  }

  // +++++++++++++++++++++++++//
  // Injecting Result //

  function showResult(arr) {
    let rightAttampt = 0;
    let wrongAttampt = 0;
    const quizSize = arr.length;
    arr.forEach((item) => {
      if (item.result === true) {
        rightAttampt++;
      } else if (item.result === false) {
        wrongAttampt++;
      }
    });
    const resultPercent = Math.round((rightAttampt / quizSize) * 100);
    // console.log(resultPercent);
    const unattempted = quizSize - (rightAttampt + wrongAttampt);
    let badge;
    let message;
    const quotes = [
      "You've demonstrated strong understanding. Keep up the great work and try more quizzes to sharpen your skills even further!",
      "You're doing well! With a little more practice, you'll master it completely. Keep going!",
      "You're on the right path. Review a few concepts and give it another shot — improvement is just around the corner.",
      "You've made some progress, but there's room for growth. Take your time to review the material and try again.",
      "Every expert was once a beginner. Keep learning, keep practicing — you’ll get better with every attempt.",
    ];
    let quote;
    if (resultPercent >= 90 && resultPercent <= 100) {
      message = "🌟 Excellent!";
      badge = "bg-success";
      quote = quotes[0];
    } else if (resultPercent >= 70 && resultPercent < 90) {
      message = "👍 Great Job!";
      badge = "bg-primary";
      quote = quotes[1];
    } else if (resultPercent >= 50 && resultPercent < 70) {
      message = "⚠️ Good Try!";
      badge = "bg-warning";
      quote = quotes[2];
    } else if (resultPercent >= 30 && resultPercent < 50) {
      message = "💡 Needs Improvement";
      badge = "bg-secondary";
      quote = quotes[3];
    } else {
      message = "❌ Don't Give Up!";
      badge = "bg-danger";
      quote = quotes[4];
    }

    // Result Card Style //

    let htmlInj = `
    <div class="container-fluid my-5 d-flex justify-content-center px-3">
  <div
    class="card shadow border-0 p-4 w-100 w-md-75"
    style="
      max-width: 500px;
      max-hight: auto;
      border-radius: 20px;
      background: linear-gradient(to bottom right, #ffffff, #f9f9f9);
    "
  >
    <!-- Header -->
    <div class="text-center mb-4">
      <h1 class="fw-bold text-dark">Your Quiz Result</h1>
      <p class="text-muted fs-5 text-wrap">Review your performance and next steps</p>
    </div>

    <!-- Result Pie Chart -->
<div class="d-flex justify-content-center mb-2">
  <canvas id="resultChart" class="w-100" style="max-width: 300px;"></canvas>
</div>


    <!-- Attempt Summary -->
    <div class="text-center mb-4">
      <div class="d-flex justify-content-center gap-4 flex-wrap">
        <div class="text-success fw-semibold">
          ✅ Right: <span id="rightCount">${rightAttampt}</span>
        </div>
        <div class="text-danger fw-semibold">
          ❌ Wrong: <span id="wrongCount">${wrongAttampt}</span>
        </div>
        <div class="text-warning fw-semibold">
          ⚠️ Unattempted: <span id="unattemptedCount">${unattempted}</span>
        </div>
      </div>
    </div>

    <!-- Feedback -->
    <div class="text-center px-2">
      <span class="badge ${badge} fs-6 px-4 py-2 rounded-pill mb-3 text-wrap"
        >${message}</span
      >
      <p class="fs-5 text-secondary text-break px-2">${quote}</p>
    </div>

    <!-- Buttons -->
    <div class="d-flex justify-content-center mt-4 gap-3 flex-wrap">
      <a href="#" id="tryAgain" class="btn btn-primary px-4 py-2">Try Again</a>
    </div>
  </div>
</div>
    `;
    // Injeecting Result in Chart //
    document.querySelector("#quizApp").innerHTML = htmlInj;
    const ctx = document.getElementById("resultChart").getContext("2d");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Correct", "Wrong", "Unattempted"],
        datasets: [
          {
            label: "Total",
            data: [rightAttampt, wrongAttampt, unattempted],
            backgroundColor: ["#198754", "#dc3545", "#ffc107"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: getComputedStyle(document.body).color,
            },
          },
        },
      },
    });
    document.getElementById("tryAgain").addEventListener("click", function () {
      window.location.reload();
    });
  }
});
