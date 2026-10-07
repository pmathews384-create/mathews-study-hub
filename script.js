/* =========================================
   DEFAULT SUBJECTS
========================================= */

const defaultSubjects = [
    {
        id: crypto.randomUUID(),
        name: "M111",
        time: 0
    },

    {
        id: crypto.randomUUID(),
        name: "Operating Systems",
        time: 0
    },

    {
        id: crypto.randomUUID(),
        name: "COM111",
        time: 0
    },

    {
        id: crypto.randomUUID(),
        name: "ICT111",
        time: 0
    },

    {
        id: crypto.randomUUID(),
        name: "C Programming",
        time: 0
    }
];


/* =========================================
   LOAD DATA
========================================= */

let subjects =
    JSON.parse(
        localStorage.getItem("mathewsSubjects")
    ) || defaultSubjects;

let goal =
    Number(
        localStorage.getItem("studyGoal")
    ) || 2;

let selectedSubjectId = null;

let timerRunning = false;

let timerInterval = null;


/* =========================================
   ELEMENTS
========================================= */

const subjectsList =
    document.getElementById("subjectsList");

const progressList =
    document.getElementById("progressList");

const timer =
    document.getElementById("timer");

const timerSubject =
    document.getElementById("timerSubject");

const currentSubject =
    document.getElementById("currentSubject");

const totalTime =
    document.getElementById("totalTime");

const subjectCount =
    document.getElementById("subjectCount");

const timerStatus =
    document.getElementById("timerStatus");

const statusDot =
    document.getElementById("statusDot");

const modal =
    document.getElementById("modal");

const subjectInput =
    document.getElementById("subjectInput");

const goalInput =
    document.getElementById("goalInput");

const goalDisplay =
    document.getElementById("goalDisplay");


/* =========================================
   SAVE DATA
========================================= */

function saveData() {

    localStorage.setItem(
        "mathewsSubjects",
        JSON.stringify(subjects)
    );

    localStorage.setItem(
        "studyGoal",
        goal
    );
}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(seconds) {

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor((seconds % 3600) / 60);

    const secs =
        seconds % 60;

    return (
        String(hours).padStart(2, "0")
        + ":" +
        String(minutes).padStart(2, "0")
        + ":" +
        String(secs).padStart(2, "0")
    );
}


/* =========================================
   FORMAT SHORT TIME
========================================= */

function formatShortTime(seconds) {

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor((seconds % 3600) / 60);

    if (hours > 0) {

        return `${hours}h ${minutes}m`;

    }

    return `${minutes}m`;
}


/* =========================================
   DISPLAY SUBJECTS
========================================= */

function renderSubjects() {

    subjectsList.innerHTML = "";

    subjects.forEach(subject => {

        const item =
            document.createElement("div");

        item.className =
            "subject-item";

        if (
            subject.id === selectedSubjectId
        ) {

            item.classList.add("active");

        }

        item.innerHTML = `

            <div class="subject-info">

                <div class="subject-icon">
                    📚
                </div>

                <div>

                    <div class="subject-name">
                        ${subject.name}
                    </div>

                    <div class="subject-time">
                        ${formatTime(subject.time)}
                    </div>

                </div>

            </div>

            <button
                class="delete-subject"
                title="Delete subject"
            >
                🗑️
            </button>
        `;


        /* SELECT SUBJECT */

        item.addEventListener(
            "click",
            () => {

                selectSubject(subject.id);

            }
        );


        /* DELETE SUBJECT */

        const deleteButton =
            item.querySelector(
                ".delete-subject"
            );

        deleteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                deleteSubject(subject.id);

            }
        );


        subjectsList.appendChild(item);

    });
}


/* =========================================
   SELECT SUBJECT
========================================= */

function selectSubject(id) {

    if (timerRunning) {

        pauseTimer();

    }

    selectedSubjectId = id;

    const subject =
        subjects.find(
            subject =>
                subject.id === id
        );

    if (!subject) return;

    timerSubject.textContent =
        subject.name;

    timer.textContent =
        formatTime(subject.time);

    currentSubject.textContent =
        subject.name;

    timerStatus.textContent =
        "Ready to study";

    statusDot.classList.remove(
        "running"
    );

    renderSubjects();

    renderProgress();
}


/* =========================================
   START TIMER
========================================= */

function startTimer() {

    if (!selectedSubjectId) {

        alert(
            "Please select a subject first."
        );

        return;
    }

    if (timerRunning) return;

    timerRunning = true;

    timerStatus.textContent =
        "Studying now...";

    statusDot.classList.add(
        "running"
    );

    timerInterval =
        setInterval(() => {

            const subject =
                subjects.find(
                    subject =>
                        subject.id ===
                        selectedSubjectId
                );

            if (!subject) return;

            subject.time++;

            timer.textContent =
                formatTime(subject.time);

            renderSubjects();

            renderProgress();

            updateStatistics();

            saveData();

        }, 1000);
}


/* =========================================
   PAUSE TIMER
========================================= */

function pauseTimer() {

    timerRunning = false;

    clearInterval(timerInterval);

    timerStatus.textContent =
        "Paused";

    statusDot.classList.remove(
        "running"
    );

    saveData();
}


/* =========================================
   RESET SUBJECT TIME
========================================= */

function resetTimer() {

    if (!selectedSubjectId) {

        alert(
            "Please select a subject first."
        );

        return;
    }

    const subject =
        subjects.find(
            subject =>
                subject.id ===
                selectedSubjectId
        );

    if (!subject) return;

    const confirmReset =
        confirm(
            `Reset all study time for ${subject.name}?`
        );

    if (!confirmReset) return;

    pauseTimer();

    subject.time = 0;

    timer.textContent =
        "00:00:00";

    saveData();

    renderSubjects();

    renderProgress();

    updateStatistics();
}


/* =========================================
   DELETE SUBJECT
========================================= */

function deleteSubject(id) {

    const subject =
        subjects.find(
            subject =>
                subject.id === id
        );

    if (!subject) return;

    const confirmed =
        confirm(
            `Delete ${subject.name}?`
        );

    if (!confirmed) return;

    if (
        selectedSubjectId === id
    ) {

        pauseTimer();

        selectedSubjectId = null;

        timerSubject.textContent =
            "Select a subject";

        timer.textContent =
            "00:00:00";

        currentSubject.textContent =
            "None";
    }

    subjects =
        subjects.filter(
            subject =>
                subject.id !== id
        );

    saveData();

    renderSubjects();

    renderProgress();

    updateStatistics();
}


/* =========================================
   ADD SUBJECT
========================================= */

function addSubject() {

    const name =
        subjectInput.value.trim();

    if (!name) {

        alert(
            "Please enter a subject name."
        );

        return;
    }

    const exists =
        subjects.some(
            subject =>
                subject.name.toLowerCase()
                === name.toLowerCase()
        );

    if (exists) {

        alert(
            "This subject already exists."
        );

        return;
    }

    subjects.push({

        id: crypto.randomUUID(),

        name: name,

        time: 0

    });

    subjectInput.value = "";

    closeModal();

    saveData();

    renderSubjects();

    renderProgress();

    updateStatistics();
}


/* =========================================
   PROGRESS
========================================= */

function renderProgress() {

    progressList.innerHTML = "";

    if (subjects.length === 0) {

        progressList.innerHTML = `
            <p style="color:var(--muted)">
                No subjects added yet.
            </p>
        `;

        return;
    }


    const maxTime =
        Math.max(
            ...subjects.map(
                subject =>
                    subject.time
            ),
            1
        );


    subjects.forEach(subject => {

        const percentage =
            (subject.time / maxTime) *
            100;

        const row =
            document.createElement("div");

        row.className =
            "progress-row";

        row.innerHTML = `

            <div class="progress-info">

                <span>
                    ${subject.name}
                </span>

                <span>
                    ${formatShortTime(subject.time)}
                </span>

            </div>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${percentage}%"
                ></div>

            </div>
        `;

        progressList.appendChild(row);

    });
}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const total =
        subjects.reduce(
            (sum, subject) =>
                sum + subject.time,
            0
        );

    totalTime.textContent =
        formatTime(total);

    subjectCount.textContent =
        subjects.length;

    goalDisplay.textContent =
        `${goal} Hours`;
}


/* =========================================
   MODAL
========================================= */

function openModal() {

    modal.classList.add("show");

    subjectInput.focus();
}


function closeModal() {

    modal.classList.remove("show");
}


/* =========================================
   DAILY GOAL
========================================= */

function saveGoal() {

    const value =
        Number(goalInput.value);

    if (
        !value ||
        value < 1 ||
        value > 24
    ) {

        alert(
            "Please enter a goal between 1 and 24 hours."
        );

        return;
    }

    goal = value;

    saveData();

    updateStatistics();

    alert(
        `Daily goal set to ${goal} hours.`
    );
}


/* =========================================
   DATE
========================================= */

function displayDate() {

    const date =
        new Date();

    const options = {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    };

    document.getElementById(
        "currentDate"
    ).textContent =
        date.toLocaleDateString(
            "en-US",
            options
        );
}


/* =========================================
   DARK MODE
========================================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );

    const dark =
        document.body.classList.contains(
            "dark"
        );

    localStorage.setItem(
        "darkMode",
        dark
    );

    document.getElementById(
        "themeBtn"
    ).textContent =
        dark ? "☀️" : "🌙";
}


function loadTheme() {

    const dark =
        localStorage.getItem(
            "darkMode"
        ) === "true";

    if (dark) {

        document.body.classList.add(
            "dark"
        );

        document.getElementById(
            "themeBtn"
        ).textContent =
            "☀️";
    }
}


/* =========================================
   BUTTON EVENTS
========================================= */

document
    .getElementById("startBtn")
    .addEventListener(
        "click",
        startTimer
    );


document
    .getElementById("pauseBtn")
    .addEventListener(
        "click",
        pauseTimer
    );


document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        resetTimer
    );


document
    .getElementById("addSubjectBtn")
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("saveSubjectBtn")
    .addEventListener(
        "click",
        addSubject
    );


document
    .getElementById("saveGoalBtn")
    .addEventListener(
        "click",
        saveGoal
    );


document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        toggleTheme
    );


/* Close modal when clicking outside */

modal.addEventListener(
    "click",
    event => {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


/* Enter key adds subject */

subjectInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addSubject();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

goalInput.value = goal;

displayDate();

loadTheme();

renderSubjects();

renderProgress();

updateStatistics();