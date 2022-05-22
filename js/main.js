let storageArray = []

//searches local storage and pushes out divs if there is existing data
if(localStorage.getItem('storage')) {
    //might change later to make it more efficient? same variable as below
    storageArray = JSON.parse(localStorage.getItem('storage'))
    loadStorage()
} 

function loadStorage(){
    let existingData = JSON.parse(localStorage.getItem('storage'))
    if(existingData.length > 0) {
        existingData.forEach(x => makeResponse(x))
    }
}

//button functionality
document.querySelector("#button").addEventListener('click', getFetchAi)

//creates divs with prompts and responses
function makeResponse(text){
    let newDiv = document.createElement("div")
    newDiv.appendChild(document.createTextNode(text)),
        addingTo = document.getElementById("container")
    addingTo.appendChild(newDiv)
}

function getFetchAi(){
    let engine = document.getElementById("engine").value
    let promptFromUser = document.getElementById("prompt").value
    let newResponse

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
           console.log(apikey)
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
                    newResponse = `Prompt: ${promptFromUser} 
                    \n
                    Response: ${newData.choices[0].text}`
                    makeResponse(newResponse)
                    storageArray.push(newResponse)
                    localStorage.setItem('storage', JSON.stringify(storageArray))
                })
       })
}