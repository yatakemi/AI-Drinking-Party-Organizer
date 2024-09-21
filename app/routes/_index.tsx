import {
  json,
  type ActionFunction,
  type ActionFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'

import { Description } from '~/components/description'
import IzakayaList, { Izakaya } from '~/components/izakaya-list'
import { MultiStepForm } from '~/components/multi-step-form'
import { SkeletonCard } from '~/components/skeleton-card'
import {
  callPlaceSearchText,
  convertReductionForPrompt,
} from '~/services/place-api.server'
import {
  getSearchIzakaya,
  getSearchIzakayaQuery,
} from '~/services/vertex-ai.server'

export const meta: MetaFunction = () => {
  const projectId = process.env.PROJECT_NAME
  return [
    { title: '飲み会幹事AIアシスタント' },
    { name: 'description', content: '飲み会の計画立案をサポートします' },
    {
      property: 'og:image',
      content: `https://${projectId}.an.r.appspot.com/logo.png`,
    },
    {
      property: 'og:url',
      content: `https://${projectId}.an.r.appspot.com/`,
    },
  ]
}

type PartyInfo = {
  purpose: string
  location: string
  date?: string
  user: { name?: string; wish?: string }[]
  budget: number
  otherWishes?: string
}

export const action: ActionFunction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  /**
   * リクエストパラメータ
   */
  const formData = await request.formData()
  console.log(formData)

  const formDataEntries = Object.fromEntries(formData)

  const partyInfo: PartyInfo = {
    purpose: '',
    location: '',
    budget: 0,
    user: [],
  }
  // リクエスト情報をPartyInfoに変換する処理
  for (const [key, value] of Object.entries(formDataEntries)) {
    if (key.startsWith('user')) {
      const [, index, prop] = key.match(
        /\[(\d+)\]\[(\w+)\]/
      ) as RegExpMatchArray
      const userIndex = parseInt(index, 10)
      partyInfo.user[userIndex] ??= {}
      partyInfo.user[userIndex][prop as 'name' | 'wish'] = value as string
    } else {
      if (key === 'budget') {
        partyInfo[key] = parseInt(value as string, 10)
      } else {
        partyInfo[key as keyof PartyInfo] = value as string
      }
    }
  }

  console.log('partyInfo', partyInfo)

  /**
   * 飲み会情報をプロンプト用文字列に変換
   */
  const partyInfoString = `目的：${partyInfo.purpose}
場所：${partyInfo.location}
開始時間：${partyInfo.date}
参加者：
${partyInfo.user
  ?.map((user) => '  - 名前:' + user.name + '、 希望:' + user.wish)
  .join('\n')}
予算：一人${partyInfo.budget}円程度
その他要望：${partyInfo.otherWishes}
`
  console.log(partyInfoString)
  /**
   * データ取得
   */
  const textQuery = await getSearchIzakayaQuery(partyInfoString)
  console.log('textQuery', textQuery)

  const placeData = await callPlaceSearchText(textQuery)
  const convertedPlaceData = convertReductionForPrompt(placeData)

  const izakayaCandidateList = await getSearchIzakaya(
    partyInfoString,
    JSON.stringify(convertedPlaceData)
  )
  console.dir(izakayaCandidateList, { depth: null })

  const izakayaRawList = izakayaCandidateList.map((izakaya) => {
    const detail = placeData[0].places?.find(
      (place) => place.id === izakaya['id']
    )
    return { izakaya, detail: detail }
  })
  console.dir(
    placeData[0].places?.map((v) => v.id + ', ' + v.displayName?.text),
    { depth: 1 }
  )

  // console.dir(izakayaRawList, { depth: 1 })
  /**
   * レスポンス
   */
  const izakayaExistList = izakayaRawList.filter((izakaya) => izakaya.detail)

  const response = {
    ok: izakayaExistList.length > 0,
    json: izakayaExistList,
  }
  if (!response.ok) {
    console.error(`izakayaExistList=${izakayaExistList.length}`)
    // throw new Error('Failed to fetch izakaya recommendations')
  }

  const izakayaList: Izakaya[] = response.json.map((izakaya) => {
    return {
      name: izakaya.izakaya['name'],
      address: izakaya.detail?.formattedAddress,
      features: [izakaya.detail?.primaryTypeDisplayName?.text ?? ''],
      feature: izakaya.izakaya['feature'],
      note: izakaya.izakaya['note'],
      regularOpeningHours:
        izakaya.detail?.regularOpeningHours?.weekdayDescriptions,
      websiteUri: izakaya.detail?.websiteUri,
      googleMapsUri: izakaya.detail?.googleMapsUri,
      reason: izakaya.izakaya['reason'],
    }
  })
  // console.log(izakayaList)
  return json({ izakayaList, textQuery })
}

export default function Index() {
  const data: { izakayaList: Izakaya[]; textQuery: string } =
    useActionData<typeof action>()

  const resetForm = () => {
    window.location.reload()
  }

  const navigation = useNavigation()

  return (
    <div className="container px-4 md:px-6">
      <Description />
      <MultiStepForm />

      {data?.izakayaList.length ? (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6 text-center">
            おすすめのお店
          </h1>
          <IzakayaList
            izakayas={data.izakayaList}
            onReset={resetForm}
            textQuery={data.textQuery}
          />
        </div>
      ) : navigation.state === 'submitting' ? (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6 text-center">
            おすすめのお店
          </h1>
          <SkeletonCard />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
