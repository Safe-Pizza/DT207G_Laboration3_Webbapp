"use strict";

fetchData();

//fetch funktion jobb-API
async function fetchData() {
    try {
        const response = await fetch("http://localhost:5000/jobs");
        const data = await response.json();

        if (response.ok) {
            writeJobs(data);
        } else return document.getElementById("api-result").innerHTML = "";
    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

//funktion för DELETE i API
async function deleteJob(id) {
    try {
        const res = await fetch(`http://localhost:5000/jobs/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();
        fetchData();
    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

//funktion för PUT (ändring av befintligt jobb) i API
async function changeJob(id, job) {
    try {
        const res = await fetch(`http://localhost:5000/jobs/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(job)
        });

        const data = await res.json();
        fetchData();
    } catch (error) {
        console.error(`Felmeddelande ${error}`);
    }
}

//funktion för att skriva ut jobb till DOM
function writeJobs(jobs) {
    let resultEl = document.getElementById("api-result");

    resultEl.innerHTML = "";

    //loop för utskrift
    jobs.forEach(job => {
        //skapa element
        let articleEl = document.createElement("article");
        let deleteButtonEl = document.createElement("button");
        let aEl = document.createElement("a");
        let content = `
       <h3>${job.jobtitle}</h3>
       <p><strong>Företag: </strong>${job.companyname}</p>
       <p><strong>Stad: </strong>${job.location}</p>
       <p><strong>Beskrivning: </strong>${job.description}</p>
       <p><strong>Anställningsdatum: </strong>${job.startdate}</p>
       <p><strong>Anställning avslutad: </strong>${job.enddate}</p>`;

        //lägg till attribut och text
        aEl.href = `#form-change`;
        aEl.classList.add("link-change");
        aEl.innerHTML = "Ändra";
        deleteButtonEl.classList.add("delete-button");
        deleteButtonEl.innerHTML = "Ta bort";
        articleEl.innerHTML = content;
        articleEl.appendChild(deleteButtonEl);
        articleEl.appendChild(aEl);

        //skriv ut till DOM
        resultEl.appendChild(articleEl);

        //eventlyssnare för delete-knapp
        deleteButtonEl.addEventListener("click", () => {
            deleteJob(job._id);
        });

        //eventlyssnare för ändra
        aEl.addEventListener("click", () => {
            changeJobData(job);
        })
    })
}

//funktion för hämta data till ändring av befintligt jobb
function changeJobData(job) {
    let changeFormEl = document.getElementById("form-change");
    changeFormEl.classList.remove("hidden");

    //skapa knapp för ändring
    let changeButtonEl = document.createElement("button");
    changeButtonEl.innerHTML = "Ändra";

    //lägg till knapp i DOM
    changeFormEl.appendChild(changeButtonEl);

    //Formulärdata
    let companyname = document.getElementById("change-companyname");
    let jobtitle = document.getElementById("change-jobtitle");
    let location = document.getElementById("change-location");
    let description = document.getElementById("change-description");
    let startdate = document.getElementById("change-startdate");
    let enddate = document.getElementById("change-enddate");

    //fyll i data från API
    companyname.value = job.companyname;
    jobtitle.value = job.jobtitle;
    location.value = job.location;
    description.value = job.description;
    startdate.value = job.startdate;
    enddate.value = job.enddate;

    changeButtonEl.addEventListener("click", () => {
        //Varibel för errors-element DOM
        let errorsEl = document.getElementById("errors-change");
        errorsEl.innerHTML = "";

        //Array för felhantering
        let errors = [];

        //Funktion för korrekt datumformat
        function isValidDate(stringDate) {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(stringDate);
        }

        //Validering av formulärdata, kontroll ej tom + datum validering
        if (companyname.value === "") {
            errors.push("<li>Du måste fylla i företagsnamn</li>");
        }

        if (jobtitle.value === "") {
            errors.push("<li>Du måste fylla i jobbtitel</li>");
        }
        if (location.value === "") {
            errors.push("<li>Du måste fylla i stad</li>");
        }
        if (description.value === "") {
            errors.push("<li>Du måste fylla i beskrivning</li>");
        }
        if (startdate.value === "") {
            errors.push("<li>Du måste fylla i startdatum</li>");
        }
        if (isValidDate(startdate.value) === false) {
            errors.push("<li>Datumformatet måste vara: XXXX-XX-XX</li>")
        }
        if (enddate.value === "") {
            errors.push("<li>Du måste fylla i slutdatum</li>");
        }
        if (isValidDate(enddate.value) === false) {
            errors.push("<li>Datumformatet måste vara: XXXX-XX-XX</li>")
        }

        //Skriv ut eventuella felmeddelanden
        if (errors.length !== 0) {
            errors.forEach(error => {
                errorsEl.innerHTML += error;
            })
        } else { //Vid inga felmeddelanden ändra i API

            //göm formulär
            changeFormEl.classList.add("hidden");
            //ta bort knapp
            changeButtonEl.remove();

            //skapa job-objekt
            let changedJob = {
                companyname: companyname.value,
                jobtitle: jobtitle.value,
                location: location.value,
                description: description.value,
                startdate: startdate.value,
                enddate: enddate.value
            }

            //kör funktion för ändring, skicka med id och jobb-objekt
            changeJob(job._id, changedJob);
        }
    })
}