<template>
<div>
  <ion-tabs data-testid="tabs">
    <ion-tab data-testid="tab-schedule" tab="schedule" :routes="['schedule', 'session-detail']">
      <ion-vue-router name="session"></ion-vue-router>
    </ion-tab>

    <ion-tab data-testid="tab-speakers" tab="speakers" :routes="['speakers', 'speaker-detail', 'speaker-session-detail']">
      <ion-vue-router name="speaker"></ion-vue-router>
    </ion-tab>

    <ion-tab data-testid="tab-map" tab="map">
      <ion-vue-router name="map"></ion-vue-router>
    </ion-tab>

    <ion-tab data-testid="tab-map" tab="about">
      <ion-vue-router name="about"></ion-vue-router>
    </ion-tab>

    <ion-tab-bar slot="bottom">
      <ion-tab-button data-testid="tab-bar-schedule" tab="schedule">
        <ion-label>Schedule</ion-label>
        <ion-icon name="calendar" />
      </ion-tab-button>

      <ion-tab-button data-testid="tab-bar-speakers" tab="speakers">
        <ion-icon name="contacts" />
        <ion-label>Speakers</ion-label>
      </ion-tab-button>

      <ion-tab-button data-testid="tab-bar-map" tab="map">
        <ion-icon name="map" />
        <ion-label>Map</ion-label>
      </ion-tab-button>

      <ion-tab-button data-testid="tab-bar-about" tab="about">
        <ion-icon name="information-circle" />
        <ion-label>About</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Tabs extends Vue {}
</script>
