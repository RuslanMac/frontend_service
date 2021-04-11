<template>
  <div>
    <v-container>
      <v-row>
        <v-col md="8">
          <div id="MapContainers"></div>
        </v-col>

        <v-col>
          <v-row class="mt-6">
            <v-col>
              <BaseInput type="input" v-model="nameT" label="Name"></BaseInput>
            </v-col>
            <v-col>
              <v-btn color="blue" @click="getPort()" class="mt-6">Найти</v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <div>
                <label class="mainText">Coordinates:</label>
                <br />

                <span
                  ><label>Latitude: {{ latitude }} </label>
                </span>
                <br />
                <span
                  ><label> Longitude: {{ longitude }} </label></span
                >
              </div>
            </v-col>
          </v-row>
          <br />
          <v-row class="mb-4">
            <v-col>
              <v-btn @click="getThePort()">Найти ближайший</v-btn>
            </v-col>
          </v-row>

          <v-row class="mb-2">
            <v-col>
              <v-btn @click="getPorts()">Найти все порт</v-btn>
            </v-col>
          </v-row>

          <v-row class="mb-2">
            <v-col>
              <v-btn color="blue" @click="setPoint()">Поставить маркер</v-btn>
            </v-col>
          </v-row>
          <v-row></v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster.js";
import BaseInput from "@/components/BaseInput.vue";
import apiClient from "@/services/apiPorts.js";
export default {
  data() {
    return {
      center: [37.7749, -122.4194],
      nameT: "",
      coordanates: [1, 9],

      latitude: 0,
      longitude: 0,
      map: Object,
      bounds: "",
      xMin: 0,
      yMin: 0,
      xMax: 0,
      yMax: 0,
      coordinates: [37.7749, -122.4194],
    };
  },

  methods: {
    setupMapContainer: function() {
      const mapDiv = L.map("MapContainers").setView(this.center, 13);
      let self = this;
      self.map = mapDiv;
      mapDiv.on("click", function(e) {
        self.latitude = e.latlng.lat;
        self.longitude = e.latlng.lng;
      });
      mapDiv.on("moveend", function(e) {
        console.log("The bounds: ", mapDiv.getBounds());
        console.log(e.altitude);

        self.bounds = mapDiv.getBounds();
        self.xMin = self.bounds._southWest.lat;
        self.yMin = self.bounds._southWest.lng;
        self.xMax = self.bounds._northEast.lat;
        self.yMax = self.bounds._northEast.lng;

        console.log(self.bounds);
      });

      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v11",
          accessToken:
            "pk.eyJ1IjoicnVzbGFua2FyIiwiYSI6ImNra2djcTE2MTE0OGsycHF1ZHpicnN3ZTgifQ.Z_cXtfVb5IRYhzj8ZPqiJg",
        }
      ).addTo(mapDiv);
    },

    getPort() {
      apiClient
        .getPortByName(this.nameT)
        .then((response) => {
          console.log(response.data);
          this.getPoint(response);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    setPoint() {
      var data = [this.latitude, this.longitude];
      var iconMarker = L.icon({
        iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -28],
      });
      L.marker(data, { icon: iconMarker }).addTo(this.map);
    },

    getPoint(response) {
      this.center = [];

      this.center = [response.data.port_Latitude, response.data.port_Longitude];
      this.latitude = response.data.port_Latitude;
      this.longitude = response.data.port_Longitude;
      let information = response.data;
      this.map.panTo(this.center);
      let marketicon = new L.icon({
        iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -28],
      });
      L.marker(this.center, { icon: marketicon })
        .addTo(this.map)
        .bindPopup(
          `Name: ${information.name} <br> Index_Number: ${information.id} <br> Country: ${information.country} `
        )
        .openPopup();
    },

    getThePort() {
      let markerRed = new L.icon({
        iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png ",
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -28],
      });

      let data = [this.latitude, this.longitude];

      apiClient
        .getTheNearestPort(data)
        .then((response) => {
          this.getPoint(response);
          console.log(response.data);
          L.marker(data, { icon: markerRed }).addTo(this.map);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    getPorts() {
      let marketicon = new L.icon({
        iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -28],
      });
      let markers = new L.MarkerClusterGroup();
      apiClient
        .getPortInRectangle(this.xMin, this.yMin, this.xMax, this.yMax)
        .then((response) => {
          console.log(response.data);
          var objects = response.data;
          for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];

            for (var prop in obj) {
              if (obj[prop] !== null && !isNaN(obj[prop])) {
                obj[prop] = +obj[prop];
              }
            }
            let marker = L.marker([obj.portLatitude, obj.portLongitude], {
              icon: marketicon,
            }).bindPopup(`Name: ${obj.name}  <br> Index_Number: ${obj.id}<br> Country: ${obj.country}`); 
            markers.addLayer(marker);
          }
          this.map.addLayer(markers);
        });
    },
  },

  mounted() {
    this.latitude = 1;
    this.longitude = 9;
    this.setupMapContainer();
  },

  components: {
    BaseInput,
  },
};
</script>

<style scoped>
#MapContainers {
  width: 840px;
  height: 600px;
  justify-content: left;
  margin: auto;
}
.infoClass {
  width: 100%;
  height: 100%;
  border-top: 1px solid green;
  margin: 10px;
}
.mainText {
  font-size: 24px;
  font-weight: bold;
}
</style>
