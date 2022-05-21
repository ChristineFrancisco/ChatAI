document.querySelector("#button").addEventListener('click', getFetch)
    
function makeResponse(text){
    let newDiv = document.createElement("div")
    newDiv.appendChild(document.createTextNode(text)),
        addingTo = document.getElementById("container")
    addingTo.appendChild(newDiv)
}

function getFetch(){
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


    fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"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"}`,
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(newData => {
            newResponse = `Prompt: ${promptFromUser} 
            
            Response: ${newData.choices[0].text}`
            makeResponse(newResponse)
        })
}