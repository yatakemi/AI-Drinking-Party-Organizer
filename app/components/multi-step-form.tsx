'use client'

import { Form, useNavigation } from '@remix-run/react'
import { Loader2, Minus, Plus } from 'lucide-react'
import React, { useReducer } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Izakaya } from './izakaya-list'

type Person = {
  name: string
  wish: string
}

type FormState = {
  step: number
  purpose: string
  date: string
  location: string
  people: Person[]
  budget: number
  otherWishes: string
  izakayaList: Izakaya[]
  showIzakayaList: boolean
}

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; field: string; value: string | number }
  | { type: 'ADD_PERSON' }
  | { type: 'REMOVE_PERSON'; index: number }
  | {
      type: 'UPDATE_PERSON'
      index: number
      field: 'name' | 'wish'
      value: string
    }
  | { type: 'INCREMENT_BUDGET' }
  | { type: 'DECREMENT_BUDGET' }
  | { type: 'SET_IZAKAYA_LIST'; list: Izakaya[] }
  | { type: 'SHOW_IZAKAYA_LIST' }

const initialState: FormState = {
  step: 1,
  purpose: '',
  date: '',
  location: '',
  people: [{ name: '', wish: '' }],
  budget: 5000,
  otherWishes: '',
  izakayaList: [],
  showIzakayaList: false,
}

function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 4) }
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) }
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    case 'ADD_PERSON':
      return { ...state, people: [...state.people, { name: '', wish: '' }] }
    case 'REMOVE_PERSON':
      return {
        ...state,
        people: state.people.filter((_, i) => i !== action.index),
      }
    case 'UPDATE_PERSON':
      return {
        ...state,
        people: state.people.map((person, i) =>
          i === action.index
            ? { ...person, [action.field]: action.value }
            : person
        ),
      }
    case 'INCREMENT_BUDGET':
      return { ...state, budget: state.budget + 1000 }
    case 'DECREMENT_BUDGET':
      return { ...state, budget: Math.max(state.budget - 1000, 0) }
    case 'SET_IZAKAYA_LIST':
      return { ...state, izakayaList: action.list }
    case 'SHOW_IZAKAYA_LIST':
      return { ...state, showIzakayaList: true }
    default:
      return state
  }
}

export function MultiStepForm() {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const navigation = useNavigation()

  const ref = React.createRef<HTMLDivElement>()
  const scroll = React.useCallback(() => {
    ref!.current!.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [ref])
  React.useEffect(() => {
    if (navigation.state === 'submitting') {
      scroll()
    }
  }, [navigation])

  return (
    <Form replace method="post" id="search-condition" className="space-y-8">
      <div className="py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="bg-primary/10 p-4 rounded-lg">
              <Label
                htmlFor="purpose"
                className="text-lg font-semibold text-primary mb-2 block"
              >
                どのような飲み会をお考えですか？
                <Label className="text-red-500">*</Label>
              </Label>
              <Input
                id="purpose"
                name="purpose"
                placeholder="例: 山田さんの歓迎会、高橋さんの送別会、部の忘年会など"
                value={state.purpose}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'purpose',
                    value: e.target.value,
                  })
                }
                className="mt-1 text-lg border-2 border-primary focus:ring-primary focus:border-primary"
                required
                maxLength={30}
              />
            </div>
            <div className="flex justify-center items-center gap-4">
              <Label className="w-12" htmlFor="location">
                場所 <Label className="text-red-500">*</Label>
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="例: 東京駅周辺"
                value={state.location}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'location',
                    value: e.target.value,
                  })
                }
                maxLength={30}
                required
              />
            </div>
          </CardHeader>
          <CardContent className="py-8">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`text-xs font-medium ${
                      step <= state.step
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step === 1 && '日時'}
                    {step === 2 && '参加者'}
                    {step === 3 && '予算'}
                    {step === 4 && 'その他要望'}
                  </div>
                ))}
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(state.step / 4) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={(state.step / 4) * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>

            <div className={`space-y-6 ${state.step === 1 ? '' : 'hidden'}`}>
              <div>
                <Label htmlFor="date">日時</Label>
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  value={state.date}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_FIELD',
                      field: 'date',
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={`space-y-4 ${state.step === 2 ? '' : 'hidden'}`}>
              {state.people.map((person, index) => (
                <div key={index} className="flex items-end space-x-2">
                  <div className="flex-2">
                    <Label htmlFor={`name-${index}`}>名前</Label>
                    <Input
                      id={`name-${index}`}
                      name={`user[${index}][name]`}
                      placeholder="例: 山田さん"
                      value={person.name}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_PERSON',
                          index,
                          field: 'name',
                          value: e.target.value,
                        })
                      }
                      maxLength={15}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`wish-${index}`}>希望</Label>
                    <Input
                      id={`wish-${index}`}
                      name={`user[${index}][wish]`}
                      placeholder="例: ビールが苦手、肉が食べたいなど"
                      value={person.wish}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_PERSON',
                          index,
                          field: 'wish',
                          value: e.target.value,
                        })
                      }
                      maxLength={30}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => dispatch({ type: 'REMOVE_PERSON', index })}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">参加者を削除</span>
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => dispatch({ type: 'ADD_PERSON' })}
                className="w-full"
                variant="secondary"
              >
                <Plus className="h-4 w-4 mr-2" /> 参加者を追加
              </Button>
            </div>

            <div className={`space-y-4 ${state.step === 3 ? '' : 'hidden'}`}>
              <Label htmlFor="budget">予算</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => dispatch({ type: 'DECREMENT_BUDGET' })}
                  variant="outline"
                  size="icon"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">予算を1000円減らす</span>
                </Button>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={state.budget}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_FIELD',
                      field: 'budget',
                      value: parseInt(e.target.value),
                    })
                  }
                  className="text-center"
                />
                <Label className="w-12">円/人</Label>
                <Button
                  type="button"
                  onClick={() => dispatch({ type: 'INCREMENT_BUDGET' })}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">予算を1000円増やす</span>
                </Button>
              </div>
            </div>

            <div className={`space-y-2 ${state.step === 4 ? '' : 'hidden'}`}>
              <Label htmlFor="otherWishes">その他の要望</Label>
              <Textarea
                id="otherWishes"
                name="otherWishes"
                placeholder="例：個室を希望する、座敷はNGなど"
                value={state.otherWishes}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'otherWishes',
                    value: e.target.value,
                  })
                }
                rows={4}
                maxLength={200}
              />
              <div className="text-sm text-muted-foreground text-right">
                {state.otherWishes.length} / 200 文字
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="flex justify-between w-full">
              <div className="w-24">
                {state.step > 1 && (
                  <Button
                    type="button"
                    onClick={() => dispatch({ type: 'PREV_STEP' })}
                    className="w-full"
                    variant="outline"
                  >
                    前へ
                  </Button>
                )}
              </div>
              <div className="w-24 text-right">
                <Button
                  type="button"
                  onClick={() => dispatch({ type: 'NEXT_STEP' })}
                  className={`w-full ${state.step < 4 ? '' : 'hidden'}`}
                  variant="outline"
                >
                  次へ
                </Button>
              </div>
            </div>
            <div className="w-full pt-6" ref={ref}>
              {navigation.state === 'submitting' ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" className="w-full" size="lg">
                  検索開始
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </Form>
  )
}
