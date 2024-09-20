import {
  HarmBlockThreshold,
  HarmCategory,
  SchemaType,
  VertexAI,
} from '@google-cloud/vertexai'

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: process.env.PROJECT_NAME,
  location: 'asia-northeast1',
})
const model = 'gemini-1.5-flash-001'

export async function getSearchIzakayaQuery(partyInfo: string) {
  // Instantiate the models
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: { response: { type: SchemaType.STRING } },
      },
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  })

  const text1 = {
    text: `以下情報からGoogle Maps Place APIのテキスト検索クエリとして利用可能な単語の羅列を出力してください。
目的に名前がある参加者がいる場合、その参加者の要望を優先してください。
単語は一般名詞としてください。参加者名といった固有名詞は入れないでください。
場所として指定された地名は必ず入れてください。

${partyInfo}`,
  }
  const req = {
    contents: [{ role: 'user', parts: [text1] }],
  }

  const res = await generativeModel.generateContent(req)

  const json = res.response.candidates?.[0].content.parts[0].text
  return JSON.parse(json ?? '{"response": ""}').response
}

export async function getSearchIzakaya(
  partyInfo: string,
  izakayaJson: string
): Promise<[]> {
  // console.log(`${izakayaJson}`)
  // Instantiate the models
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          izakayas: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                order: { type: SchemaType.INTEGER },
                id: { type: SchemaType.STRING },
                feature: { type: SchemaType.STRING },
                note: { type: SchemaType.STRING },
                name: { type: SchemaType.STRING },
                reason: { type: SchemaType.STRING },
              },
              required: [
                'order',
                'id',
                'reason',
                'feature',
                'note',
                'name',
                'reason',
              ],
            },
          },
        },
      },
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  })

  const text1 = {
    text: `以下条件の飲み会を実施するのに適切なお店の候補を5件出力してください。

条件：
${partyInfo}

以下のお店候補のjsonから5つ選択してください。
選択したお店のid(jsonのid)、名前(name)、選択理由(reason)、お店の特徴(feature)、注意点(note)、候補順(order)をjsonで返してください。
- 選択理由は前述の条件をどのように考慮して、お店を選んだか記載してください。
- お店の特徴については、お店候補の情報から生成してください。
- 注意点についても、お店候補の情報から生成してください。

お店候補：
${izakayaJson}
`,
  }
  const req = {
    contents: [{ role: 'user', parts: [text1] }],
  }

  const res = await generativeModel.generateContent(req)

  const json = res.response.candidates?.[0].content.parts[0].text
  return JSON.parse(json ?? '{"izakayas": []}').izakayas
}
