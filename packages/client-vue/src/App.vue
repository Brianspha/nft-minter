<template>
  <!-- App.vue -->

  <v-app>
    <v-app-bar app>
      <!-- -->
      <v-toolbar-title>NFT Minter</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <v-card>
          <v-tabs :color="$store.state.color" right>
            <v-tab>NEAR</v-tab>
            <v-tab>Ethereum</v-tab>
            <v-tab-item>
              <v-container fluid>
                <v-row> <mint-nft-view /></v-row>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import MintNftView from "./views/mint-nft-view.vue";
export default {
  name: "App",

  components: { MintNftView },

  data: () => ({
    //
  }),
};
</script>
