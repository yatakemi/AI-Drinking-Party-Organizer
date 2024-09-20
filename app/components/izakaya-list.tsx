import { Link } from '@remix-run/react'
import { Clock, ExternalLink, MapPin, Tag, ThumbsUp } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export type Izakaya = {
  name: string
  address?: string | null
  price?: number | null
  reason?: string | null
  features: string[]
  feature?: string | null
  note?: string | null
  regularOpeningHours?: string[] | null
  websiteUri?: string | null
  googleMapsUri?: string | null
}

interface IzakayaListProps {
  izakayas?: Izakaya[]
  textQuery?: string
  onReset: () => void
}

export default function IzakayaList({
  izakayas = [],
  textQuery,
  onReset,
}: IzakayaListProps) {
  if (!izakayas || izakayas.length === 0) {
    return (
      <div className="text-center p-4">
        表示する情報がありません。再検索してください。
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6 items-center">
      {izakayas.map((izakaya, index) => (
        <Card key={index} className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{izakaya.name}</CardTitle>
            {izakaya.address && (
              <CardDescription className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {izakaya.address}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {izakaya.reason && (
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <h4 className="font-semibold flex items-center text-primary mb-2">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  おすすめポイント
                </h4>
                <p>{izakaya.reason}</p>
              </div>
            )}

            {izakaya.price && (
              <p className="mb-2">
                価格帯:{' '}
                {new Intl.NumberFormat('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                }).format(izakaya.price)}
              </p>
            )}
            {izakaya.features && izakaya.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {izakaya.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
            {izakaya.feature && <p className="mb-2">{izakaya.feature}</p>}
            {izakaya.note && (
              <p className="mb-2 text-sm text-muted-foreground">
                {izakaya.note}
              </p>
            )}
            {izakaya.regularOpeningHours &&
              izakaya.regularOpeningHours.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-semibold flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    営業時間
                  </h4>
                  {izakaya.regularOpeningHours.map((hours, idx) => (
                    <p key={idx} className="text-sm">
                      {hours}
                    </p>
                  ))}
                </div>
              )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-start gap-2">
            {izakaya.websiteUri && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={izakaya.websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ウェブサイト
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            )}
            {izakaya.googleMapsUri && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={izakaya.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Maps
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      <Button
        type="button"
        variant="destructive"
        onClick={onReset}
        className="w-full max-w-2xl mt-4"
      >
        検索条件をリセットする
      </Button>
      <Button type="button" variant="link" className="w-full max-w-2xl mt-4">
        <Link
          to={`https://www.google.com/search?q=${textQuery}&tbm=lcl`}
          target="_blank"
          rel="noopener noreferrer"
        >
          他のお店を探す
        </Link>
        <ExternalLink className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
