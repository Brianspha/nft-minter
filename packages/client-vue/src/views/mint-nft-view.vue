<template>
  <v-container fluid>
    <v-row>
      <v-toolbar :color="$store.state.color" dark
        ><v-toolbar-title>Mint NFT</v-toolbar-title>
      </v-toolbar></v-row
    >
    <v-container fluid>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="address"
                :rules="addressRules"
                counter
                label="Address"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center"
            ><v-btn :color="$store.state.color" @click="mint"
              >Mint</v-btn
            ></v-row
          >
        </v-container>
      </v-form></v-container
    >
  </v-container>
</template>

<script>
import swal from "sweetalert2";

export default {
  data() {
    return {
      valid: true,
      address: "",
      addressRules: [(v) => !!v || "Address Required"],
    };
  },
  methods: {
    mint() {
      if (this.$refs.form.validate()) {
        var axios = require("axios").default;
        axios({
          headers: { "Content-Type": "application/json" },
          method: "get",
          url: process.env.VUE_APP_SERVER_URL + "/api/mint",
          data: {
            address: this.address,
            tokenid: -1,
          },
        })
          .then((results) => {
            if (!results.data.error) {
              this.success("Succesfully minted token");
              console.log("results: ", results.data);
            } else {
              this.error("Somethign went wrong whilst minting token");
            }
          })
          .catch((error) => {
            console.log("error: ", error);
            this.error("Somethign went wrong whilst minting token");
          });
      } else {
        this.error("Address field required");
      }
    },
    success(message) {
      swal.fire({
        title: "Success",
        text: message,
        icon: "success",
      });
    },
    error(message) {
      swal.fire({
        title: "Error",
        text: message,
        icon: "error",
      });
    },
  },
};
</script>

<style></style>
