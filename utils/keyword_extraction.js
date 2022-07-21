const { Configuration, OpenAIApi } = require("openai");

async function keyword_extraction(data){
    const configuration = new Configuration({
        apiKey: "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",
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