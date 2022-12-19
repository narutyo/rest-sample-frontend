export default ({ $axios, $toast }) => {
  // ベースURL
  // $axios.setBaseURL('http://localhost/ideabox-api')
  // ヘッダ
  $axios.setHeader('X-Requested-With', 'XMLHttpRequest')

  // リクエストログ
  $axios.onRequest((config) => {
    // console.log(config)
  })
  // レスポンスログ
  $axios.onResponse((config) => {
    // console.log(config)
  })
  // エラーログ
  $axios.onError((e) => {
    const res = e.response
    // console.log(res)
    const status = res?.status ?? 500

    switch (status) {
      case 429:
        $toast.error('アクセス回数が多すぎたため、サーバーエラーが発生しました。<br />しばらく経ってから操作を行ってください。')
        break
      case 500:
        $toast.error('サーバーエラーが発生しました。<br />しばらく経ってから操作を行ってください。')
        break
      default:
        console.error(res)
        if (res.data?.message) {
          $toast.error(res.data.message)
        }
        break
    }
  })
}
