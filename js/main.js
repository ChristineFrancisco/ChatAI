let storageArray = []

//searches local storage for data 
if(localStorage.getItem('storage')) {
    //might change later to make it more efficient? same variable as below
    storageArray = JSON.parse(localStorage.getItem('storage'))
    document.getElementById('clear-chat').classList.remove("hidden");
    loadStorage()
} 

//recreates divs on page load if there is existing data in local storage
function loadStorage(){
    if(storageArray.length > 0) {
        storageArray.forEach(x => makeResponse(x))
    }
}

//button functionality
document.querySelector("#button").addEventListener('click', getFetchAi)
document.querySelector("#clear-chat").addEventListener('click', clearLocalStorage)

//creates divs with prompts and responses
function makeResponse(text){
    const chatButton = document.getElementById("clear-chat")
    if (chatButton.classList.contains("hidden")) {
        chatButton.classList.remove("hidden")
    }
    let newDiv = document.createElement("div")
    newDiv.classList.add('appended-div');
    newDiv.appendChild(document.createTextNode(text)),
        addingTo = document.getElementById("container")
    addingTo.appendChild(newDiv)

    let isPrompt = text.substring(0,6) == "Prompt"
    if(isPrompt){
        newDiv.style.background= "rgb(220, 248, 198)"
        newDiv.style.textAlign = "right";

    }else {
        newDiv.style.background= "rgb(236, 229, 221)"
        newDiv.style.textAlign = "left";
    }

    //clears the value of the prompt text box
    document.getElementById("prompt").value = ""
}

function getFetchAi(){
    let engine = document.getElementById("engine").value
    let engineName
    if (engine == "text-ada-001"){
        engineName = "Ada"
    } else if (engine == "text-babbage-001") {
        engineName = "Babbage"
    } else if (engine == "text-curie-001") {
        engineName = "Curie"
    } else if (engine == "text-davinci-002") {
        engineName = "DaVinci"
    } else {
        engineName = "The Engine"
    }
    let promptFromUser = document.getElementById("prompt").value
    let newResponse

    //checks if there is both a prompt or engine chosen first:
    if (!engine && !promptFromUser){
        alert("Please select an engine and write your prompt!")
    } else if (!promptFromUser){
        alert("Please write your prompt!")
    } else if (!engine){
        alert("Please select an engine!")
    }
    
    const data = {
        prompt: promptFromUser,
        temperature: 0.5,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
       };
    //first fetches the API key from firebase
    fetch("https://chatapi-7fb64-default-rtdb.firebaseio.com/key.json")
       .then(response => response.json())
       .then(data => {
           apikey = data
       })
       //then calls the openAI API using that key
       .then (x => {
            fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apikey}`,
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(newData => {
                    newPrompt = `Prompt: ${promptFromUser}`
                    makeResponse(newPrompt)
                    storageArray.push(newPrompt)
                    
                    newResponse = `${engineName} says: ${newData.choices[0].text}`
                    makeResponse(newResponse)
                    storageArray.push(newResponse)
                    localStorage.setItem('storage', JSON.stringify(storageArray))
                })
       })
}

//removes the divs on the DOM and then removes local storage
function clearLocalStorage() {
    let appendedDivs = document.getElementsByClassName('appended-div');

    while(appendedDivs[0]) {
        appendedDivs[0].parentNode.removeChild(appendedDivs[0]);
    }
    window.localStorage.clear();
    document.getElementById('clear-chat').classList.add("hidden")
}