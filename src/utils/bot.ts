import Bot from 'feishu-bot'

const bot = new Bot(
  'https://open.feishu.cn/open-apis/bot/v2/hook/a80fb039-3787-4e74-a6ac-3dca825b0fb2'
)

bot.registeTemplate(
  'NFT',
  {
    msg_type: 'post',
    content: {
      post: {
        zh_cn: {
          title: '{Title}',
          content: [
            [
              {
                tag: 'text',
                text: '{Content}',
              },
              {
                tag: 'a',
                text: '点击查看',
                href: '{URL}',
              },
            ],
          ],
        },
      },
    },
  },
  true
)

export default bot
