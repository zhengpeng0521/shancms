import Mock from 'mockjs'

const Random = Mock.Random
const opts = [
  {
    id: '11111111',
    name: '中国队长'
  },
  {
    id: '2222222222',
    name: '灭霸'
  }
]

const saleList = []
const count = 20

for (let i = 0; i < count; i++) {
  saleList.push(
    Mock.mock({
      audition: Random.integer(0, 30),
      auditionAttend: Random.integer(0, 30),
      auditionCadet: Random.integer(0, 30),
      auditionRate: '0.00',
      callConn: Random.integer(0, 30),
      callTimeLength: Random.integer(0, 30),
      callTimeLengthStr: '00:00:00',
      callTotal: Random.integer(0, 30),
      followLeadsNum: Random.integer(0, 30),
      followRecordsNum: Random.integer(0, 30),
      newLeadsNum: Random.integer(0, 30),
      orgId: null,
      tenantId: 36053,
      userId: '3605300002',
      userName: Random.cname(),
      visitMaa: Random.integer(0, 30),
      visitedNum: Random.integer(0, 30)
    })
  )
}

const channelData = {
  channel: [],
  secondChannel: []
}

for (let i = 0; i < 3; i++) {
  channelData.channel.push(
    Mock.mock({
      name: Random.cname(),
      num: Random.integer(0, 30),
      ratio: '100.0000%'
    })
  )
  channelData.secondChannel.push(
    Mock.mock({
      name: Random.cname(),
      num: Random.integer(0, 30),
      ratio: '100.0000%'
    })
  )
}

export default {
  getSelect: () => {
    return {
      list: opts
    }
  },
  getSaleWork: () => ({
    items: saleList,
    total: count
  }),
  getChannel: () => channelData
}
