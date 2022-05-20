document.querySelector("#button").addEventListener('click', getFetch)


const data = {
    prompt: document.getElementById("prompt").value,
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
   };
    
function getFetch(){
    console.log("oh hi there")
    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"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"}`,
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(newData => {
            console.log(newData.choices[0].text)
        })
}
