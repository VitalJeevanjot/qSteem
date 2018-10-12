<template>
<q-layout>
  <q-layout-header :reveal="reveal">
    <q-toolbar color="white">
      <q-toolbar-title class="text-teal accent-1-text" :inverted="$q.theme === 'ios'">
        STEEM
      </q-toolbar-title>
    </q-toolbar>
  </q-layout-header>
  <q-page-container>
    <q-page class="row justify-center">
      <q-list no-border>
        <q-infinite-scroll :handler="refresher">
          <q-item v-for='item in items' :key='item.title' sparse>
            <q-card inline class="q-ma-sm no-wrap" style="width: auto">
              <q-item>
                <q-item-side :avatar="item.profilePic" />
                <q-item-main>
                  <q-item-tile label>{{item.author}}</q-item-tile>
                  <q-item-tile sublabel>Subhead</q-item-tile>
                </q-item-main>
              </q-item>
              <q-card-media align="center">
                <img :src="item.image" style="width: 95vw; height: 70vw; object-fit: cover;" class="cover" />
              </q-card-media>
              <q-card-title class="relative-position">
                <div>{{item.title}}</div>
              </q-card-title>
              <q-card-separator />
              <q-card-actions align="between">
                <div class="left">
                  <span class="justify-center text-grey">0 </span>
                  <span class="justify-center text-grey"> likes</span>
                  <span class="justify-center text-grey"> |</span>
                  <q-btn flat color="black" icon="comment" />
                  <span class="justify-center text-grey">0</span>
                </div>
                <div class="right">
                  <span class="justify-center text-grey">$ </span>
                  <span class="justify-center text-grey">0.00</span>
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
      icon: 'keyboard_arrow_up'
    }
  },
  methods: {
    refresher (index, done) {
      this.func().then((e) => { done() })
    },
    func: async function () {
      await this.$steemClient.database.getDiscussions('trending', {
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
              image: images[0]
            })
          } catch (e) {
            this.items.push({
              title: discussion[i].title,
              author: discussion[i].author,
              image: require('../../img/num.png')
            })
          }
          console.log(discussion[i])
        }
      })
    }
  },
  mounted () {
    window.permlink = undefined
    window.author = undefined
  }
}
</script>

<style>
</style>
