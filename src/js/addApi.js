"use strict";

//eventlyssnare för submit knapp
document.querySelector("#submit-button").addEventListener("click", addJob);

//funktion för att lägga till jobb i API
function addJob() {
    //Formulärdata
    let companyname = document.getElementById("companyname");
    let jobtitle = document.getElementById("jobtitle");
    let location = document.getElementById("location");
    let description = document.getElementById("description");
    let startdate = document.getElementById("startdate");
    let enddate = document.getElementById("enddate");

    //Varibel för errors-element DOM
    let errorsEl = document.getElementById("errors");
    errorsEl.innerHTML = "";

    //Array för felhantering
    let errors = [];

    //Funktion för korrekt datumformat
    function isValidDate(stringDate) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(stringDate);
    }

    //Validering av formulärdata, kontroll ej tom + datumvalidering
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
    } else { //Vid inga felmeddelanden lägg till i API
        //skapa objekt
        let job = {
            companyname: companyname.value,
            jobtitle: jobtitle.value,
            location: location.value,
            description: description.value,
            startdate: startdate.value,
            enddate: enddate.value
        }

        //skicka objekt till funktion för POST
        createJob(job);

        //töm formulärfält
        companyname.value = "";
        jobtitle.value = "";
        location.value = "";
        description.value = "";
        startdate.value = "";
        enddate.value = "";
    }
}

//funktion för POST till API
async function createJob(job) {
    const res = await fetch("https://dt207g-laboration3.onrender.com/jobs", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(job)
    });

    const data = await res.json();
}