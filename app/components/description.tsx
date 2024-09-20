import { Info } from 'lucide-react'
export function Description() {
  return (
    <section className="bg-secondary text-secondary-foreground py-8 px-6">
      <div className="container mx-auto">
        <div className="flex items-start space-x-4">
          <Info className="h-6 w-6 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-semibold mb-2">サービスの特徴</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>日時、場所、参加者、予算を入力するだけで最適なお店を提案</li>
              <li>個人の希望や特別な要望にも対応</li>
              <li>予算に合わせた柔軟な提案</li>
              <li>豊富な居酒屋データベースを活用</li>
            </ul>
            <p className="mt-4">
              このサービスを使えば、面倒なお店探しの手間を大幅に削減できます。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
