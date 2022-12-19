import Vue from 'vue'

export default ({ app }, inject) => {
  const constant = {
    itemsPerPageOptions: [20, 50],

    templateParamType: [
      {
        text: '手動設定',
        value: 'manual'
      },
      {
        text: 'システム設定値',
        value: 'system'
      }
    ],
    templateSystemValue: [
      {
        text: 'ユーザー名',
        value: 'loginUser'
      },
      {
        text: 'メールアドレス',
        value: 'loginMail'
      },
      {
        text: 'タイムスタンプ',
        value: 'timestamp'
      }
    ],
    templateParamTarget: [
      {
        text: '作成',
        value: 'create'
      },
      {
        text: 'オープン',
        value: 'open'
      }
    ],
    recordsetModels: [
      {
        text: 'RSSサンプル',
        value: 'RssSample'
      },
      {
        text: '営業報告サンプル',
        value: 'SampleBusinessReport'
      }
    ]
  }

  Vue.prototype.$const = constant
  inject('const', constant)
}
