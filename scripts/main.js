function toggleAreaSelection(self) {
    let element;
    switch(self) {
        case document.querySelector("#region"):
            element = document.querySelector("#state");
            break;
        case document.querySelector("#state"):
            element = document.querySelector("#region");
            break;
    }
    element.selectedIndex = 0;
}

function toggleAgeEntry(self) {
    switch(self) {
        case document.querySelector("#minAge"):
        case document.querySelector("#maxAge"):
            document.querySelector("#age").value = "";
            break;
        case document.querySelector("#age"):
            document.querySelector("#minAge").value = "";
            document.querySelector("#maxAge").value = "";
            break;
    }
}

const form = document.querySelector("#queryForm");
form.onsubmit = async function (submitEvent) {
    submitEvent.preventDefault();

    showProgress();
    clearData();

    const data = await fetchData(submitEvent.target);

    loadData(data);
    clearProgress();
    showData();
}

const inputs = document.querySelector("#queryInputs");
const progress = document.querySelector("#progress");
const fade = document.querySelector("#fade");

function showProgress() {
    inputs.disabled = true;
    progress.style.display = "block";
}

function clearProgress() {
    inputs.disabled = false;
    progress.style.display = "none";
}

async function fetchData(form) {
    try {
        // For some reason, the FormData constructor with the Form element as a parameter
        // was not initializing the FormData object with the Form element values. Appending
        // the values to an already constructed FormData object is a workaround
        const formData = appendDataFromForm(new FormData(), form);

        const url = "https://story-character-names-api.empty-warthog-85.telebit.io/names";
        const options = {method: "POST", body: formData};
        const response = await fetch(url, options);
        const data = await response.json();

        return data;
    } catch (error) {
        alert(error.name + ": " + error.message);
        clearProgress();
        throw error;
    }
}

function appendDataFromForm(formData, form) {
    const inputs = Array.from(form.querySelectorAll("input")).filter(item => item.type != "submit")
        .filter(item => item.type == "number" || item.type == "text" || (item.type == "radio" && item.checked));
    const selects = Array.from(form.querySelectorAll("select"));
    const data = [...inputs, ...selects];

    data.forEach(item => {
        formData.append(item.name, item.value);
    });

    return formData;
}

const table = document.querySelector("#resultsTable");

function loadData(names) {
    const results = document.querySelector("#results");
    const resultsTableBody = document.querySelector("#resultsTable > tbody");

    names.forEach(name => {
        let tr = document.createElement("tr");
        let keys = ["name","gender","occurrences","year","characteristics"];
        keys.forEach(key => {
            let td = document.createElement("td");
            td.textContent = name[key];
            tr.appendChild(td);
        });
        resultsTableBody.appendChild(tr);
    });

    const simpleTable = new DataTable(table);

    results.style.display = "block";
}

function clearData() {
    table.style.display = "none";
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
};

function showData() {
    table.style.display = "block";
}
