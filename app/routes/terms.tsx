export default function Terms() {
  return (
    <div className="container px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          利用にあたっての注意事項
        </h1>

        <p>
          本サービスをご利用いただく前に、以下の注意事項をよくお読みください。
        </p>

        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          利用について
        </h2>
        <ul>
          <li>
            本サービスはGoogle Vertex
            AIを利用しているため、以下に注意してください。
          </li>
        </ul>
        <ul>
          <li>
            <strong>機密情報を入力しないでください。</strong>
            個人情報や企業秘密など、秘匿すべき情報は入力しないでください。AI学習に利用される可能性があり、情報漏洩のリスクがあります。
          </li>
          <li>
            <strong>表示される内容はあくまで参考です。</strong>
            AIが生成した情報は、実際のお店と異なる場合があります。必ずお店のウェブサイト等で最新の情報をご確認ください。
          </li>
          <li>
            <strong>ハレーションが発生する可能性があります。</strong>
            AIは、学習データの偏りなどにより、誤った情報や偏った情報を生成することがあります。表示される内容について、複数の情報源で確認することをおすすめします。
          </li>
        </ul>

        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          禁止事項
        </h2>
        <ul>
          <li>本サービスを不正な目的で使用すること。</li>
          <li>本サービスの運営を妨げる行為を行うこと。</li>
          <li>本サービスの情報を無断で複製、転載、改変すること。</li>
          <li>本サービスに接続する際に、不正なプログラムを使用すること。</li>
          <li>その他、法令に違反する行為を行うこと。</li>
        </ul>

        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          免責事項
        </h2>
        <ul>
          <li>
            本サービスの利用により発生した、いかなる損害についても、一切の責任を負いません。
          </li>
          <li>
            本サービスに含まれる情報については、その正確性、完全性、有用性等について、いかなる保証も行いません。
          </li>
          <li>本サービスの提供を中断または中止する場合があります。</li>
          <li>
            本サービスは、現状のまま提供されており、いかなる保証も付与されません。
          </li>
        </ul>

        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          その他の注意事項
        </h2>
        <ul>
          <li>
            本サービスは、あくまで参考情報提供を目的としています。最終的な判断は、お客様ご自身で行ってください。
          </li>
          <li>
            本サービスの利用により発生した損害について、一切の責任を負いません。
          </li>
          <li>本サービスの仕様は、予告なく変更される場合があります。</li>
        </ul>

        <p>上記注意事項をよくお読みいただき、本サービスをご利用ください。</p>
      </div>
    </div>
  )
}
