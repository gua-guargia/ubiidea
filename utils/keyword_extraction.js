const { Configuration, OpenAIApi } = require("openai");

async function keyword_extraction(data){
    var a = "sk-WgwjBWBRVNtB0pDy"
    var b = "J8NqT3BlbkFJ1FVvBIL51g5KA1TVVwNk"
    const configuration = new Configuration({
        apiKey: a+b,
      });
    const openai = new OpenAIApi(configuration);
    
    const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: "Extract keywords from this text:\n\n" + data,
        temperature: 0.3,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.8,
        presence_penalty: 0.0,
    });
    result = response.data.choices[0].text.slice(2)
    return new Promise((res, rej) => {res(result)})
}

module.exports = keyword_extraction;