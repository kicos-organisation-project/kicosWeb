import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-picker-wrap">
      <div #mapContainer class="map-picker"></div>
      <p class="map-hint">Cliquez sur la carte ou déplacez le marqueur pour définir la position.</p>
    </div>
  `,
  styles: [`
    .map-picker {
      height: 220px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      z-index: 0;
    }
    .map-hint {
      margin: 8px 0 0;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  `],
})
export class MapPickerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @Input() latitude: number | string | null = null;
  @Input() longitude: number | string | null = null;
  @Output() coordinatesChange = new EventEmitter<{ latitude: number; longitude: number }>();

  private map?: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map || !this.marker) {
      return;
    }
    if (changes['latitude'] || changes['longitude']) {
      const lat = this.toNumber(this.latitude, 14.7167);
      const lng = this.toNumber(this.longitude, -17.4677);
      this.marker.setLatLng([lat, lng]);
      this.map.setView([lat, lng], this.map.getZoom());
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    const lat = this.toNumber(this.latitude, 14.7167);
    const lng = this.toNumber(this.longitude, -17.4677);

    this.map = L.map(this.mapContainer.nativeElement).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
    this.marker.on('dragend', () => this.emitCoordinates());
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.marker?.setLatLng(event.latlng);
      this.emitCoordinates();
    });

    setTimeout(() => this.map?.invalidateSize(), 0);
    setTimeout(() => this.map?.invalidateSize(), 300);
    setTimeout(() => this.map?.invalidateSize(), 600);
  }

  /** Call when parent dialog/modal becomes visible. */
  refreshSize(): void {
    setTimeout(() => this.map?.invalidateSize(), 50);
  }

  private emitCoordinates(): void {
    const position = this.marker?.getLatLng();
    if (!position) {
      return;
    }
    this.coordinatesChange.emit({
      latitude: Number(position.lat.toFixed(6)),
      longitude: Number(position.lng.toFixed(6)),
    });
  }

  private toNumber(value: number | string | null, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
}
