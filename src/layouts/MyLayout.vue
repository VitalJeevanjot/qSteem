<template>
<q-layout>
  <q-layout-header :reveal="reveal" class="justify-center">
    <q-toolbar color="white">
      <q-toolbar-title class="text-teal accent-1-text" :inverted="$q.theme === 'ios'">
        STEEM
      </q-toolbar-title>
    </q-toolbar>
  </q-layout-header>
  <q-page-container>
    <q-tabs animated swipeable inverted color="secondary" align="justify">
      <q-tab name="created" slot="title" icon="access_time" @click="type = 'created'; check()"/>
      <q-tab name="hot" slot="title" icon="whatshot" @click="type = 'hot'; check()"/>
      <q-tab name="trending" slot="title" icon="trending_up" @click="type = 'trending'; check()"/>
      <q-tab name="promoted" slot="title" icon="attach_money" @click="type = 'promoted'; check()"/>
    </q-tabs>
    <q-page class="row justify-center">
      <q-pull-to-refresh :handler="refresh">
      <q-list no-border>
        <q-infinite-scroll :handler="refresher">
          <q-item v-for='item in items' :key='item.title' sparse>
            <q-card inline class="q-ma-sm no-wrap" style="width: 300px">
              <q-item>
                <q-item-side :avatar="item.profilePic" />
                <q-item-main>
                  <q-item-tile label>{{item.author}}</q-item-tile>
                  <q-item-tile sublabel>Subhead</q-item-tile>
                </q-item-main>
              </q-item>
              <q-card-media align="center">
                <img :src="item.image" style="width: 350px; height: 300px; object-fit: cover;" class="cover" />
              </q-card-media>
              <q-card-title class="relative-position">
                <div>{{item.title}}</div>
              </q-card-title>
              <q-card-separator />
              <q-card-actions align="between">
                <div class="left">
                  <span class="justify-center text-grey">{{item.upvotes}}</span>
                  <span class="justify-center text-grey"> likes</span>
                  <span class="justify-center text-grey"> |</span>
                  <q-btn flat color="black" icon="comment" />
                  <span class="justify-center text-grey">{{item.comments}}</span>
                </div>
                <div class="right">
                  <span class="justify-center text-grey">$ </span>
                  <span class="justify-center text-grey">{{item.payoutval}}</span>
                  <span class="justify-center text-grey"> |</span>
                  <q-btn flat color="black" :icon="icon" />
                </div>
              </q-card-actions>
            </q-card>
            <q-item-separator/>
          </q-item>
          <div class="row justify-center" style="margin-bottom: 50px;">
            <q-spinner-dots slot="message" :size="40" />
          </div>
        </q-infinite-scroll>
      </q-list>
    </q-pull-to-refresh>
    </q-page>
  </q-page-container>
</q-layout>
</template>

<script>
export default {
  data () {
    return {
      items: [],
      reveal: true,
      icon: 'keyboard_arrow_up',
      type: ''
    }
  },
  methods: {
    refresher (index, done) {
      console.log('refreses')
      this.func().then((e) => { done() })
    },
    refresh (done) {
      this.check()
      done()
    },
    func: async function () {
      console.log('calleddsd')
      await this.$steemClient.database.getDiscussions(this.type, {
        tag: '',
        limit: 12,
        start_permlink: window.permlink,
        start_author: window.author
      }).then((discussion) => {
        for (let i = 0; i < 11; i++) {
          // Get user info
          window.author = discussion[i + 1].author
          window.permlink = discussion[i + 1].permlink
          let jsonM = JSON.parse(discussion[i].json_metadata)
          let images = []
          images = jsonM.image
          // User account retreival profile_pic_url ppu
          try {
            this.items.push({
              title: discussion[i].title,
              author: discussion[i].author,
              image: images[0],
              upvotes: discussion[i].net_votes,
              comments: discussion[i].children,
              payoutval: Number(parseFloat(discussion[i].pending_payout_value.split(' ')[0]).toFixed(2))
            })
          } catch (e) {
            this.items.push({
              title: discussion[i].title,
              author: discussion[i].author,
              image: require('../../img/num.png'),
              upvotes: discussion[i].net_votes,
              comments: discussion[i].children,
              payoutval: Number(parseFloat(discussion[i].pending_payout_value.split(' ')[0]).toFixed(2))
            })
          }
          console.log(discussion[i])
        }
      })
    },
    check: function () {
      console.log('called')
      this.items = []
      window.permlink = undefined
      window.author = undefined
      this.func()
    }
  },
  mounted () {
    this.type = 'trending'
    window.permlink = undefined
    window.author = undefined
  }
}
</script>

<style>
</style>
