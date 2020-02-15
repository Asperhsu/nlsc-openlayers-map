<template>
    <vl-map style="height: 100vh;" ref="map" @click="onMapClick" @mounted="onMapMounted">
        <vl-view :zoom.sync="map.zoom" :center.sync="map.center" :rotation.sync="map.rotation"></vl-view>

        <vl-layer-tile id="wmts">
            <vl-source-wmts v-bind="map.wmtsSource"></vl-source-wmts>
        </vl-layer-tile>

        <vl-geoloc v-if="geolocation.enable" @update:position="geolocation.position = $event">
            <template slot-scope="geoloc">
                <vl-feature v-if="geoloc.position" id="position-feature">
                    <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
                    <vl-style-box>
                        <vl-style-icon :src="require('@/assets/marker.png')" :scale="0.6" :anchor="[0.5, 1]"></vl-style-icon>
                    </vl-style-box>
                </vl-feature>
            </template>
        </vl-geoloc>

        <vl-overlay v-show="popup.show" :position="popup.position">
            <popup :content="popup.content" @close="popup.show = false"></popup>
        </vl-overlay>
    </vl-map>
</template>

<script>
    import Popup from "@/components/Popup.vue";
    import { pointToLonLat } from 'vuelayers/lib/ol-ext';
    import { addControl } from '@/mapHelpers.js';

    export default {
        components: {Popup},

        data () {
            return {
                map: {
                    zoom: 8,
                    center: [13499719, 2680669],
                    rotation: 0,
                    wmtsSource: {
                        attributions: '<a href="http://maps.nlsc.gov.tw/" target="_blank">國土測繪圖資服務雲</a>',
                        url: 'https://wmts.nlsc.gov.tw/wmts',
                        layerName: 'EMAP',
                        matrixSet: 'EPSG:3857',
                        format: 'image/png',
                        styleName: 'default',
                        wrapX: true,
                    },
                },

                geolocation: {
                    enable: false,
                    position: undefined,
                },

                popup: {
                    show: false,
                    position: [0, 0],
                    content: null,
                },
            }
        },

        watch: {
            // move map center to marker
            'geolocation.position' (value) {
                this.map.center = value;
                this.map.zoom = 15;
            }
        },

        methods: {
            onMapMounted () {
                let GeolocationControl = addControl('L', 'geolocation-btn', () => {
                    this.geolocation.enable = true;
                });

                this.$refs.map.$map.getControls().extend([
                    new GeolocationControl(),
                ])
            },
            onMapClick (e) {
                this.showPopup(e.coordinate);
            },
            showPopup (coordinate) {
                let lonLat = pointToLonLat(coordinate);
                this.popup = {
                    show: true,
                    position: coordinate,
                    content: `<div>Lon: ${lonLat[0].toFixed(2)}</div><div>Lat: ${lonLat[1].toFixed(2)}</div>`,
                };
            },
        },
    }
</script>

<style>
    html, body {
        padding: 0;
        margin: 0;
    }

    .geolocation-btn {
        top: 65px;
        left: .5em;
    }
</style>